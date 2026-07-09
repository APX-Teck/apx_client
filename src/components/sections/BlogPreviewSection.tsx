'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/axios';
import { BlogPost } from '@/app/types/blog.types';

export function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const data = await api.fetchBlogs();
        // Filter published posts and slice to 3
        const latest = data.filter((p) => p.status === 'PUBLISHED').slice(0, 3);
        setPosts(latest);
      } catch (err) {
        console.error('Failed to load blog posts', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-16 md:py-24 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold uppercase tracking-wider mb-4"
            >
              Resources
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
            >
              Latest Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/75 max-w-xl text-lg leading-relaxed"
            >
              Stay ahead of the curve with our latest articles on technology, design guidelines, and
              search engine trends.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/insights-news"
              className="inline-flex h-12 items-center gap-2 rounded-full glass-panel border border-glass-border px-6 text-sm font-semibold hover:text-accent hover:border-accent/40 active:scale-95 transition-all"
            >
              Explore All News
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[420px] rounded-3xl bg-foreground/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link href={`/insights-news/${post.slug}`} className="block group h-full">
                  <GlassCard className="!p-0 overflow-hidden h-full flex flex-col hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                    {/* Cover Image */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={post.coverImageUrl || 'https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3'}
                        alt={`${post.title} article cover image`}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                      {post.tags && post.tags.length > 0 && (
                        <div className="absolute top-4 left-4 glass-panel border border-white/20 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                          {post.tags?.[0]}
                        </div>
                      )}
                    </div>

                    {/* Blog Content */}
                    <div className="p-6 flex flex-col flex-1 justify-between gap-6">
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-accent transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                      </div>

                      {/* Footer Details */}
                      <div className="flex items-center justify-between text-xs text-foreground/50 pt-4 border-t border-glass-border">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-accent" />
                          {formatDate(post.publishedAt)}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-accent" />5 min read
                        </span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
