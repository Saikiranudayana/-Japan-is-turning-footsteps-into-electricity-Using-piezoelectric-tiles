"use client";

import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";

interface StepEntry {
  date: string;
  count: number;
}

interface HeatmapProps {
  data: StepEntry[];
  year: number;
}

/**
 * GitHub-style contribution heatmap for step counts.
 * Color intensity is based on step count thresholds.
 */
export default function Heatmap({ data, year }: HeatmapProps) {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  // Map step counts to color scale classes
  const getClassForValue = (value: { date: string; count: number } | null) => {
    if (!value || value.count === 0) return "color-empty";
    if (value.count < 3000) return "color-scale-1";
    if (value.count < 6000) return "color-scale-2";
    if (value.count < 10000) return "color-scale-3";
    return "color-scale-4";
  };

  return (
    <div className="w-full">
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={data}
        classForValue={getClassForValue}
        tooltipDataAttrs={(value: { date: string; count: number } | null) => {
          if (!value || !value.date) return {};
          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": `${value.date}: ${value.count.toLocaleString()} steps`,
          };
        }}
        showWeekdayLabels
        gutterSize={3}
      />
      <Tooltip id="heatmap-tooltip" />

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-2 text-xs text-gray-400">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-[#161b22]" />
        <div className="w-3 h-3 rounded-sm bg-[#0e4429]" />
        <div className="w-3 h-3 rounded-sm bg-[#006d32]" />
        <div className="w-3 h-3 rounded-sm bg-[#26a641]" />
        <div className="w-3 h-3 rounded-sm bg-[#39d353]" />
        <span>More</span>
      </div>
    </div>
  );
}
