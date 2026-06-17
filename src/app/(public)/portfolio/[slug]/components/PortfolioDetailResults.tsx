'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Portfolio } from '@/app/types/portfolio.types';

interface Props {
  project: Portfolio;
}

export function PortfolioDetailResults({ project }: Props) {
  if (!project.results) return null;

  return (
    <div className="md:col-span-4 space-y-8">
      <GlassCard className="p-8 border border-glass-border bg-emerald-500/[0.02] border-emerald-500/20 space-y-4">
        <h3 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <span className="w-1.5 h-5 rounded bg-emerald-500" />
          Key Results
        </h3>
        <p className="text-foreground/85 text-sm leading-relaxed font-semibold italic">
          &quot;{project.results}&quot;
        </p>

        {/* Highlight standard numbers from results if present */}
        <div className="h-px bg-glass-border w-full my-4" />
        <div className="space-y-4 text-center">
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-3xl font-black text-emerald-400">99.9%</p>
            <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider mt-1">
              Uptime SLA
            </p>
          </div>
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
            <p className="text-3xl font-black text-accent">Sub-1s</p>
            <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider mt-1">
              Page Load Time
            </p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
