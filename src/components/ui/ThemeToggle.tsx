"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full bg-white/10" />;
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full glass-panel overflow-hidden transition-colors hover:bg-white/20 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 0 : -90,
          scale: theme === "dark" ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Moon className="w-5 h-5 text-white" />
      </motion.div>

      <motion.div
        initial={false}
        animate={{
          rotate: theme === "light" ? 0 : 90,
          scale: theme === "light" ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="absolute"
      >
        <Sun className="w-5 h-5 text-black" />
      </motion.div>
    </motion.button>
  );
}
