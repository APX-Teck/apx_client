'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTypewriter } from '../hooks/useTypewriter';

import { typewriterWords, heroPhrases } from '../constants';

export function AboutHero() {
  const { text: typewrittenText, currentFullWord } = useTypewriter(typewriterWords, 100, 50, 2500);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % heroPhrases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-16 md:py-24 flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] w-full px-4 pt-safe pb-safe overflow-hidden">
      {/* Background Parallax Image */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 -z-20 w-full h-full"
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="APXTeck Engineering Excellence Background"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-10 pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 relative z-20 text-center flex flex-col gap-6 md:gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 md:py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-[10px] sm:text-xs font-bold uppercase tracking-wider"
          role="status"
          aria-label="Current focus: Engineering Excellence"
        >
          Engineering Excellence
        </motion.div>

        <motion.div
          role="heading"
          aria-level={1}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2 md:gap-4 w-full"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
            className="w-full"
          >
            We Are
          </motion.span>

          <motion.span
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="flex items-center justify-center min-h-[1.5em] text-[12vw] sm:text-[10vw] md:text-7xl whitespace-nowrap w-full max-w-full overflow-hidden"
          >
            <span className="relative flex items-center justify-center w-full max-w-full overflow-hidden">
              {/* Invisible placeholder for exact width of the CURRENT word to keep it perfectly centered */}
              <span className="opacity-0 pointer-events-none select-none whitespace-nowrap">
                {currentFullWord}
              </span>

              {/* Typing text overlay */}
              <span className="absolute left-1/2 -translate-x-1/2 flex items-center whitespace-nowrap justify-center">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-blue-500 to-purple-500">
                  {typewrittenText}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1 sm:w-1.5 md:w-2 h-[0.8em] bg-purple-500 ml-1 md:ml-2 rounded-sm shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.7)]"
                  aria-hidden="true"
                />
              </span>
            </span>
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/70 w-full max-w-sm sm:max-w-xl md:max-w-3xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed h-[100px] sm:h-[80px] md:h-[60px] relative flex items-center justify-center px-2"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={phraseIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-x-0 w-full"
              aria-live="polite"
            >
              {heroPhrases[phraseIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
