import { motion } from "framer-motion";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { Tooltip } from "react-tooltip";
import { fadeUp } from "@/lib/utils";

interface StepEntry {
  date: string;
  count: number;
}

interface StepHeatmapProps {
  data: StepEntry[];
  year: number;
}

/** Map step count to a color-scale CSS class */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getClassForValue(value: any) {
  if (!value || value.count === 0) return "color-empty";
  if (value.count < 3000) return "color-scale-1";
  if (value.count < 6000) return "color-scale-2";
  if (value.count < 10000) return "color-scale-3";
  return "color-scale-4";
}

export default function StepHeatmap({ data, year }: StepHeatmapProps) {
  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  return (
    <motion.div {...fadeUp(0.1)} className="liquid-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4">
        Step Activity
      </h3>

      <div className="w-full overflow-x-auto">
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={data}
          classForValue={getClassForValue}
          tooltipDataAttrs={(value: any) => {
            if (!value || !value.date) return {};
            return {
              "data-tooltip-id": "step-tooltip",
              "data-tooltip-content": `${value.date}: ${value.count.toLocaleString()} steps`,
            } as Record<string, string>;
          }}
          showWeekdayLabels
          gutterSize={3}
        />
      </div>
      <Tooltip id="step-tooltip" />

      {/* Legend */}
      <div className="flex items-center justify-end gap-1.5 mt-4 text-xs text-muted-foreground">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-[#161b22]" />
        <div className="w-3 h-3 rounded-sm bg-[#0e4429]" />
        <div className="w-3 h-3 rounded-sm bg-[#006d32]" />
        <div className="w-3 h-3 rounded-sm bg-[#26a641]" />
        <div className="w-3 h-3 rounded-sm bg-[#39d353]" />
        <span>More</span>
      </div>
    </motion.div>
  );
}
