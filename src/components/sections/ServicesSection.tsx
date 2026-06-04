"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Code2, Search, Smartphone, Rocket } from "lucide-react";

const services = [
  {
    title: "Web Development",
    description: "High-performance, modular, and scalable Next.js applications tailored to your business needs.",
    icon: Code2,
    color: "#3b82f6",
  },
  {
    title: "SEO Optimization",
    description: "Data-driven SEO strategies to rank your brand higher and capture organic traffic.",
    icon: Search,
    color: "#8b5cf6",
  },
  {
    title: "UI/UX Design",
    description: "Premium, glassy, and highly attractive interfaces that convert visitors into customers.",
    icon: Smartphone,
    color: "#ec4899",
  },
  {
    title: "Digital Marketing",
    description: "Comprehensive marketing campaigns across platforms to skyrocket your growth.",
    icon: Rocket,
    color: "#f59e0b",
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
          >
            Premium Services
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 max-w-2xl mx-auto text-lg"
          >
            We provide end-to-end IT solutions. Everything from cutting-edge development to strategic marketing.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <GlassCard className="h-full flex flex-col items-start gap-6 hover:-translate-y-2 transition-transform duration-300" glowColor={service.color}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
                  style={{ backgroundColor: service.color }}
                >
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">
                  {service.description}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
