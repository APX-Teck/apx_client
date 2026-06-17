'use client';

import { motion } from 'framer-motion';
import { coreValues } from '../constants';
import { GlassCard } from '@/components/ui/GlassCard';

export function AboutValues() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 relative" aria-labelledby="about-values-heading">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" aria-hidden="true" />

      <div className="text-center mb-16">
        <motion.h2
          id="about-values-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
        >
          Our Core Values
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-foreground/60 max-w-xl mx-auto mt-4"
        >
          These fundamental operating guidelines direct how we write code, design interfaces, and support our partners.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreValues.map((val, idx) => {
          const Icon = val.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: 'spring', bounce: 0.4 }}
              viewport={{ once: true, margin: '-50px' }}
            >
              <GlassCard
                className="h-full hover:-translate-y-2 transition-transform duration-300 relative group overflow-hidden"
                glowColor={val.color}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity" aria-hidden="true">
                  <Icon className="w-24 h-24" style={{ color: val.color }} aria-hidden="true" role="presentation" />
                </div>

                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border backdrop-blur-sm mb-6 relative z-10 transition-transform duration-300 hover:scale-110"
                  style={{
                    backgroundColor: `${val.color}14`,
                    borderColor: `${val.color}3a`,
                    color: val.color,
                    boxShadow: `0 4px 12px -3px ${val.color}26, 0 0 8px 1px ${val.color}1a`,
                  }}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6" aria-hidden="true" role="presentation" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3 relative z-10">{val.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed relative z-10">{val.description}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
