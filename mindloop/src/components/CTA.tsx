import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/utils";
import { useHls } from "@/hooks/useHls";

/**
 * HLS stream URL — replace with your own.
 * Using a public test stream as placeholder; falls back to mp4 on error.
 */
const HLS_SRC =
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

/** MP4 fallback for browsers without HLS */
const FALLBACK_MP4 =
  "https://cdn.pixabay.com/video/2023/07/31/174195-849845498_large.mp4";

/** Concentric logo icon */
function LogoIcon() {
  return (
    <div className="relative h-14 w-14 flex items-center justify-center mb-6">
      <div className="absolute h-14 w-14 rounded-full border border-white/20" />
      <div className="absolute h-9 w-9 rounded-full border border-white/40" />
      <div className="absolute h-4 w-4 rounded-full bg-white" />
    </div>
  );
}

export default function CTA() {
  const videoRef = useHls(HLS_SRC);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background HLS video */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        {/* MP4 fallback source */}
        <source src={FALLBACK_MP4} type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-2xl mx-auto">
        <motion.div {...fadeUp(0)}>
          <LogoIcon />
        </motion.div>

        <motion.h2
          {...fadeUp(0.1)}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight"
        >
          Start Your{" "}
          <span className="serif-italic font-normal">Journey</span>
        </motion.h2>

        <motion.p
          {...fadeUp(0.2)}
          className="mt-5 text-muted-foreground text-base md:text-lg max-w-lg"
        >
          Join thousands of curious minds receiving handpicked ideas every
          morning. No noise — just signal.
        </motion.p>

        <motion.div
          {...fadeUp(0.3)}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" className="gap-2">
              Subscribe Now <ArrowRight className="h-4 w-4" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button variant="glass" size="lg">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
