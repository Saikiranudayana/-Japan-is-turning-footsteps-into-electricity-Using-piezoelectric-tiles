import { motion } from "framer-motion";
import { BookOpen, PenTool, Users, Share2 } from "lucide-react";
import { fadeUp } from "@/lib/utils";

const SOLUTION_VIDEO =
  "https://cdn.pixabay.com/video/2021/10/18/92467-635955034_large.mp4";

const FEATURES = [
  {
    icon: BookOpen,
    title: "Curated Feed",
    description:
      "Hand-picked articles, essays, and ideas — zero algorithmic noise.",
  },
  {
    icon: PenTool,
    title: "Writer Tools",
    description:
      "Powerful editor & analytics for thinkers who want to share deeply.",
  },
  {
    icon: Users,
    title: "Community",
    description:
      "Connect with curious minds in focused discussion threads.",
  },
  {
    icon: Share2,
    title: "Distribution",
    description:
      "Reach readers who care, with built-in newsletter + social sharing.",
  },
];

export default function Solution() {
  return (
    <section id="use-cases" className="py-28 md:py-36 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <motion.p
          {...fadeUp(0)}
          className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-4"
        >
          The Solution
        </motion.p>

        {/* Heading */}
        <motion.h2
          {...fadeUp(0.05)}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center"
        >
          Content that's{" "}
          <span className="serif-italic font-normal">meaningful</span>
        </motion.h2>

        {/* Video */}
        <motion.div
          {...fadeUp(0.15)}
          className="mt-14 rounded-2xl overflow-hidden aspect-[21/9]"
        >
          <video
            className="h-full w-full object-cover"
            src={SOLUTION_VIDEO}
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>

        {/* Feature grid */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, i) => (
            <motion.div
              key={feat.title}
              {...fadeUp(0.2 + i * 0.08)}
              className="liquid-glass rounded-2xl p-6"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <feat.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-base font-semibold mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
