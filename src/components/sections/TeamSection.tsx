'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Mail, ShieldAlert } from 'lucide-react';
import { TeamMember } from '@/app/types/user.types';

interface TeamSectionProps {
  team: TeamMember[];
}

export function TeamSection({ team }: TeamSectionProps) {
  return (
    <section className="py-12 md:py-20 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider"
          >
            Leadership
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-extrabold tracking-tight"
          >
            Meet Our Experts
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 max-w-xl mx-auto text-base"
          >
            A dedicated team of technology architects, UI/UX designers, and SEO lead strategists
            committed to your growth.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full flex flex-col items-center text-center p-6 border border-glass-border hover:-translate-y-1 hover:border-white/20 transition-all duration-300">
                {/* Photo */}
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border border-accent/30 relative shadow-lg">
                  {member.profilePhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={member.profilePhotoUrl}
                      alt={member.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/15 flex items-center justify-center font-bold text-2xl text-accent">
                      {member.fullName?.[0] || 'T'}
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-extrabold text-lg text-foreground tracking-tight">
                      {member.fullName}
                    </h4>
                    <p className="text-xs text-foreground/50 font-medium tracking-wide uppercase">
                      {member.designation}
                    </p>
                  </div>

                  {/* Socials */}
                  {member.linkedInUrl && (
                    <div className="flex justify-center gap-3 pt-6 mt-auto">
                      <a
                        href={member.linkedInUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 rounded-full glass-panel border border-glass-border flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent/40 active:scale-95 transition-all"
                        aria-label={`${member.fullName} LinkedIn`}
                      >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                      </a>
                      <a
                        href="mailto:info@apxteck.com"
                        className="w-8 h-8 rounded-full glass-panel border border-glass-border flex items-center justify-center text-foreground/60 hover:text-accent hover:border-accent/40 active:scale-95 transition-all"
                        aria-label={`${member.fullName} Email`}
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
