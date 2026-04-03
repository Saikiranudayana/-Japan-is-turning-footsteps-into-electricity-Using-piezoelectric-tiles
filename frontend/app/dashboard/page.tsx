"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Heatmap from "@/components/Heatmap";
import Filters from "@/components/Filters";
import Metrics from "@/components/Metrics";
import Insights from "@/components/Insights";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface StepEntry {
  date: string;
  count: number;
}

interface StepMetrics {
  total_steps: number;
  average_steps: number;
  active_days: number;
  total_days: number;
  consistency_score: number;
}

interface UserProfile {
  id: number;
  email: string;
  name: string;
  picture: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [metrics, setMetrics] = useState<StepMetrics | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
        });
        if (!res.ok) {
          router.push("/");
          return;
        }
        const data = await res.json();
        setUser(data);
      } catch {
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  // Fetch step data whenever filters change
  const fetchSteps = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ year: String(year) });
      if (month) params.set("month", String(month));

      const res = await fetch(`${API_URL}/steps?${params.toString()}`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          router.push("/");
          return;
        }
        throw new Error("Failed to fetch step data");
      }

      const data = await res.json();
      setSteps(data.steps || []);
      setMetrics(data.metrics || null);
      setInsights(data.insights || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [year, month, router]);

  useEffect(() => {
    if (user) fetchSteps();
  }, [user, fetchSteps]);

  const handleLogout = async () => {
    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-white">StepSync</h1>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <div className="flex items-center gap-2">
              {user.picture && (
                <img
                  src={user.picture}
                  alt={user.name || "User"}
                  className="w-8 h-8 rounded-full"
                  referrerPolicy="no-referrer"
                />
              )}
              <span className="text-sm text-gray-300 hidden sm:inline">
                {user.name}
              </span>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">
          Step Activity — {year}
          {month
            ? ` / ${new Date(year, month - 1).toLocaleString("default", { month: "long" })}`
            : ""}
        </h2>
        <Filters
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400" />
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button
            onClick={fetchSteps}
            className="mt-3 text-sm text-green-400 hover:underline"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Metrics */}
          {metrics && (
            <Metrics
              totalSteps={metrics.total_steps}
              averageSteps={metrics.average_steps}
              activeDays={metrics.active_days}
              totalDays={metrics.total_days}
              consistencyScore={metrics.consistency_score}
            />
          )}

          {/* Heatmap */}
          <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
            <Heatmap data={steps} year={year} />
          </div>

          {/* AI Insights */}
          <Insights insights={insights} />
        </div>
      )}
    </div>
  );
}
