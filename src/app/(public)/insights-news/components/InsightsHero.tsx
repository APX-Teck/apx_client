'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface InsightsHeroProps {
  typewrittenText: string;
  currentFullWord: string;
  phraseIndex: number;
  heroPhrases: string[];
}

export function InsightsHero({
  typewrittenText,
  currentFullWord,
  phraseIndex,
  heroPhrases,
}: InsightsHeroProps) {
  return (
    <section
      className="relative py-16 md:py-24 flex flex-col items-center justify-center min-h-[50dvh] overflow-hidden w-full"
      aria-labelledby="insights-hero-title"
    >
      {/* Background Parallax Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="APXTeck Insights and News Background"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-10"
        aria-hidden="true"
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 relative z-20 text-center flex flex-col items-center gap-6 md:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider"
        >
          The APXTeck Insider
        </motion.div>

        <motion.h1
          id="insights-hero-title"
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2 w-full"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          >
            Insights & News
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="flex items-center justify-center min-h-[1.2em] text-[9vw] sm:text-4xl md:text-5xl lg:text-7xl whitespace-nowrap"
          >
            <span className="relative flex items-center justify-center">
              {/* Invisible placeholder for exact width of the CURRENT word to keep it perfectly centered */}
              <span className="opacity-0 pointer-events-none select-none">{currentFullWord}</span>

              {/* Typing text overlay */}
              <span className="absolute left-0 flex items-center whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-400 to-pink-500">
                  {typewrittenText}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1.5 md:w-2 h-[0.8em] bg-pink-500 ml-1 md:ml-2 rounded-sm shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.7)]"
                />
              </span>
            </span>
          </motion.span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/70 w-full max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed h-[80px] md:h-[60px] relative flex items-center justify-center px-4 sm:px-0"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-x-0"
            >
              {heroPhrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
