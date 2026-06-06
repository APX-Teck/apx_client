"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/axios";
import { Testimonial } from "@/app/types/testimonial.types";

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadTestimonials() {
      try {
        const data = await api.fetchTestimonials();
        const published = data.filter((t) => t.isPublished);
        setTestimonials(published);
      } catch (err) {
        console.error("Failed to load testimonials", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTestimonials();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      handleNext();
    }, 6000);
  };

  useEffect(() => {
    if (testimonials.length > 1) {
      resetTimer();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testimonials, currentIndex, resetTimer]);

  if (isLoading || testimonials.length === 0) {
    return null;
  }

  const current = testimonials[currentIndex];

  return (
    <section id="testimonials" className="py-32 relative overflow-hidden bg-background">
      {/* Background glow overlay */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
          >
            What Our Clients Say
          </motion.h2>
          <p className="text-foreground/60">
            Real feedback from growing Indian SMBs and companies we have partnered with.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="relative p-8 md:p-12 border border-glass-border shadow-xl min-h-[300px] flex flex-col justify-between">
                <Quote className="absolute top-6 right-6 w-14 h-14 text-accent/10 pointer-events-none" />
                
                <div>
                  {/* Rating Stars */}
                  <div className="flex gap-1.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < current.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-foreground/20"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Feedback Text */}
                  <p className="text-lg md:text-xl text-foreground/80 leading-relaxed font-medium italic mb-8">
                    &quot;{current.feedback}&quot;
                  </p>
                </div>

                {/* Client Profile details */}
                <div className="flex items-center gap-4 pt-6 border-t border-glass-border">
                  {current.clientPhotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={current.clientPhotoUrl}
                      alt={current.clientName}
                      className="w-12 h-12 rounded-full object-cover border border-accent/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center font-bold text-accent">
                      {current.clientName[0]}
                    </div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-foreground tracking-tight text-base">
                      {current.clientName}
                    </h4>
                    <p className="text-xs text-foreground/50">
                      {current.clientBusiness} {current.projectType ? `(${current.projectType})` : ""}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          {testimonials.length > 1 && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full glass-panel border border-glass-border flex items-center justify-center hover:bg-foreground/5 active:scale-95 transition-all text-foreground"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full glass-panel border border-glass-border flex items-center justify-center hover:bg-foreground/5 active:scale-95 transition-all text-foreground"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
