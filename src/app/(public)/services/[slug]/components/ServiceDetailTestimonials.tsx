'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Quote, Star } from 'lucide-react';
import { Testimonial } from '@/app/types/testimonial.types';

interface Props {
  serviceName: string;
  testimonials: Testimonial[];
}

export function ServiceDetailTestimonials({ serviceName, testimonials }: Props) {
  const filteredTestimonials = testimonials.filter(
    (t) =>
      t.projectType?.toLowerCase().includes(serviceName.toLowerCase()) ||
      serviceName.toLowerCase().includes(t.projectType?.toLowerCase() || '')
  );

  if (filteredTestimonials.length === 0) return null;

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight">Service Case Feedbacks</h2>
        <p className="text-foreground/60 max-w-md mx-auto">
          Real review metrics from project managers who hired our {serviceName} teams.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8 justify-center">
        {filteredTestimonials.map((t) => (
          <GlassCard key={t.id} className="relative flex flex-col justify-between">
            <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/15" />
            <div>
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
              </div>
              <p className="text-foreground/80 italic text-base leading-relaxed mb-6 font-medium">
                &quot;{t.feedback}&quot;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                {t.clientName[0]}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-foreground">{t.clientName}</h4>
                <p className="text-[10px] text-foreground/50">{t.clientBusiness}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
