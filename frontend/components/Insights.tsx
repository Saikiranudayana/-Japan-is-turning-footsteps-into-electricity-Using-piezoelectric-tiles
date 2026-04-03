"use client";

interface InsightsProps {
  insights: string[];
}

/**
 * AI Insights card displaying analysis of step data.
 */
export default function Insights({ insights }: InsightsProps) {
  if (!insights || insights.length === 0) return null;

  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
        <span className="text-lg">🤖</span> AI Insights
      </h3>
      <ul className="space-y-2">
        {insights.map((insight, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-green-400 mt-0.5">•</span>
            <span>{insight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
