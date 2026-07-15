'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col min-h-dvh bg-[#050505] text-foreground overflow-hidden relative">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center relative w-full px-6 text-center z-10" role="main">
        
        {/* Security Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0 opacity-20" />

        {/* Floating Shield Icon */}
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 mb-8"
        >
          {/* Outer glow */}
          <div className="absolute inset-0 bg-yellow-500/20 blur-[60px] rounded-full scale-150" />
          
          <motion.div
            animate={{ 
              opacity: [1, 0.8, 1],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldAlert className="w-32 h-32 md:w-48 md:h-48 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
          </motion.div>
        </motion.div>

        {/* Glitch 403 Text */}
        <motion.div 
          className="relative z-10 cursor-pointer"
          whileHover="hover"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-8xl md:text-[12rem] font-black text-white mb-2 tracking-tighter leading-none"
          >
            403
          </motion.h1>
          {/* Glitch layers on hover */}
          <motion.div 
            variants={{
              hover: { x: [-2, 2, -2, 2, 0], y: [1, -1, 1, -1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror" }}
            className="absolute top-0 left-[2px] text-8xl md:text-[12rem] font-black text-yellow-500 opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            403
          </motion.div>
          <motion.div 
            variants={{
              hover: { x: [2, -2, 2, -2, 0], y: [-1, 1, -1, 1, 0], opacity: [0, 1, 0.5, 1, 0] }
            }}
            transition={{ duration: 0.2, repeat: Infinity, repeatType: "mirror", delay: 0.1 }}
            className="absolute top-0 -left-[2px] text-8xl md:text-[12rem] font-black text-blue-500 opacity-0 mix-blend-screen pointer-events-none tracking-tighter leading-none" aria-hidden="true"
          >
            403
          </motion.div>
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl md:text-2xl font-medium text-yellow-500 mb-4 z-10 tracking-widest uppercase"
        >
          ACCESS DENIED
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/50 max-w-md mx-auto mb-10 z-10 font-mono text-sm"
        >
          &gt; ERROR: You do not have the required security clearance to enter this sector.
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
            href="/login"
            className="relative overflow-hidden group inline-flex h-12 items-center justify-center border border-yellow-500 bg-yellow-500/10 px-8 text-sm font-bold text-yellow-500 transition-all hover:bg-yellow-500 hover:text-black hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 tracking-widest uppercase">Login Again</span>
          </Link>

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
