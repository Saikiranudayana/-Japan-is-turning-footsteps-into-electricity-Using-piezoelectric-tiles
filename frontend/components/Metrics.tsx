"use client";

interface MetricsProps {
  totalSteps: number;
  averageSteps: number;
  activeDays: number;
  totalDays: number;
  consistencyScore: number;
}

/**
 * Dashboard metric cards showing summary statistics.
 */
export default function Metrics({
  totalSteps,
  averageSteps,
  activeDays,
  totalDays,
  consistencyScore,
}: MetricsProps) {
  const cards = [
    {
      label: "Total Steps",
      value: totalSteps.toLocaleString(),
      icon: "🦶",
    },
    {
      label: "Daily Average",
      value: averageSteps.toLocaleString(),
      icon: "📊",
    },
    {
      label: "Active Days",
      value: `${activeDays} / ${totalDays}`,
      icon: "🔥",
    },
    {
      label: "Consistency",
      value: `${consistencyScore}%`,
      icon: "🎯",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-4"
        >
          <div className="text-2xl mb-1">{card.icon}</div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-gray-400 mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
