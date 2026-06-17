'use client';

import { CheckCircle2 } from 'lucide-react';
import { getServiceDeliverables, processSteps } from '../constants';

interface Props {
  slug: string;
}

export function ServiceDetailProcess({ slug }: Props) {
  const deliverables = getServiceDeliverables(slug);

  return (
    <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-6 space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">What is Included</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {deliverables.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <span className="text-foreground/75 text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="lg:col-span-6 space-y-6">
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Our Delivery Process
        </h2>
        <div className="space-y-6">
          {processSteps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <span className="text-3xl font-black text-accent/30 tracking-tight">
                {step.step}
              </span>
              <div>
                <h4 className="font-extrabold text-foreground tracking-tight text-base mb-1">
                  {step.title}
                </h4>
                <p className="text-foreground/60 text-xs leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
