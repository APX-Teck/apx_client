'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { deliveryPhilosophy } from '../constants';

export function PortfolioPhilosophy() {
  return (
    <section className="py-20 relative max-w-7xl mx-auto px-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
        >
          Our Delivery Philosophy
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-foreground/60 max-w-2xl mx-auto mt-4 text-lg"
        >
          Behind every successful case study is our rigorous 3-step execution methodology. We ensure absolute predictability and premium quality.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {deliveryPhilosophy.map((val, idx) => {
          const Icon = val.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, type: 'spring', bounce: 0.3 }}
              viewport={{ once: true, margin: '-50px' }}
              className="h-full"
            >
              <GlassCard className="h-full p-8 border border-glass-border hover:border-white/10 transition-colors duration-500">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-sm mb-6 transition-transform duration-500 hover:scale-110"
                  style={{
                    backgroundColor: `${val.color}14`,
                    borderColor: `${val.color}3a`,
                    color: val.color,
                    boxShadow: `0 4px 12px -3px ${val.color}26, 0 0 8px 1px ${val.color}1a`,
                  }}
                >
                  <Icon className="w-7 h-7" aria-hidden="true" role="presentation" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3">{val.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed">{val.description}</p>
              </GlassCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
