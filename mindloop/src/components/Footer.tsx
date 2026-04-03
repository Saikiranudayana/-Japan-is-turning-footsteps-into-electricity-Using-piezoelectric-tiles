import { fadeUp } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      {...fadeUp(0)}
      className="border-t border-border py-8 px-6 md:px-10"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>&copy; 2026 StepSync. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </div>
    </motion.footer>
  );
}
