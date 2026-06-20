'use client';

import { motion } from 'framer-motion';

export function CareersHero() {
  return (
    <section className="relative w-full pt-12 pb-16 md:pt-20 md:pb-24 flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl mx-auto space-y-6 md:space-y-8 flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold tracking-wide uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          We're Hiring
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
          Build the Future with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
            APXTeck
          </span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-foreground/75 max-w-2xl leading-relaxed">
          Join our elite team of Next.js engineers, visionary designers, and SEO experts. 
          Help us deliver cutting-edge software solutions to clients worldwide.
        </p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="pt-4"
        >
          <a
            href="#open-positions"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-foreground text-background font-semibold text-lg hover:bg-foreground/90 transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--accent),0.2)]"
          >
            View Open Positions
          </a>
        </motion.div>
      </motion.div>

      {/* Decorative Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px] -z-10 pointer-events-none" />
    </section>
  );
}
