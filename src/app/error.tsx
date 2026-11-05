'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServerCrash } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-dvh bg-[#050000] text-foreground overflow-hidden relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative w-full pt-32 pb-16 px-6 text-center z-10" role="main">
        
        {/* Pulsating Warning Background */}
        <motion.div 
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-transparent to-transparent pointer-events-none z-0" 
        />

        {/* Floating Server Crash Representation */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 mb-8"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full scale-150" />
          
          <motion.div
            animate={{ opacity: [1, 0.5, 1, 1, 0.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear", times: [0, 0.1, 0.2, 0.5, 0.6, 1] }}
          >
            <ServerCrash className="w-32 h-32 md:w-48 md:h-48 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" />
          </motion.div>
        </motion.div>

        {/* Glitch 500 Text */}
        <motion.div 
          className="relative z-10 cursor-pointer"
          whileHover="hover"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[12rem] font-black text-white mb-2 tracking-tighter leading-none"
          >
            500
          </motion.h1>
          {/* Glitch layers on hover */}
          <motion.div 
            variants={{
              hover: { x: [-2, 2, -2, 2, 0], y: [1, -1, 1, -1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-0 left-[2px] text-8xl md:text-[12rem] font-black text-red-500 opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            500
          </motion.div>
          <motion.div 
            variants={{
              hover: { x: [2, -2, 2, -2, 0], y: [-1, 1, -1, 1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", delay: 0.1 }}
            className="absolute top-0 -left-[2px] text-8xl md:text-[12rem] font-black text-blue-500 opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            500
          </motion.div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-red-400 mb-4 z-10 tracking-widest uppercase"
        >
          CRITICAL SYSTEM FAILURE
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/50 max-w-md mx-auto mb-10 z-10 font-mono text-sm"
        >
          &gt; ERROR: Anomaly detected in the engine core. APX Engineers have been notified of the failure.
        </motion.p>
        
        {/* Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 z-10"
        >
          {/* Primary Button */}
          <button 
            onClick={() => reset()}
            className="relative overflow-hidden group inline-flex h-12 items-center justify-center border border-red-500/50 bg-red-500/10 px-8 text-sm font-bold text-red-100 transition-all hover:bg-red-500/20 hover:border-red-500 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 tracking-widest uppercase">Try Rebooting</span>
            {/* Hover Sweep Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent group-hover:animate-shimmer" />
          </button>

          {/* Secondary Button */}
          <Link 
            href="/"
            className="inline-flex h-12 items-center justify-center border border-white/20 bg-transparent px-8 text-sm font-bold text-white/70 transition-all hover:text-white hover:border-white/50 hover:bg-white/5 active:scale-95"
          >
            <span className="tracking-widest uppercase">Return to Base</span>
          </Link>
        </motion.div>

      </main>

      <Footer />
    </div>
  );
}
