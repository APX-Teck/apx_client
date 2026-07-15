'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useTheme } from 'next-themes';

export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // Premium physics-based springs for buttery smooth, low-latency movement
  const cursorX = useSpring(0, { damping: 30, stiffness: 400, mass: 0.3 });
  const cursorY = useSpring(0, { damping: 30, stiffness: 400, mass: 0.3 });
  const glowX = useSpring(0, { damping: 45, stiffness: 200, mass: 0.6 });
  const glowY = useSpring(0, { damping: 45, stiffness: 200, mass: 0.6 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);

    // Add cursor-none class to body to hide default system cursor in desktop mode
    document.body.classList.add('md:cursor-none');

    const updateMousePosition = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      glowX.set(e.clientX);
      glowY.set(e.clientY);
    };
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.hasAttribute('data-interactive');
      setIsHovering(isInteractive);
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      document.body.classList.remove('md:cursor-none');
    };
  }, [cursorX, cursorY, glowX, glowY]);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <>
      {/* 1. TOP-LEVEL CONTAINER: Glassy cursor ring that overrides system pointer */}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
        <motion.div
          className="absolute rounded-full border border-accent/40 bg-background/15 backdrop-blur-[1.5px] flex items-center justify-center shadow-[0_0_8px_rgba(56,189,248,0.1)] transition-colors duration-200"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          animate={{
            width: isHovering ? 48 : 28,
            height: isHovering ? 48 : 28,
            backgroundColor: isHovering ? (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)') : 'rgba(0,0,0,0)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        >
          <motion.div 
            className="rounded-full bg-accent shadow-[0_0_6px_rgba(56,189,248,0.8)]"
            animate={{
              width: isHovering ? 0 : 6,
              height: isHovering ? 0 : 6,
              opacity: isHovering ? 0 : 1,
            }}
          />
        </motion.div>
      </div>

      {/* 2. BACKGROUND CONTEXT LAYER: Spotlight cursor glow that shines *through* glass panels */}
      <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden hidden md:block">
        <motion.div
          className={`absolute w-[280px] h-[280px] rounded-full blur-[65px] transition-opacity duration-300 ${
            isDark ? 'opacity-30 mix-blend-screen' : 'opacity-12 mix-blend-multiply'
          }`}
          style={{
            x: glowX,
            y: glowY,
            translateX: '-50%',
            translateY: '-50%',
            background: isDark
              ? 'radial-gradient(circle, rgba(56,189,248,0.3) 0%, rgba(139,92,246,0.08) 60%, transparent 100%)'
              : 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(168,85,247,0.04) 60%, transparent 100%)',
          }}
        />
      </div>
    </>
  );
}
