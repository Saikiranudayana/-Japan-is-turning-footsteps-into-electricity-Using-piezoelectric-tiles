import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import StatsCards from "@/components/StatsCards";
import StepHeatmap from "@/components/StepHeatmap";
import Filters from "@/components/Filters";
import Insights from "@/components/Insights";
import { generateDemoData } from "@/lib/demo-data";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

interface StepEntry {
  date: string;
  count: number;
}

interface Metrics {
  total_steps: number;
  average_steps: number;
  active_days: number;
  total_days: number;
  consistency_score: number;
}

export default function Dashboard() {
  const { user, loading: authLoading, isDemo } = useAuth();
  const navigate = useNavigate();

  const [steps, setSteps] = useState<StepEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) navigate("/", { replace: true });
  }, [authLoading, user, navigate]);

  // Demo data (recomputed when year/month change)
  const demoData = useMemo(
    () => (isDemo ? generateDemoData(year, month) : null),
    [isDemo, year, month]
  );

  // Load demo data when in demo mode
  useEffect(() => {
    if (isDemo && demoData) {
      setSteps(demoData.steps);
      setMetrics(demoData.metrics);
      setInsights(demoData.insights);
      setLoading(false);
      setError(null);
    }
  }, [isDemo, demoData]);

  // Fetch step data from API (real mode only)
  const fetchSteps = useCallback(async () => {
    if (isDemo) return;
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ year: String(year) });
      if (month) params.set("month", String(month));

      const res = await fetch(`${API_URL}/steps?${params}`, {
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          navigate("/", { replace: true });
          return;
        }
        throw new Error("Failed to fetch step data");
      }

      const data = await res.json();
      setSteps(data.steps ?? []);
      setMetrics(data.metrics ?? null);
      setInsights(data.insights ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [year, month, navigate, isDemo]);

  useEffect(() => {
    if (user && !isDemo) fetchSteps();
  }, [user, isDemo, fetchSteps]);

  if (authLoading) return null;

  const monthLabel = month
    ? new Date(year, month - 1).toLocaleString("default", { month: "long" })
    : null;

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <motion.div {...fadeUp(0)}>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Step Activity —{" "}
            <span className="serif-italic font-normal">
              {year}
              {monthLabel ? ` / ${monthLabel}` : ""}
            </span>
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your daily walking visualized
          </p>
        </motion.div>

        <Filters
          year={year}
          month={month}
          onYearChange={setYear}
          onMonthChange={setMonth}
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="h-8 w-8 rounded-full border-2 border-muted-foreground border-t-white animate-spin" />
        </div>
      ) : error ? (
        <motion.div
          {...fadeUp(0)}
          className="liquid-glass rounded-2xl p-8 text-center"
        >
          <p className="text-red-400">{error}</p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={fetchSteps}
              className="text-sm text-accent hover:underline"
            >
              Retry
            </button>
            <span className="text-muted-foreground">|</span>
            <button
              onClick={() => navigate("/?logout=true")}
              className="text-sm text-muted-foreground hover:text-white hover:underline"
            >
              Logout &amp; Re-login
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          {metrics && (
            <StatsCards
              totalSteps={metrics.total_steps}
              averageSteps={metrics.average_steps}
              activeDays={metrics.active_days}
              totalDays={metrics.total_days}
              consistencyScore={metrics.consistency_score}
            />
          )}

          {/* Heatmap */}
          <StepHeatmap data={steps} year={year} />

          {/* Insights */}
          <Insights insights={insights} />
        </div>
      )}
    </div>
  );
}
