'use client';

import { ExternalLink, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Portfolio } from '@/app/types/portfolio.types';

interface Props {
  project: Portfolio;
}

export function PortfolioDetailHeader({ project }: Props) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Ongoing';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <GlassCard className="relative overflow-hidden p-8 border border-glass-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-[10px] font-bold uppercase tracking-wider">
              {project.serviceType}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {project.clientName} Case Study
            </h1>
            <h2 className="text-base font-medium text-foreground/60">{project.title}</h2>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-foreground/50 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>
                Completed: <strong>{formatDate(project.completedAt)}</strong>
              </span>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent text-white px-5 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md shadow-accent/15"
              >
                Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </GlassCard>

      {project.coverImageUrl && (
        <div className="w-full h-96 md:h-[480px] rounded-3xl overflow-hidden border border-glass-border shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </>
  );
}
