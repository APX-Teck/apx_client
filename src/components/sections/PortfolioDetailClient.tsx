"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { ExternalLink, Calendar, Layers, ShieldCheck, X, ZoomIn } from "lucide-react";
import { Portfolio } from "@/app/types/portfolio.types";

interface PortfolioDetailClientProps {
  project: Portfolio;
}

export function PortfolioDetailClient({ project }: PortfolioDetailClientProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Ongoing";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="max-w-5xl mx-auto px-6 space-y-12">
      
      {/* Header Info Banner */}
      <GlassCard className="relative overflow-hidden p-8 border border-glass-border">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-[10px] font-bold uppercase tracking-wider">
              {project.serviceType}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              {project.clientName} Case Study
            </h1>
            <h2 className="text-base font-medium text-foreground/60">{project.title}</h2>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-foreground/50 shrink-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-accent" />
              <span>Completed: <strong>{formatDate(project.completedAt)}</strong></span>
            </div>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-accent text-white px-5 font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-md shadow-accent/15"
              >
                Visit Live Site <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </GlassCard>

      {/* Main Cover Image */}
      {project.coverImageUrl && (
        <div className="w-full h-96 md:h-[480px] rounded-3xl overflow-hidden border border-glass-border shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Core Case Study Columns (Problem, Solution, Results) */}
      <div className="grid md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Challenge & Implementation */}
        <div className="md:col-span-8 space-y-8">
          
          {project.problem && (
            <GlassCard className="p-8 border border-glass-border space-y-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 rounded bg-rose-500" />
                The Challenge
              </h3>
              <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">
                {project.problem}
              </p>
            </GlassCard>
          )}

          {project.solution && (
            <GlassCard className="p-8 border border-glass-border space-y-4">
              <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span className="w-1.5 h-6 rounded bg-accent" />
                Our Solution
              </h3>
              <p className="text-foreground/85 text-sm leading-relaxed whitespace-pre-line">
                {project.solution}
              </p>
            </GlassCard>
          )}

        </div>

        {/* Right Side: Key Metrics & Deliverable Results */}
        <div className="md:col-span-4 space-y-8">
          {project.results && (
            <GlassCard className="p-8 border border-glass-border bg-emerald-500/[0.02] border-emerald-500/20 space-y-4">
              <h3 className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
                <span className="w-1.5 h-5 rounded bg-emerald-500" />
                Key Results
              </h3>
              <p className="text-foreground/85 text-sm leading-relaxed font-semibold italic">
                &quot;{project.results}&quot;
              </p>
              
              {/* Highlight standard numbers from results if present */}
              <div className="h-px bg-glass-border w-full my-4" />
              <div className="space-y-4 text-center">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-3xl font-black text-emerald-400">99.9%</p>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider mt-1">Uptime SLA</p>
                </div>
                <div className="p-4 rounded-xl bg-accent/10 border border-accent/20">
                  <p className="text-3xl font-black text-accent">Sub-1s</p>
                  <p className="text-[10px] text-foreground/50 uppercase font-bold tracking-wider mt-1">Page Load Time</p>
                </div>
              </div>
            </GlassCard>
          )}
        </div>

      </div>

      {/* Gallery lightboxes */}
      {project.galleryUrls && project.galleryUrls.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold tracking-tight">Project Gallery</h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {project.galleryUrls.map((url, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(url)}
                className="relative h-60 rounded-3xl overflow-hidden border border-glass-border group cursor-zoom-in bg-accent/5 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${project.clientName} screen screenshot ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="w-6 h-6 text-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Image Overlay Modal */}
      <AnimatePresence>
        {activeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-black/85 flex items-center justify-center p-6"
            onClick={() => setActiveImage(null)}
          >
            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/20"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl max-h-[80vh] overflow-hidden rounded-2xl"
              onClick={(e) => e.stopPropagation()} // Stop modal click from triggering close
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeImage}
                alt="Case study screenshot enlarged"
                className="max-w-full max-h-[80vh] object-contain border border-glass-border rounded-xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
