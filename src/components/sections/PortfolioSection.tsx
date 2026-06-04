"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const portfolios = [
  {
    title: "E-Commerce Reimagined",
    client: "StyleStore",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1661956602116-aa6865609028?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "FinTech Dashboard",
    client: "CoinFlow",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "AI Startup Landing",
    client: "NeuroSync",
    category: "Full Stack",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  },
];

export function PortfolioSection() {
  return (
    <section id="portfolio" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Featured Work
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-foreground/70 max-w-xl text-lg"
            >
              Take a look at some of our recent projects. We take pride in delivering pixel-perfect, scalable solutions.
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors"
          >
            View all projects <ExternalLink className="w-4 h-4" />
          </motion.button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolios.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <GlassCard className="p-4 sm:p-4 group/card cursor-pointer">
                <div className="relative w-full h-64 rounded-2xl overflow-hidden mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="glass-panel px-6 py-2 rounded-full text-white font-medium flex items-center gap-2">
                      View Case Study <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <div className="text-accent text-xs font-bold uppercase tracking-wider mb-2">
                    {item.category}
                  </div>
                  <h3 className="text-2xl font-semibold mb-1">{item.title}</h3>
                  <p className="text-foreground/60">{item.client}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
