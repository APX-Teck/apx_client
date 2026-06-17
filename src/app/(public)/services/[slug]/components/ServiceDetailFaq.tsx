'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Faq } from '@/app/types/faq.types';

interface Props {
  serviceName: string;
  faqs: Faq[];
}

export function ServiceDetailFaq({ serviceName, faqs }: Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 max-w-3xl mx-auto px-6">
      <div className="text-center mb-16 space-y-4">
        <h2 className="text-3xl font-extrabold tracking-tight">Service Specific FAQs</h2>
        <p className="text-foreground/60">
          Find clear, rapid answers relating to {serviceName}.
        </p>
      </div>
      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isActive = activeFaq === idx;
          return (
            <div
              key={faq.id}
              className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                isActive
                  ? 'bg-accent/5 border-accent/25'
                  : 'border-glass-border hover:bg-white/5'
              }`}
            >
              <button
                onClick={() => setActiveFaq(isActive ? null : idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-base text-foreground focus:outline-none"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-accent transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`}
                />
              </button>
              {isActive && (
                <div className="px-6 pb-6 text-foreground/70 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
