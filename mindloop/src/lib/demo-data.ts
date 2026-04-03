/**
 * Generates realistic demo step data for the dashboard.
 */

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

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

interface DemoData {
  steps: StepEntry[];
  metrics: Metrics;
  insights: string[];
}

export function generateDemoData(
  year: number,
  month: number | null
): DemoData {
  const steps: StepEntry[] = [];

  const startDate = new Date(year, month ? month - 1 : 0, 1);
  const endDate = month
    ? new Date(year, month, 0) // last day of selected month
    : new Date(year, 11, 31);

  const today = new Date();
  const clampEnd = endDate > today ? today : endDate;

  for (let d = new Date(startDate); d <= clampEnd; d.setDate(d.getDate() + 1)) {
    const dayOfWeek = d.getDay();
    const dayOfYear =
      Math.floor(
        (d.getTime() - new Date(year, 0, 1).getTime()) / 86400000
      ) + 1;

    const seed = year * 1000 + dayOfYear;
    const r = seededRandom(seed);

    // Weekends tend to have more steps, some rest days have 0
    let count: number;
    if (r < 0.08) {
      count = 0; // rest day
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      count = Math.round(6000 + r * 12000); // 6k-18k on weekends
    } else {
      count = Math.round(2000 + r * 10000); // 2k-12k on weekdays
    }

    steps.push({
      date: d.toISOString().slice(0, 10),
      count,
    });
  }

  const totalSteps = steps.reduce((s, e) => s + e.count, 0);
  const activeDays = steps.filter((e) => e.count > 0).length;
  const totalDays = steps.length;

  const metrics: Metrics = {
    total_steps: totalSteps,
    average_steps: totalDays > 0 ? Math.round(totalSteps / totalDays) : 0,
    active_days: activeDays,
    total_days: totalDays,
    consistency_score:
      totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0,
  };

  const insights = [
    `You averaged ${metrics.average_steps.toLocaleString()} steps per day — ${metrics.average_steps >= 8000 ? "above" : "below"} the recommended 8,000 daily target.`,
    `Your most active day was ${steps.reduce((a, b) => (b.count > a.count ? b : a), steps[0]).date} with ${steps.reduce((a, b) => (b.count > a.count ? b : a), steps[0]).count.toLocaleString()} steps.`,
    `You had ${activeDays} active days out of ${totalDays} (${metrics.consistency_score}% consistency).`,
    activeDays >= totalDays * 0.8
      ? "Great consistency! You're active on most days."
      : "Try to be more consistent — aim for at least 5 active days per week.",
    "Weekend activity tends to be higher than weekdays. Consider adding a lunchtime walk on work days.",
  ];

  return { steps, metrics, insights };
}
