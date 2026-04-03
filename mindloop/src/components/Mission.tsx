import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { fadeUp } from "@/lib/utils";

const MISSION_VIDEO =
  "https://cdn.pixabay.com/video/2024/03/15/204233-924920956_large.mp4";

/** Words for paragraph 1 */
const PARA_1 =
  "We believe the internet should inspire you — not overwhelm you. In a world of infinite content, the real luxury is meaning. Mindloop exists to filter the noise and surface ideas worth your time.";

/** Words for paragraph 2 */
const PARA_2 =
  "Every issue is handcrafted at the intersection where curiosity meets clarity. We don't chase trends — we chase understanding. Because the best ideas deserve more than a scroll.";

const HIGHLIGHT_WORDS = new Set(["curiosity", "meets", "clarity"]);

function WordReveal({ text, startProgress, endProgress }: {
  text: string;
  startProgress: number;
  endProgress: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.35"],
  });

  const words = text.split(" ");
  const range = endProgress - startProgress;
  const step = range / words.length;

  return (
    <div ref={containerRef} className="leading-relaxed">
      {words.map((word, i) => {
        const wordStart = startProgress + i * step;
        const wordEnd = wordStart + step;

        return (
          <Word
            key={`${word}-${i}`}
            word={word}
            scrollYProgress={scrollYProgress}
            range={[wordStart, wordEnd]}
            highlight={HIGHLIGHT_WORDS.has(word.toLowerCase().replace(/[.,]/g, ""))}
          />
        );
      })}
    </div>
  );
}

function Word({
  word,
  scrollYProgress,
  range,
  highlight,
}: {
  word: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  range: [number, number];
  highlight: boolean;
}) {
  const opacity = useTransform(scrollYProgress, range, [0.15, 1]);

  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block mr-[0.3em] ${
        highlight
          ? "serif-italic text-white font-normal"
          : ""
      }`}
    >
      {word}
    </motion.span>
  );
}

export default function Mission() {
  return (
    <section id="philosophy" className="py-28 md:py-36 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Video */}
        <motion.div
          {...fadeUp(0)}
          className="rounded-2xl overflow-hidden mb-16 aspect-video"
        >
          <video
            className="h-full w-full object-cover"
            src={MISSION_VIDEO}
            autoPlay
            loop
            muted
            playsInline
          />
        </motion.div>

        {/* Scroll-reveal text */}
        <div className="space-y-10 text-2xl sm:text-3xl md:text-4xl font-light text-muted-foreground text-center">
          <WordReveal text={PARA_1} startProgress={0} endProgress={0.5} />
          <WordReveal text={PARA_2} startProgress={0.5} endProgress={1} />
        </div>
      </div>
    </section>
  );
}
