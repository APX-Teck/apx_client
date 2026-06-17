'use client';

import { Clock, Tag, FileText, ArrowRight } from 'lucide-react';
import { Service } from '@/app/types/service.types';

interface Props {
  service: Service;
  scrollToForm: () => void;
}

export function ServiceDetailHero({ service, scrollToForm }: Props) {
  return (
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider">
            Service Specs
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {service.name}
          </h1>
          <p className="text-foreground/75 text-lg leading-relaxed max-w-xl">
            {service.description}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-foreground/60 py-4 border-y border-glass-border">
            {service.timeline && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-accent" />
                <span>
                  Timeline: <strong>{service.timeline}</strong>
                </span>
              </div>
            )}
            {service.price && (
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-500" />
                <span>
                  Estimation: <strong className="text-foreground">{service.price}</strong>
                </span>
              </div>
            )}
          </div>

          <button
            onClick={scrollToForm}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent hover:bg-accent/90 text-white px-8 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent/25 cursor-pointer"
          >
            Get Started Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="lg:col-span-5 relative w-full h-[320px] rounded-3xl overflow-hidden border border-glass-border">
          {service.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={service.thumbnailUrl}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-accent/5 flex items-center justify-center">
              <FileText className="w-20 h-20 text-accent/20" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
