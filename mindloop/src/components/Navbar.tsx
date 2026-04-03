import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { fadeUp } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

/** Concentric circle logo built with pure CSS */
function Logo() {
  return (
    <div className="relative h-8 w-8 flex items-center justify-center">
      <div className="absolute h-8 w-8 rounded-full border border-white/30" />
      <div className="absolute h-5 w-5 rounded-full border border-white/50" />
      <div className="absolute h-2.5 w-2.5 rounded-full bg-white" />
    </div>
  );
}

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <motion.nav
      {...fadeUp(0)}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
    >
      {/* Left — Logo */}
      <Link to="/" className="flex items-center gap-3">
        <Logo />
        <span className="text-lg font-bold tracking-tight">StepSync</span>
      </Link>

      {/* Center — Nav links */}
      <ul className="hidden md:flex items-center gap-8">
        {user && (
          <li>
            <Link
              to="/dashboard"
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-300"
            >
              Dashboard
            </Link>
          </li>
        )}
      </ul>

      {/* Right — User / Auth */}
      <div className="flex items-center gap-3">
        {user ? (
          <>
            {user.picture && (
              <img
                src={user.picture}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="h-8 w-8 rounded-full border border-white/10 object-cover"
              />
            )}
            <span className="hidden sm:inline text-sm text-muted-foreground">
              {user.name}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              aria-label="Logout"
              className="text-muted-foreground hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Link to="/">
            <Button variant="glass" size="sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </motion.nav>
  );
}
