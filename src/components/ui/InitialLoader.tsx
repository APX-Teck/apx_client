'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function InitialLoader() {
  const [show, setShow] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check local storage to see if user has visited before
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setShow(true);
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShow(false);
          localStorage.setItem('hasVisited', 'true');
        }, 800); // Wait for exit animation
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Matrix / Live Code Canvas Effect
  useEffect(() => {
    if (!show || isExiting) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+{}|:"<>?~`-=[]\\;\',./';
    const fontSize = 14;
    const columns = Math.floor(width / fontSize);
    const drops: number[] = [];

    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * -100; // Start at random negative offsets
    }

    const draw = () => {
      // Semi-transparent black to create trailing effect
      ctx.fillStyle = 'rgba(5, 5, 5, 0.1)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#0f0'; // Matrix green
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setTimeout(draw, 30); // Control speed
      });
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [show, isExiting]);

  if (!show && !isExiting) return null;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#050505] overflow-hidden"
        >
          {/* Live Code Canvas Background */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 opacity-20"
          />

          {/* Central Logo & Animations */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Glowing Backdrop */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 rounded-full blur-[80px]"
            />

            {/* Logo Wrapper */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: 'backOut' }}
              className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center mb-8 group"
            >
              {/* The Shine Effect Container */}
              <div className="absolute inset-0 overflow-hidden rounded-full z-20 pointer-events-none">
                <motion.div
                  initial={{ left: '-100%' }}
                  animate={{ left: '200%' }}
                  transition={{ duration: 1.5, ease: 'easeInOut', delay: 0.5, repeat: 1, repeatDelay: 1 }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-12"
                />
              </div>

              <Image
                src="/APXTECK.png"
                alt="APXTeck Logo"
                fill
                className="object-contain filter drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-300"
                priority
              />
            </motion.div>

            {/* Loading Bar and Text */}
            <div className="flex flex-col items-center gap-3 w-64">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-accent text-sm font-mono tracking-[0.2em]"
              >
                INITIALIZING_APX_ENGINE
              </motion.div>
              
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 3.2, ease: 'easeInOut' }}
                  className="h-full bg-accent relative"
                >
                  <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/50" />
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
