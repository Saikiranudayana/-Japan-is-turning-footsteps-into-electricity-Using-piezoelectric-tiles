import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { fadeUp } from "@/lib/utils";

interface InsightsProps {
  insights: string[];
}

export default function Insights({ insights }: InsightsProps) {
  if (!insights.length) return null;

  return (
    <motion.div {...fadeUp(0.15)} className="liquid-glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4" /> AI Insights
      </h3>
      <ul className="space-y-2.5">
        {insights.map((text, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
            <span className="text-accent mt-0.5 shrink-0">•</span>
            <span>{text}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
