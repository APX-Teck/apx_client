"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 w-full h-full bg-background -z-20" />
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[150px] pointer-events-none -z-10 animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-start gap-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm font-medium"
          >
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Elevate Your Digital Presence</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Next-Gen <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 drop-shadow-sm">
              IT Solutions
            </span>
          </h1>

          <p className="text-lg md:text-xl text-foreground/70 max-w-lg leading-relaxed">
            We build perfect, advanced-level web applications with seamless animations and iPhone-grade glassmorphism designs for forward-thinking brands.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mt-4">
            <Link
              href="#portfolio"
              className="group relative inline-flex h-14 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-medium text-background transition-transform hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link
              href="#contact"
              className="inline-flex h-14 items-center justify-center rounded-full glass-panel px-8 text-sm font-medium transition-all hover:bg-white/10 active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative hidden lg:block h-[600px] w-full"
        >
          {/* Abstract 3D/Glassy composition */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="absolute w-72 h-96 glass-panel rounded-3xl border border-white/20 shadow-2xl backdrop-blur-xl z-20"
              style={{ transform: "rotate(-5deg)" }}
            />
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="absolute w-64 h-80 bg-accent/40 rounded-3xl blur-md z-10 translate-x-12 translate-y-12"
              style={{ transform: "rotate(10deg)" }}
            />
            <div className="absolute w-80 h-80 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
