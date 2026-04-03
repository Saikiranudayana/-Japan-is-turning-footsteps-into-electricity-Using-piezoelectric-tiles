import { motion } from "framer-motion";
import { fadeUp } from "@/lib/utils";

interface FiltersProps {
  year: number;
  month: number | null;
  onYearChange: (y: number) => void;
  onMonthChange: (m: number | null) => void;
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

const selectClass =
  "liquid-glass rounded-lg bg-transparent text-sm text-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer";

export default function Filters({
  year,
  month,
  onYearChange,
  onMonthChange,
}: FiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  return (
    <motion.div {...fadeUp(0)} className="flex items-center gap-4">
      <div>
        <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
          Year
        </label>
        <select
          value={year}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className={selectClass}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
          Month
        </label>
        <select
          value={month ?? 0}
          onChange={(e) => {
            const v = Number(e.target.value);
            onMonthChange(v === 0 ? null : v);
          }}
          className={selectClass}
        >
          {MONTHS.map((name, i) => (
            <option key={i} value={i}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
