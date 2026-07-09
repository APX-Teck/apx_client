'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ExternalLink, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { Portfolio } from '@/app/types/portfolio.types';

export function PortfolioSection() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPortfolios() {
      try {
        const data = await api.fetchPortfolios();
        // Backend already filters by isPublished: true
        const items = (data || []).sort((a, b) => a.sortOrder - b.sortOrder).slice(0, 3);
        setPortfolios(items);
      } catch (err) {
        console.error('Failed to load portfolio items', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPortfolios();
  }, []);

  return (
    <section id="portfolio" className="py-16 md:py-24 relative bg-background">
      {/* Background blur blobs */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-4"
            >
              Case Studies
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            >
              Featured Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/75 max-w-xl text-lg leading-relaxed"
            >
              Discover how we help Indian SMBs and global clients deploy robust code systems and
              visual identity portals.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/portfolio"
              className="inline-flex h-12 items-center gap-2 rounded-full glass-panel border border-glass-border px-6 text-sm font-semibold hover:text-accent hover:border-accent/40 active:scale-95 transition-all"
            >
              Explore All Projects
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 rounded-3xl bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassCard className="p-4 sm:p-4 group cursor-pointer flex flex-col h-full hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                  {/* Card Thumbnail Image */}
                  <div className="relative w-full h-56 rounded-2xl overflow-hidden mb-5 bg-foreground/5 flex items-center justify-center">
                    <Image
                      src={
                        item.coverImageUrl ||
                        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3'
                      }
                      alt={`${item.title} portfolio project thumbnail`}
                      width={600}
                      height={400}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="glass-panel border border-white/30 px-5 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
                      >
                        Read Case Study <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="px-2 pb-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-accent text-xs font-bold uppercase tracking-widest mb-2">
                        {item.serviceType}
                      </div>
                      <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      {item.results && (
                        <p className="text-foreground/70 text-sm leading-relaxed mb-4 italic line-clamp-2">
                          &quot;{item.results}&quot;
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-glass-border text-xs text-foreground/50 mt-auto">
                      <span>
                        Client: <strong className="text-foreground/80">{item.clientName}</strong>
                      </span>
                      {item.liveUrl && (
                        <a
                          href={item.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-accent transition-colors flex items-center gap-1 font-semibold"
                        >
                          Visit Live <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
