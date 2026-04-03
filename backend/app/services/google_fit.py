"""Google Fit API service for fetching and transforming step count data."""

import logging
import httpx
from datetime import datetime, timezone
from typing import Dict, List, Optional

logger = logging.getLogger(__name__)

GOOGLE_FIT_AGGREGATE_URL = "https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate"

# Data type for step count
STEP_COUNT_DATA_TYPE = "com.google.step_count.delta"

# 1 day in milliseconds
DAY_MS = 86_400_000


async def fetch_steps(
    access_token: str,
    year: int,
    month: Optional[int] = None,
) -> List[Dict]:
    """
    Fetch daily step counts from Google Fit for a given year and optional month.
    Queries month-by-month to avoid Google's "aggregate duration too large" limit.
    Returns a list of {"date": "YYYY-MM-DD", "count": int}.
    """
    headers = {
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json",
    }

    # Build list of (start, end) month ranges
    ranges = []  # type: List[tuple]
    if month:
        ranges.append(_get_date_range(year, month))
    else:
        for m in range(1, 13):
            s, e = _get_date_range(year, m)
            # Don't query future months
            if s > datetime.now(timezone.utc):
                break
            ranges.append((s, e))

    all_results = []  # type: List[Dict]

    async with httpx.AsyncClient(timeout=30.0) as client:
        for start_dt, end_dt in ranges:
            # Clamp end to now so we don't query future
            now = datetime.now(timezone.utc)
            if end_dt > now:
                end_dt = now

            start_ms = int(start_dt.timestamp() * 1000)
            end_ms = int(end_dt.timestamp() * 1000)

            request_body = {
                "aggregateBy": [
                    {"dataTypeName": STEP_COUNT_DATA_TYPE}
                ],
                "bucketByTime": {"durationMillis": DAY_MS},
                "startTimeMillis": start_ms,
                "endTimeMillis": end_ms,
            }

            response = await client.post(
                GOOGLE_FIT_AGGREGATE_URL,
                json=request_body,
                headers=headers,
            )
            if response.status_code != 200:
                logger.error(
                    "Google Fit API error %s: %s", response.status_code, response.text
                )
                response.raise_for_status()

            data = response.json()
            all_results.extend(_transform_response(data))

    return all_results


def _get_date_range(year: int, month: Optional[int] = None):
    """Calculate start and end datetime for the given year/month."""
    if month and 1 <= month <= 12:
        start_dt = datetime(year, month, 1, tzinfo=timezone.utc)
        # Move to next month
        if month == 12:
            end_dt = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            end_dt = datetime(year, month + 1, 1, tzinfo=timezone.utc)
    else:
        start_dt = datetime(year, 1, 1, tzinfo=timezone.utc)
        end_dt = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
    return start_dt, end_dt


def _transform_response(data: dict) -> List[Dict]:
    """Transform Google Fit aggregated response into [{date, count}]."""
    results = []
    buckets = data.get("bucket", [])

    for bucket in buckets:
        start_ms = int(bucket.get("startTimeMillis", 0))
        date_str = datetime.fromtimestamp(
            start_ms / 1000, tz=timezone.utc
        ).strftime("%Y-%m-%d")

        step_count = 0
        for dataset in bucket.get("dataset", []):
            for point in dataset.get("point", []):
                for value in point.get("value", []):
                    step_count += value.get("intVal", 0)

        results.append({"date": date_str, "count": step_count})

    return results


def compute_insights(steps_data: List[Dict]) -> dict:
    """
    Compute lightweight AI insights from step data.
    Returns metrics and natural language insights.
    """
    if not steps_data:
        return {
            "total_steps": 0,
            "average_steps": 0,
            "active_days": 0,
            "insights": ["No step data available for this period."],
        }

    total_steps = sum(d["count"] for d in steps_data)
    total_days = len(steps_data)
    active_days = sum(1 for d in steps_data if d["count"] > 0)
    average_steps = round(total_steps / total_days) if total_days > 0 else 0
    consistency = round((active_days / total_days) * 100) if total_days > 0 else 0

    # Find most active day of the week
    day_totals: Dict[str, int] = {}
    day_counts: Dict[str, int] = {}
    for entry in steps_data:
        try:
            dt = datetime.strptime(entry["date"], "%Y-%m-%d")
            day_name = dt.strftime("%A")
            day_totals[day_name] = day_totals.get(day_name, 0) + entry["count"]
            day_counts[day_name] = day_counts.get(day_name, 0) + 1
        except ValueError:
            continue

    most_active_day = max(day_totals, key=day_totals.get) if day_totals else "N/A"

    # Weekly averages
    weekly_avg = round(total_steps / max((total_days / 7), 1))

    # Best single day
    best_day = max(steps_data, key=lambda d: d["count"]) if steps_data else None

    insights = []
    insights.append(f"You are most active on {most_active_day}s")
    insights.append(f"Your consistency score is {consistency}%")
    insights.append(f"Weekly average: {weekly_avg:,} steps")

    if best_day and best_day["count"] > 0:
        insights.append(
            f"Best day: {best_day['date']} with {best_day['count']:,} steps"
        )

    if average_steps >= 10000:
        insights.append("Great job! You're averaging 10,000+ steps per day")
    elif average_steps >= 7000:
        insights.append("Good progress! You're close to the 10,000 steps goal")
    elif average_steps > 0:
        insights.append(
            f"Try to increase your daily average — you need {10000 - average_steps:,} more steps/day to hit 10K"
        )

    return {
        "total_steps": total_steps,
        "average_steps": average_steps,
        "active_days": active_days,
        "total_days": total_days,
        "consistency_score": consistency,
        "most_active_day": most_active_day,
        "weekly_average": weekly_avg,
        "insights": insights,
    }
