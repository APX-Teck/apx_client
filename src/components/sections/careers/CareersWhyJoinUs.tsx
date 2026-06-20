'use client';

import { Rocket, Heart, Zap, Globe, Cpu, Coffee } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

const perks = [
  {
    icon: <Rocket className="w-6 h-6 text-accent" />,
    title: 'Fast-Paced Growth',
    description: "We don't just build apps, we build careers. Work on high-impact projects that accelerate your learning.",
  },
  {
    icon: <Cpu className="w-6 h-6 text-purple-500" />,
    title: 'Cutting-Edge Tech Stack',
    description: 'Work with Next.js App Router, TailwindCSS, PostgreSQL, and cutting-edge AI integrations.',
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-500" />,
    title: 'Work From Anywhere (Hybrid)',
    description: 'We value results over office hours. Enjoy a flexible hybrid model from our Pune HQ or home.',
  },
  {
    icon: <Heart className="w-6 h-6 text-rose-500" />,
    title: 'Health & Wellness',
    description: 'Comprehensive health coverage for you and your family, plus mental wellness days.',
  },
  {
    icon: <Zap className="w-6 h-6 text-yellow-500" />,
    title: 'Performance Bonuses',
    description: 'Your hard work directly translates to your success. We offer competitive salaries and project bonuses.',
  },
  {
    icon: <Coffee className="w-6 h-6 text-orange-500" />,
    title: 'Vibrant Culture',
    description: 'Regular team outings, hackathons, continuous learning stipends, and unlimited premium coffee.',
  },
];

export function CareersWhyJoinUs() {
  return (
    <section className="py-16 md:py-24 bg-foreground/[0.02] border-y border-glass-border w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Why You'll Love Working Here
          </h2>
          <p className="text-foreground/70 text-lg">
            We believe that building great software starts with taking great care of our engineers and designers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((perk, index) => (
            <GlassCard
              key={index}
              className="p-8 border border-glass-border group hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-foreground/[0.04] border border-glass-border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {perk.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">
                {perk.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">
                {perk.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
