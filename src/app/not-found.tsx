'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BotOff } from 'lucide-react';
import { useEffect, useState } from 'react';

// A simple floating star particle component
const Star = ({ delay, size, duration, top, left }: { delay: number; size: number; duration: number; top: number; left: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
    transition={{ 
      duration: duration,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut" 
    }}
    className="absolute bg-white rounded-full"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      width: size,
      height: size,
    }}
  />
);

export default function NotFound() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Generate random stars on mount
  const stars = mounted ? Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: Math.random() * 100,
    left: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 3 + 2,
  })) : [];

  return (
    <div className="flex flex-col min-h-dvh bg-[#050505] text-foreground overflow-hidden relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6 text-center z-10" role="main">
        
        {/* Animated Stars Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-60">
          {stars.map((star) => (
            <Star key={star.id} {...star} />
          ))}
        </div>

        {/* Floating Astronaut/Robot Representation */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            rotate: [-5, 5, -5] 
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="relative z-10 mb-8"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-accent/20 blur-[60px] rounded-full scale-150" />
          <BotOff className="w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
        </motion.div>

        {/* Glitch 404 Text */}
        <motion.div 
          className="relative z-10 cursor-pointer"
          whileHover="hover"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[12rem] font-black text-white mb-2 tracking-tighter leading-none"
          >
            404
          </motion.h1>
          {/* Glitch layers on hover */}
          <motion.div 
            variants={{
              hover: { x: [-2, 2, -2, 2, 0], y: [1, -1, 1, -1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-0 left-[2px] text-8xl md:text-[12rem] font-black text-accent opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            404
          </motion.div>
          <motion.div 
            variants={{
              hover: { x: [2, -2, 2, -2, 0], y: [-1, 1, -1, 1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", delay: 0.1 }}
            className="absolute top-0 -left-[2px] text-8xl md:text-[12rem] font-black text-blue-500 opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            404
          </motion.div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-white/80 mb-4 z-10"
        >
          We told you not to stray too far from the ship!
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/50 max-w-md mx-auto mb-10 z-10 font-mono text-sm"
        >
          &gt; ERROR: Destination coordinates unknown.
        </motion.p>
        
        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 z-10"
        >
          {/* Primary Button */}
          <Link 
            href="/"
            className="relative overflow-hidden group inline-flex h-12 items-center justify-center border border-accent bg-accent/10 px-8 text-sm font-bold text-white transition-all hover:bg-accent/20 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 tracking-widest uppercase">Take Me Back!</span>
            {/* Hover Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
          </Link>

          {/* Secondary Button */}
          <Link 
            href="#"
            className="inline-flex h-12 items-center justify-center border border-white/20 bg-transparent px-8 text-sm font-bold text-white/70 transition-all hover:text-white hover:border-white/50 hover:bg-white/5 active:scale-95"
          >
            <span className="tracking-widest uppercase">Stay Awhile</span>
          </Link>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
