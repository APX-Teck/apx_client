"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Portfolio } from "@/app/types/portfolio.types";

interface PortfolioListingSectionProps {
  initialPortfolios: Portfolio[];
}

export function PortfolioListingSection({ initialPortfolios }: PortfolioListingSectionProps) {
  const [activeTab, setActiveTab] = useState("All");

  const serviceTypes = ["All", ...Array.from(new Set(initialPortfolios.map((p) => p.serviceType)))];

  const filteredPortfolios = initialPortfolios.filter((p) => {
    if (activeTab === "All") return true;
    return p.serviceType.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section className="py-12 max-w-7xl mx-auto px-6 space-y-12">
      
      {/* Category Tabs Filter */}
      <div className="flex justify-center flex-wrap gap-2.5 mb-8">
        {serviceTypes.map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
              activeTab === type
                ? "bg-accent border-accent text-white shadow-lg shadow-accent/15"
                : "glass-panel border-glass-border text-foreground/70 hover:bg-white/5"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
        <AnimatePresence mode="popLayout">
          {filteredPortfolios.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <GlassCard className="p-4 sm:p-4 group cursor-pointer flex flex-col justify-between h-full hover:border-white/20 hover:shadow-2xl transition-all duration-300">
                
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-5 bg-accent/5">
                    {item.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Link
                        href={`/portfolio/${item.slug}`}
                        className="glass-panel border border-white/30 px-5 py-2 rounded-full text-white text-xs font-semibold flex items-center gap-2 hover:bg-white/10 active:scale-95 transition-all"
                      >
                        Read Case Study <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="px-2 pb-2">
                    <div className="text-accent text-[10px] font-bold uppercase tracking-wider mb-2">
                      {item.serviceType}
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground mb-3 group-hover:text-accent transition-colors leading-snug">
                      {item.title}
                    </h3>
                    {item.results && (
                      <p className="text-foreground/70 text-xs leading-relaxed line-clamp-3 italic">
                        &quot;{item.results}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Details */}
                <div className="pt-4 mt-6 border-t border-glass-border flex justify-between items-center text-xs text-foreground/50 px-2 mt-auto">
                  <span>Client: <strong className="text-foreground/80">{item.clientName}</strong></span>
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="hover:text-accent font-bold transition-colors flex items-center gap-1"
                  >
                    View Case <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

              </GlassCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </section>
  );
}
