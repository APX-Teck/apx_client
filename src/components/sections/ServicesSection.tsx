'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import {
  Code2,
  Search,
  Smartphone,
  Rocket,
  Shield,
  Globe,
  ArrowRight,
  Clock,
  Tag,
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { Service } from '@/app/types/service.types';

const getServiceIcon = (slug: string) => {
  switch (slug) {
    case 'web-development':
      return Code2;
    case 'seo-optimization':
      return Search;
    case 'ui-ux-design':
      return Smartphone;
    case 'digital-marketing':
      return Rocket;
    case 'cloud-solutions':
      return Globe;
    default:
      return Shield;
  }
};

const getServiceGlow = (slug: string) => {
  switch (slug) {
    case 'web-development':
      return '#0ea5e9'; // Cyan
    case 'seo-optimization':
      return '#8b5cf6'; // Purple
    case 'ui-ux-design':
      return '#ec4899'; // Pink
    case 'digital-marketing':
      return '#f59e0b'; // Amber
    default:
      return '#10b981'; // Emerald
  }
};

export function ServicesSection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.fetchServices();
        // Filter out inactive services just in case, and sort them
        const activeServices = data
          .filter((s) => s.isActive)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        setServices(activeServices);
      } catch (err) {
        console.error('Failed to load services', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadServices();
  }, []);

  return (
    <section id="services" className="py-16 md:py-24 relative overflow-hidden">
      {/* Background radial accent */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider mb-4"
          >
            Capabilities
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6"
          >
            Our Premium Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/75 max-w-2xl mx-auto text-lg leading-relaxed"
          >
            High-end engineering meets elite creative designs. We deliver comprehensive IT solutions
            custom built for Indian SMBs.
          </motion.p>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-80 rounded-3xl bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = getServiceIcon(service.slug);
              const glow = getServiceGlow(service.slug);

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <GlassCard
                    className="h-full flex flex-col items-start justify-between gap-6 hover:-translate-y-2 hover:shadow-2xl hover:border-accent/40 transition-all duration-300 group"
                    glowColor={glow}
                  >
                    <div className="flex flex-col items-start gap-5 w-full">
                      {/* Icon */}
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 border backdrop-blur-sm"
                        style={{
                          backgroundColor: `${glow}14`,
                          borderColor: `${glow}3a`,
                          color: glow,
                          boxShadow: `0 8px 20px -6px ${glow}26, 0 0 15px 1px ${glow}1a`,
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Header */}
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                          {service.name}
                        </h3>
                        <p className="text-foreground/70 text-sm leading-relaxed min-h-[72px]">
                          {service.description}
                        </p>
                      </div>

                      {/* Details */}
                      <div className="w-full pt-4 border-t border-glass-border space-y-2 text-xs text-foreground/60">
                        {service.timeline && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span>Timeline: {service.timeline}</span>
                          </div>
                        )}
                        {service.price && (
                          <div className="flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5 text-emerald-500" />
                            <span>
                              Investment:{' '}
                              <strong className="text-foreground">{service.price}</strong>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors mt-4 group/btn"
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
