"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "CEO at TechFlow",
    content: "APXTeck completely transformed our digital presence. The new platform is not only beautiful but extremely fast. Their attention to detail is unmatched.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Founder, DataSync",
    content: "Working with them was a breeze. They understood our complex requirements and delivered a solution that exceeded our expectations in every way.",
    rating: 5,
  },
  {
    name: "Emma Watson",
    role: "Marketing Director",
    content: "The ROI we've seen since launching the new SEO strategy and redesigned website is phenomenal. Highly recommend the APX team!",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Client Success
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 max-w-2xl mx-auto text-lg"
          >
            Don&apos;t just take our word for it. Hear from the amazing companies we&apos;ve partnered with.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
            >
              <GlassCard className="h-full relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/20" />
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  ))}
                </div>
                <p className="text-foreground/80 text-lg leading-relaxed mb-8 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="mt-auto">
                  <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                  <p className="text-foreground/60 text-sm">{testimonial.role}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
