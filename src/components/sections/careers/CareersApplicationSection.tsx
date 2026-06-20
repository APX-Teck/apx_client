'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { JobApplicationForm } from '@/components/forms/JobApplicationForm';
import { Mail, ShieldCheck } from 'lucide-react';

export function CareersApplicationSection() {
  return (
    <section id="apply-now" className="py-16 md:py-24 bg-foreground/[0.01] border-t border-glass-border w-full scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start w-full">
          
          {/* Left Side: Info */}
          <div className="lg:col-span-5 flex flex-col gap-8 w-full sticky top-32">
            <header className="flex flex-col gap-4">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                Submit Your Application
              </h2>
              <p className="text-foreground/75 leading-relaxed text-lg">
                Can't find a role that fits exactly? We're always on the lookout for exceptional talent. Submit an open application and we'll keep you in mind for future opportunities.
              </p>
            </header>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded-[1.25rem] bg-foreground/[0.01] border border-glass-border flex gap-4 w-full items-start">
                <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm mb-1">Secure & Confidential</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Your application data is heavily encrypted and kept strictly confidential. We respect your privacy.
                  </p>
                </div>
              </div>
              
              <div className="p-5 rounded-[1.25rem] bg-foreground/[0.01] border border-glass-border flex gap-4 w-full items-start">
                <Mail className="w-6 h-6 text-accent shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-sm mb-1">Direct to HR</h3>
                  <p className="text-sm text-foreground/60 leading-relaxed">
                    Once submitted, your application goes directly to our hiring managers. Expect a response within 48-72 hours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="lg:col-span-7 w-full">
            <GlassCard className="p-6 sm:p-8 md:p-10 border border-glass-border w-full flex flex-col shadow-xl shadow-black/5 dark:shadow-black/20">
              <JobApplicationForm />
            </GlassCard>
          </div>

        </div>
      </div>
    </section>
  );
}
