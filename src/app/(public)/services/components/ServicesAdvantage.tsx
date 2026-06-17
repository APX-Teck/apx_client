'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldCheck, Zap, Layers, BarChart3, Code2, Cpu } from 'lucide-react';

const valuePropositions = [
  {
    title: 'Enterprise Architecture',
    description: 'We build highly scalable, modular systems using Next.js and robust backend frameworks, ensuring your app handles traffic spikes effortlessly.',
    icon: Layers,
    color: '#0ea5e9', // Cyan
  },
  {
    title: 'Bank-Grade Security',
    description: 'Security is not an afterthought. We implement advanced encryption, strict access controls, and regular vulnerability scanning.',
    icon: ShieldCheck,
    color: '#10b981', // Emerald
  },
  {
    title: 'Lightning Performance',
    description: 'Sub-second load times. We optimize everything from Edge caching to database indexing for an unparalleled user experience.',
    icon: Zap,
    color: '#f59e0b', // Amber
  },
  {
    title: 'Data-Driven Insights',
    description: 'Integrated analytics and custom dashboards give you real-time visibility into your digital performance and ROI.',
    icon: BarChart3,
    color: '#8b5cf6', // Purple
  },
  {
    title: 'Clean Code Standards',
    description: 'Strict TypeScript typing, comprehensive linting, and automated testing guarantee that your codebase remains maintainable for years.',
    icon: Code2,
    color: '#ec4899', // Pink
  },
  {
    title: 'AI & Automation Ready',
    description: 'Future-proofed designs ready to integrate with machine learning models and automated CRM workflows as your business scales.',
    icon: Cpu,
    color: '#3b82f6', // Blue
  },
];

export function ServicesAdvantage() {
  return (
    <section className="py-20 relative max-w-7xl mx-auto px-6" aria-labelledby="advantage-heading">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none -z-10" aria-hidden="true" />

      <div className="text-center mb-16">
        <motion.h2 
          id="advantage-heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold tracking-tight"
        >
          The APXTeck Advantage
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          viewport={{ once: true }}
          className="text-foreground/60 max-w-2xl mx-auto mt-4 text-lg"
        >
          We don&apos;t just write code. We architect solutions that give you a definitive competitive edge in the digital landscape.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
        {valuePropositions.map((val, idx) => {
          const Icon = val.icon;
          return (
            <motion.article
              key={idx}
              role="listitem"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, type: "spring", bounce: 0.3 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <GlassCard
                className="h-full p-8 border border-glass-border hover:border-white/10 transition-colors duration-500 relative group overflow-hidden"
                glowColor={val.color}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border backdrop-blur-sm mb-6 relative z-10 transition-transform duration-500 group-hover:scale-110"
                  style={{
                    backgroundColor: `${val.color}14`,
                    borderColor: `${val.color}3a`,
                    color: val.color,
                    boxShadow: `0 4px 12px -3px ${val.color}26, 0 0 8px 1px ${val.color}1a`,
                  }}
                  aria-hidden="true"
                >
                  <Icon className="w-7 h-7" aria-hidden="true" role="presentation" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-3 relative z-10">{val.title}</h3>
                <p className="text-foreground/60 text-sm leading-relaxed relative z-10">{val.description}</p>
              </GlassCard>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
