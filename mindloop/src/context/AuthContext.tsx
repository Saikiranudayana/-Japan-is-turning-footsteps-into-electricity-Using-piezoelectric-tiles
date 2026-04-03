import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface User {
  id: number;
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginError: string | null;
  isDemo: boolean;
  login: () => void;
  loginDemo: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginError: null,
  isDemo: false,
  login: () => {},
  loginDemo: () => {},
  logout: () => {},
});

/** Demo user shown when backend is unavailable */
const DEMO_USER: User = {
  id: 0,
  email: "demo@stepsync.app",
  name: "Demo User",
  picture: "",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Check session on mount
  useEffect(() => {
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async () => {
    setLoginError(null);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoginError("No redirect URL received from server.");
      }
    } catch {
      setLoginError(
        "Cannot reach the backend server. Start it with: uvicorn app.main:app --reload"
      );
    }
  };

  /** Enter demo mode — no backend required */
  const loginDemo = () => {
    setIsDemo(true);
    setUser(DEMO_USER);
    setLoginError(null);
  };

  const logout = async () => {
    if (!isDemo) {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }
    setUser(null);
    setIsDemo(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, loginError, isDemo, login, loginDemo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
