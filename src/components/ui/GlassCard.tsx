"use client";

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, glowColor, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden group transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* Optional animated glow effect on hover */}
        {glowColor && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-3xl pointer-events-none"
            style={{ backgroundColor: glowColor }}
          />
        )}
        
        {/* Subtle top highlight for extra 3D feel */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />
        
        <div className="relative z-10">{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";
