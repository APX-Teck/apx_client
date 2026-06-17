'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Portfolio } from '@/app/types/portfolio.types';

interface Props {
  project: Portfolio;
}

export function PortfolioDetailContent({ project }: Props) {
  if (!project.problem && !project.solution) return null;

  return (
    <div className="md:col-span-8 space-y-8">
      {project.problem && (
        <GlassCard className="p-8 border border-glass-border space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-rose-500" />
            The Challenge
          </h3>
          <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">
            {project.problem}
          </p>
        </GlassCard>
      )}

      {project.solution && (
        <GlassCard className="p-8 border border-glass-border space-y-4">
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <span className="w-1.5 h-6 rounded bg-accent" />
            Our Solution
          </h3>
          <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">
            {project.solution}
          </p>
        </GlassCard>
      )}
    </div>
  );
}
