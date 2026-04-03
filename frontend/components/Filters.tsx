"use client";

interface FiltersProps {
  year: number;
  month: number | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number | null) => void;
}

const MONTHS = [
  "All",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Year and month filter dropdowns for the dashboard.
 */
export default function Filters({
  year,
  month,
  onYearChange,
  onMonthChange,
}: FiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-4">
      {/* Year selector */}
      <div>
        <label
          htmlFor="year-select"
          className="block text-xs text-gray-400 mb-1"
        >
          Year
        </label>
        <select
          id="year-select"
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="bg-[var(--card-bg)] border border-[var(--border)] text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* Month selector */}
      <div>
        <label
          htmlFor="month-select"
          className="block text-xs text-gray-400 mb-1"
        >
          Month
        </label>
        <select
          id="month-select"
          value={month ?? 0}
          onChange={(e) => {
            const val = Number(e.target.value);
            onMonthChange(val === 0 ? null : val);
          }}
          className="bg-[var(--card-bg)] border border-[var(--border)] text-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {MONTHS.map((name, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
