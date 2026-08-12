'use client';

import * as React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  glowColor?: string;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, innerClassName, glowColor, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-3xl glass-panel p-6 sm:p-8 overflow-hidden group transition-all duration-300',
          className
        )}
        {...props}
      >
        {/* Optional animated glow effect on hover */}
        {glowColor && (
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-[0.15] transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${glowColor}, ${glowColor}00 70%)`,
            }}
          />
        )}

        {/* Subtle top highlight for extra 3D feel */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-50" />

        <div className={cn("relative z-10", innerClassName)}>{children}</div>
      </motion.div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
