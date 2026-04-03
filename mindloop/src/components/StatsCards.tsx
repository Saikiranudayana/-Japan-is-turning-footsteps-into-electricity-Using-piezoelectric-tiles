import { motion } from "framer-motion";
import { Footprints, TrendingUp, Flame, Trophy } from "lucide-react";
import { fadeUp } from "@/lib/utils";

interface StatsCardsProps {
  totalSteps: number;
  averageSteps: number;
  activeDays: number;
  totalDays: number;
  consistencyScore: number;
}

const iconClass = "h-5 w-5 text-white";

export default function StatsCards({
  totalSteps,
  averageSteps,
  activeDays,
  totalDays,
  consistencyScore,
}: StatsCardsProps) {
  const cards = [
    {
      icon: <Footprints className={iconClass} />,
      label: "Total Steps",
      value: totalSteps.toLocaleString(),
    },
    {
      icon: <TrendingUp className={iconClass} />,
      label: "Daily Average",
      value: averageSteps.toLocaleString(),
    },
    {
      icon: <Flame className={iconClass} />,
      label: "Active Days",
      value: `${activeDays} / ${totalDays}`,
    },
    {
      icon: <Trophy className={iconClass} />,
      label: "Consistency",
      value: `${consistencyScore}%`,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          {...fadeUp(i * 0.07)}
          className="liquid-glass rounded-2xl p-5"
        >
          <div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center mb-3">
            {card.icon}
          </div>
          <p className="text-2xl font-bold text-white">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
