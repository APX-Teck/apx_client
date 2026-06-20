'use client';

import { MapPin, Clock, Briefcase, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const JOBS = [
  {
    id: 'job-1',
    title: 'Senior Frontend Developer (Next.js)',
    type: 'Full-time',
    location: 'Pune, India (Hybrid)',
    department: 'Engineering',
    description: 'We are looking for an elite Next.js developer to build highly performant and stunning web applications using App Router, TailwindCSS, and Framer Motion.',
  },
  {
    id: 'job-2',
    title: 'Backend Engineer (Node.js)',
    type: 'Full-time',
    location: 'Pune, India (Remote)',
    department: 'Engineering',
    description: 'Join our team to design, build, and maintain scalable backend services and RESTful APIs using Node.js, Express, and PostgreSQL.',
  },
  {
    id: 'job-3',
    title: 'SEO Specialist',
    type: 'Full-time',
    location: 'Pune, India',
    department: 'Marketing',
    description: 'We need an expert to drive our technical SEO strategies, audit websites, build backlinks, and help our clients dominate search engine rankings.',
  },
];

export function CareersJobList() {
  return (
    <section id="open-positions" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 w-full scroll-mt-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Open Positions
          </h2>
          <p className="text-foreground/70 text-lg">
            Ready to do the best work of your life? Check out our current openings below.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {JOBS.map((job) => (
          <GlassCard
            key={job.id}
            className="p-6 md:p-8 border border-glass-border group hover:border-accent/30 transition-all cursor-pointer"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-foreground/[0.04] border border-glass-border text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    {job.department}
                  </span>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
                  {job.title}
                </h3>
                
                <p className="text-foreground/70 leading-relaxed max-w-3xl">
                  {job.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/60 pt-2">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4" />
                    <span>{job.type}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Urgent Hiring</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <a 
                  href="#apply-now" 
                  className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 transition-all group-hover:bg-accent group-hover:text-white"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}
