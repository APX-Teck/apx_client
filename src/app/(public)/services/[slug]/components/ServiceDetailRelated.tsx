'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Service } from '@/app/types/service.types';

interface Props {
  currentServiceSlug: string;
  allServices: Service[];
}

export function ServiceDetailRelated({ currentServiceSlug, allServices }: Props) {
  const relatedServices = allServices.filter((s) => s.slug !== currentServiceSlug).slice(0, 3);

  if (relatedServices.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-extrabold tracking-tight mb-8">Other Services We Offer</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedServices.map((r) => (
          <GlassCard
            key={r.id}
            className="flex flex-col justify-between hover:-translate-y-1 transition-all duration-300"
          >
            <div className="space-y-4">
              <h3 className="text-xl font-bold tracking-tight text-foreground">{r.name}</h3>
              <p className="text-foreground/70 text-xs leading-relaxed line-clamp-3">
                {r.description}
              </p>
            </div>
            <div className="pt-4 border-t border-glass-border mt-6 flex justify-between items-center text-xs">
              <span className="font-semibold text-accent">{r.price}</span>
              <Link
                href={`/services/${r.slug}`}
                className="font-bold hover:text-accent transition-colors flex items-center gap-1"
              >
                Details <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
