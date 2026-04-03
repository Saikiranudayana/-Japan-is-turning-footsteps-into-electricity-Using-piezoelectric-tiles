"""Authentication routes: Google OAuth login and callback."""

import httpx
from urllib.parse import urlencode
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models.user import User
from app.utils.auth import create_access_token, get_current_user_id

router = APIRouter(prefix="/auth", tags=["auth"])
settings = get_settings()

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

# Scopes: Google Fit activity read + basic profile info
SCOPES = " ".join(
    [
        "openid",
        "email",
        "profile",
        "https://www.googleapis.com/auth/fitness.activity.read",
    ]
)


@router.get("/login")
async def login():
    """Redirect user to Google OAuth consent screen."""
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": SCOPES,
        "access_type": "offline",
        "prompt": "consent",
    }
    url = f"{GOOGLE_AUTH_URL}?{urlencode(params)}"
    return {"url": url}


@router.get("/callback")
async def callback(code: str, response: Response, db: Session = Depends(get_db)):
    """Handle OAuth callback: exchange code for tokens, upsert user, set session cookie."""
    if not code:
        raise HTTPException(status_code=400, detail="Authorization code is required")

    # Exchange authorization code for tokens
    token_data = await _exchange_code(code)
    access_token = token_data.get("access_token")
    refresh_token = token_data.get("refresh_token")

    if not access_token:
        raise HTTPException(status_code=400, detail="Failed to obtain access token")

    # Fetch user profile from Google
    user_info = await _get_user_info(access_token)
    google_id = user_info.get("id")
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    if not google_id or not email:
        raise HTTPException(status_code=400, detail="Failed to retrieve user info")

    # Upsert user in database
    user = db.query(User).filter(User.google_id == google_id).first()
    if user:
        user.access_token = access_token
        if refresh_token:
            user.refresh_token = refresh_token
        user.name = name
        user.picture = picture
    else:
        user = User(
            google_id=google_id,
            email=email,
            name=name,
            picture=picture,
            access_token=access_token,
            refresh_token=refresh_token,
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    # Create JWT session token (stored in httpOnly cookie)
    session_token = create_access_token({"user_id": user.id, "email": user.email})

    # Redirect to frontend dashboard with cookie set
    response = Response(
        status_code=status.HTTP_307_TEMPORARY_REDIRECT,
        headers={"Location": f"{settings.frontend_url}/dashboard"},
    )
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=False,  # Set True in production with HTTPS
        samesite="lax",
        max_age=settings.jwt_expiration_minutes * 60,
        path="/",
    )
    return response


@router.get("/me")
async def get_me(request: Request, db: Session = Depends(get_db)):
    """Return current authenticated user profile (no tokens exposed)."""
    user_id = get_current_user_id(request)
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
    }


@router.post("/logout")
async def logout(response: Response):
    """Clear the session cookie."""
    response = Response(status_code=200, content='{"message": "Logged out"}')
    response.headers["Content-Type"] = "application/json"
    response.delete_cookie("session_token", path="/")
    return response


async def _exchange_code(code: str) -> dict:
    """Exchange authorization code for tokens."""
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        if resp.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail=f"Token exchange failed: {resp.text}",
            )
        return resp.json()


async def _get_user_info(access_token: str) -> dict:
    """Fetch user profile from Google."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )
        if resp.status_code != 200:
            raise HTTPException(
                status_code=400,
                detail="Failed to fetch user info from Google",
            )
        return resp.json()
