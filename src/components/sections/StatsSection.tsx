'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Users, CheckCircle2, Award, Clock } from 'lucide-react';

function Counter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (inView && ref.current) {
      const node = ref.current;
      const controls = animate(0, value, {
        duration: 2,
        ease: 'easeOut',
        onUpdate(val) {
          node.textContent = Math.round(val).toLocaleString() + suffix;
        },
      });
      return () => controls.stop();
    }
  }, [value, inView, suffix]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
      0{suffix}
    </span>
  );
}

import { StatsOverview } from '@/app/types/analytics.types';
import { useStatsLogic } from '@/hooks/useStatsLogic';

export function StatsSection({ stats: initialStats }: { stats?: StatsOverview }) {
  const { stats: dynamicStats } = useStatsLogic();
  
  const stats = dynamicStats || initialStats;
  if (!stats) return null;
  const statItems = [
    {
      label: 'Clients Served',
      value: stats.clientsServed,
      suffix: '+',
      icon: Users,
      color: '#0ea5e9', // Cyan
      desc: 'SMB partners across India',
    },
    {
      label: 'Completed Projects',
      value: stats.projectsCompleted,
      suffix: '+',
      icon: CheckCircle2,
      color: '#10b981', // Emerald
      desc: 'Delivered on schedule',
    },
    {
      label: 'Satisfaction Rate',
      value: Math.floor(stats.satisfactionRate),
      suffix: '%',
      icon: Award,
      color: '#8b5cf6', // Purple
      desc: 'Pixel-perfect standards',
    },
  ];

  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-background">
      {/* Subtle overlay accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <GlassCard className="relative overflow-hidden p-8 md:p-12 border border-glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-center">
            <div className="md:col-span-1 space-y-3">
              <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
                Metrics
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Our Journey In Numbers
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed">
                Empowering brands with cutting-edge engineering and next-generation designs.
              </p>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-4 gap-6">
              {statItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-sm mb-4 transition-transform duration-300 hover:scale-105"
                      style={{
                        backgroundColor: `${item.color}14`,
                        borderColor: `${item.color}3a`,
                        color: item.color,
                        boxShadow: `0 4px 12px -3px ${item.color}26, 0 0 8px 1px ${item.color}1a`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <Counter value={item.value} suffix={item.suffix} />
                    <p className="text-sm font-semibold text-foreground/80 mt-2">{item.label}</p>
                    <p className="text-xs text-foreground/50 mt-1">{item.desc}</p>
                  </div>
                );
              })}

              {/* String Stat item (Support) */}
              <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border backdrop-blur-sm mb-4 transition-transform duration-300 hover:scale-105"
                  style={{
                    backgroundColor: '#ec489914',
                    borderColor: '#ec48993a',
                    color: '#ec4899',
                    boxShadow:
                      '0 4px 12px -3px rgba(236, 72, 153, 0.15), 0 0 8px 1px rgba(236, 72, 153, 0.1)',
                  }}
                >
                  <Clock className="w-5 h-5" />
                </div>
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                  {stats.supportActive}
                </span>
                <p className="text-sm font-semibold text-foreground/80 mt-2">Active Support</p>
                <p className="text-xs text-foreground/50 mt-1">Direct developer access</p>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
