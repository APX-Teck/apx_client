'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Mail } from 'lucide-react';
import Image from 'next/image';

const directors = [
  {
    id: 1,
    name: 'Amol Ramrao Khodre',
    designation: 'Director',
    email: 'amolramraokhodre@gmail.com',
    photoUrl: '/Amol Ramrao Khodre.jpg',
    quote: 'Driven by innovation and a commitment to excellence, shaping the future of digital solutions.',
  },
  {
    id: 2,
    name: 'Praveen Kumar',
    designation: 'Director',
    email: 'praveenbaghelmaurya@gmail.com',
    photoUrl: '/Praveen Kumar.png',
    quote: 'Empowering businesses with cutting-edge technology and strategic vision for sustainable growth.',
  },
];

export function LeadershipSection() {
  return (
    <section 
      className="py-20 relative overflow-hidden bg-background" 
      aria-label="APXTeck Board of Directors and Leadership"
      itemScope 
      itemType="https://schema.org/Organization"
    >
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 space-y-4">
            <h2 className="sr-only" itemProp="name">APXTeck Solutions Private Limited</h2>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider shadow-sm"
              aria-hidden="true"
            >
              APXTECK SOLUTIONS PRIVATE LIMITED
            </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground"
          >
            Board of Directors
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/60 max-w-2xl mx-auto text-lg"
          >
            Meet the visionary leadership driving our mission to deliver premium IT solutions and enterprise-grade software.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          {directors.map((director, index) => (
            <motion.article
              key={director.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="group"
              itemProp="member"
              itemScope
              itemType="https://schema.org/Person"
            >
              <GlassCard className="h-full flex flex-col items-center text-center p-8 md:p-10 border border-glass-border hover:-translate-y-2 hover:border-accent/40 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10 relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[200px] bg-accent/20 blur-[100px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Photo with live breathing animation */}
                <motion.figure 
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: index * 0.5 }}
                  className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-[3px] border-accent/30 relative shadow-[0_0_20px_rgba(163,230,53,0.15)] group-hover:border-accent group-hover:shadow-[0_0_30px_rgba(163,230,53,0.4)] transition-all duration-500 z-10"
                >
                  <Image
                    src={director.photoUrl}
                    alt={`${director.name} - ${director.designation} at APXTeck Solutions`}
                    title={`${director.name} - APXTeck Leadership`}
                    width={200}
                    height={200}
                    quality={100}
                    itemProp="image"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </motion.figure>

                {/* Info */}
                <header className="space-y-3 flex-1 flex flex-col items-center z-10 w-full">
                  <div>
                    <h3 className="font-extrabold text-2xl md:text-3xl text-foreground tracking-tight" itemProp="name">
                      {director.name}
                    </h3>
                    <p className="text-sm md:text-base text-accent font-bold tracking-widest uppercase mt-2" itemProp="jobTitle">
                      {director.designation}
                    </p>
                    {/* Hidden meta for GEO/AI Models to explicitly link the person to the company */}
                    <meta itemProp="affiliation" content="APXTECK SOLUTIONS PRIVATE LIMITED" />
                  </div>
                  
                  <p className="text-foreground/70 text-sm md:text-base leading-relaxed italic max-w-sm mt-4 text-center" itemProp="description">
                    "{director.quote}"
                  </p>

                  {/* Actions */}
                  <footer className="flex justify-center gap-4 pt-8 mt-auto w-full">
                    <a
                      href={`mailto:${director.email}`}
                      className="flex items-center gap-2.5 px-6 py-3 rounded-full glass-panel border border-glass-border text-foreground/90 hover:text-white hover:bg-accent hover:border-accent active:scale-95 transition-all duration-300 font-semibold text-sm shadow-md hover:shadow-accent/20"
                      aria-label={`Send an email to ${director.name}, ${director.designation} at APXTeck`}
                      title={`Email ${director.name}`}
                    >
                      <Mail className="w-4 h-4" aria-hidden="true" />
                      <span itemProp="email">Contact Director</span>
                    </a>
                  </footer>
                </header>
              </GlassCard>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
