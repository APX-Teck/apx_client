"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  // Return empty div if not mounted to prevent hydration mismatch on server render
  if (!mounted) return <div className="hidden" />;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden hidden md:block">
      {/* Advanced Fluid Aurora Effect tracking the mouse */}
      <motion.div
        className={`absolute w-[800px] h-[800px] rounded-full blur-[140px] opacity-70 ${
          isDark ? "mix-blend-screen" : "mix-blend-multiply opacity-50"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(56,189,248,0.5) 0%, rgba(139,92,246,0.2) 40%, transparent 70%)"
            : "radial-gradient(circle, rgba(14,165,233,0.3) 0%, rgba(168,85,247,0.15) 40%, transparent 70%)",
        }}
        animate={{
          x: mousePosition.x - 400,
          y: mousePosition.y - 400,
        }}
        transition={{ type: "tween", ease: "easeOut", duration: 0.8 }}
      />
      <motion.div
        className={`absolute w-[600px] h-[600px] rounded-full blur-[100px] opacity-80 ${
          isDark ? "mix-blend-screen" : "mix-blend-multiply opacity-50"
        }`}
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(168,85,247,0.4) 0%, rgba(56,189,248,0.2) 50%, transparent 80%)"
            : "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(14,165,233,0.15) 50%, transparent 80%)",
        }}
        animate={{
          x: mousePosition.x - 200,
          y: mousePosition.y - 300,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 1.2 }}
      />
    </div>
  );
}
