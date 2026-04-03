import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";

/** Hero video URL — a free dark abstract loop */
const HERO_VIDEO =
  "https://cdn.pixabay.com/video/2020/09/06/49028-457712647_large.mp4";

export default function Hero() {
  const { user, login, loginDemo, loginError, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle ?logout query param — force logout before showing login page
  useEffect(() => {
    if (searchParams.get("logout") === "true" && user) {
      logout();
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, user, logout, setSearchParams]);

  // If already logged in (and not logging out), redirect to dashboard
  useEffect(() => {
    if (user && searchParams.get("logout") !== "true") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate, searchParams]);

  return (
    <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        src={HERO_VIDEO}
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Bottom gradient fade to black */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          {...fadeUp(0)}
          className="liquid-glass rounded-full px-5 py-2 mb-8 text-sm text-muted-foreground"
        >
          Powered by Google Fit
        </motion.div>

        {/* Heading */}
        <motion.h1
          {...fadeUp(0.1)}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight"
        >
          Track your{" "}
          <span className="serif-italic font-normal">steps</span>
          <br />
          like code contributions
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          {...fadeUp(0.2)}
          className="mt-6 max-w-xl text-base md:text-lg text-hero-subtitle leading-relaxed"
        >
          Visualize your daily step counts as a GitHub-style contribution
          heatmap. Log in with Google, see your data, and gain insights
          into your activity patterns.
        </motion.p>

        {/* Error message */}
        <AnimatePresence>
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 liquid-glass rounded-xl px-5 py-3 flex items-start gap-3 max-w-md text-left"
            >
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{loginError}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Buttons */}
        <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-col items-center gap-4">
          {/* Google Login Button */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button size="lg" className="gap-3 px-8" onClick={login}>
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </motion.div>

          {/* Divider */}
          <div className="flex items-center gap-3 w-64">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Mode Button */}
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Button
              variant="glass"
              size="lg"
              className="gap-2 px-8"
              onClick={loginDemo}
            >
              🚀 Try Demo Mode
            </Button>
          </motion.div>

          <p className="mt-2 text-xs text-muted-foreground">
            No account needed — explore with sample data
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          {...fadeUp(0.4)}
          className="mt-14 flex flex-wrap items-center justify-center gap-3"
        >
          {["Step Heatmap", "Daily Insights", "Activity Trends"].map((t) => (
            <span
              key={t}
              className="liquid-glass rounded-full px-4 py-1.5 text-xs text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
