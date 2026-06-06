"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Code2, Search, Smartphone, Rocket, Shield, Globe, ArrowRight, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { Service } from "@/app/types/service.types";

interface ServicesListingSectionProps {
  initialServices: Service[];
}

const categories = ["All", "Development", "Design", "Marketing"];

const getServiceCategory = (slug: string) => {
  if (slug.includes("development") || slug.includes("cloud")) return "Development";
  if (slug.includes("design") || slug.includes("ui")) return "Design";
  if (slug.includes("seo") || slug.includes("marketing")) return "Marketing";
  return "All";
};

const getServiceIcon = (slug: string) => {
  switch (slug) {
    case "web-development":
      return Code2;
    case "seo-optimization":
      return Search;
    case "ui-ux-design":
      return Smartphone;
    case "digital-marketing":
      return Rocket;
    default:
      return Globe;
  }
};

const getServiceGlow = (slug: string) => {
  switch (slug) {
    case "web-development":
      return "#0ea5e9";
    case "seo-optimization":
      return "#8b5cf6";
    case "ui-ux-design":
      return "#ec4899";
    case "digital-marketing":
      return "#f59e0b";
    default:
      return "#10b981";
  }
};

export function ServicesListingSection({ initialServices }: ServicesListingSectionProps) {
  const [activeTab, setActiveTab] = useState("All");

  const filteredServices = initialServices.filter((service) => {
    if (activeTab === "All") return true;
    return getServiceCategory(service.slug) === activeTab;
  });

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      
      {/* Category Tabs Filter */}
      <div className="flex justify-center flex-wrap gap-3 mb-16">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 border ${
              activeTab === cat
                ? "bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105"
                : "glass-panel border-glass-border text-foreground/75 hover:bg-white/10 hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredServices.map((service, index) => {
            const Icon = getServiceIcon(service.slug);
            const glow = getServiceGlow(service.slug);

            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="h-full"
              >
                <GlassCard
                  className="h-full flex flex-col justify-between hover:border-white/20 hover:shadow-2xl transition-all duration-300 group"
                  glowColor={glow}
                >
                  <div className="space-y-6">
                    {/* Image / Icon container */}
                    <div className="relative w-full h-44 rounded-2xl overflow-hidden">
                      {service.thumbnailUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={service.thumbnailUrl}
                          alt={service.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                        />
                      ) : (
                        <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                          <Icon className="w-12 h-12 text-accent/50" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 glass-panel border border-white/20 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider">
                        {getServiceCategory(service.slug)}
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold tracking-tight text-foreground">{service.name}</h3>
                      <p className="text-foreground/70 text-sm leading-relaxed min-h-[64px]">
                        {service.description}
                      </p>
                    </div>

                    {/* Specific specifications */}
                    <div className="pt-4 border-t border-glass-border grid grid-cols-2 gap-4 text-xs text-foreground/60">
                      {service.timeline && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Timeline</p>
                          <div className="flex items-center gap-1.5 mt-1 font-semibold text-foreground/80">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span>{service.timeline}</span>
                          </div>
                        </div>
                      )}
                      {service.price && (
                        <div>
                          <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Investment</p>
                          <div className="flex items-center gap-1.5 mt-1 font-semibold text-emerald-500">
                            <Tag className="w-3.5 h-3.5" />
                            <span>{service.price}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dynamic slug route link */}
                  <div className="pt-6 mt-6 border-t border-glass-border">
                    <Link
                      href={`/services/${service.slug}`}
                      className="w-full inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-foreground text-background font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </section>
  );
}
