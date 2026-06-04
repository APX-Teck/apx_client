"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

const recentPosts = [
  {
    title: "The Future of Web Development in 2026",
    category: "Technology",
    date: "Jun 1, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Mastering Next.js Animations with Framer",
    category: "Tutorial",
    date: "May 28, 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "How SEO is Changing for AI-First Search Engines",
    category: "Marketing",
    date: "May 15, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export function BlogPreviewSection() {
  return (
    <section className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Latest Insights
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/70 max-w-xl text-lg"
            >
              Stay ahead of the curve with our latest articles on technology, design, and marketing strategies.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Link
              href="/explore"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
            >
              Explore all news <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {recentPosts.map((post, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <Link href="/explore" className="block group">
                <GlassCard className="!p-0 overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 glass-panel px-3 py-1 rounded-full text-xs font-semibold text-white">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold mb-4 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    <div className="mt-auto flex items-center justify-between text-xs text-foreground/60">
                      <span>{post.date}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {post.readTime}
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
