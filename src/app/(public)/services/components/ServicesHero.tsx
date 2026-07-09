'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useServicesHeroLogic } from '../hooks/useServicesHeroLogic';

export function ServicesHero() {
  const { typewrittenText, currentFullWord, phraseIndex, heroPhrases } = useServicesHeroLogic();

  return (
    <section
      className="relative py-16 sm:py-24 flex items-center justify-center min-h-[50dvh] overflow-x-hidden w-full"
      aria-labelledby="hero-heading"
    >
      {/* Background Parallax */}
      <motion.div
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute inset-0 -z-20"
      >
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Digital abstract background showing interconnected nodes representing enterprise architecture"
          fill
          sizes="100vw"
          priority
          fetchPriority="high"
          className="object-cover object-center"
        />
      </motion.div>
      <div
        className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/80 to-background z-10"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-20 text-center space-y-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider"
          role="doc-subtitle"
          aria-label="Capabilities and Solutions"
        >
          Capabilities & Solutions
        </motion.div>

        <motion.div
          role="heading"
          aria-level={1}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight flex flex-col items-center gap-2"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
          >
            Digital Transformation
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="flex items-center justify-center min-h-[1.2em] text-[7vw] sm:text-4xl md:text-5xl lg:text-7xl whitespace-nowrap"
          >
            <span className="relative flex items-center justify-center">
              {/* Invisible placeholder for exact width of the CURRENT word to keep it perfectly centered */}
              <span className="opacity-0 pointer-events-none select-none whitespace-nowrap">
                {currentFullWord}
              </span>

              {/* Typing text overlay */}
              <span className="absolute left-0 flex items-center whitespace-nowrap">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-purple-500 to-pink-500">
                  {typewrittenText}
                </span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                  className="w-1.5 md:w-2 h-[0.8em] bg-accent ml-1 md:ml-2 rounded-sm shrink-0"
                />
              </span>
            </span>
          </motion.span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-foreground/70 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed h-[80px] md:h-[60px] relative flex items-center justify-center"
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

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap justify-center gap-3 pt-6"
          role="list"
          aria-label="Service Highlights"
        >
          {[
            { label: '100% In-House Engineers' },
            { label: '24/7 Priority Support' },
            { label: 'Bank-Grade Security' },
            { label: 'Global Standards' },
          ].map((point, idx) => (
            <motion.div
              key={idx}
              role="listitem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + idx * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 hover:bg-accent/10 border border-white/10 hover:border-accent/30 backdrop-blur-md shadow-lg hover:shadow-accent/20 text-sm font-semibold text-foreground/90 transition-all duration-300 cursor-default"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              {point.label}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
