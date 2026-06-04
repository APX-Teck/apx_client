"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "What exactly does APXTeck do?",
    answer: "We are a full-service IT company specializing in high-end web development, mobile applications, advanced UI/UX design, and data-driven SEO/Digital Marketing strategies."
  },
  {
    question: "Do you offer custom pricing for projects?",
    answer: "Absolutely. Every project is unique, so we tailor our pricing based on the scope, complexity, and specific requirements of your business."
  },
  {
    question: "What technologies do you use?",
    answer: "We strictly use modern, scalable tech stacks. Our frontend expertise revolves around React, Next.js, and Framer Motion. For backends, we excel in Node.js, PostgreSQL, and Prisma."
  },
  {
    question: "How long does a typical project take?",
    answer: "A standard corporate website takes 2-4 weeks, while complex SaaS or e-commerce platforms can take 2-4 months depending on feature requirements."
  }
];

export function FaqSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <section className="py-32 relative">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-foreground/70 text-lg"
          >
            Everything you need to know about our services and process.
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isActive = activeIndex === index;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "border border-glass-border rounded-2xl overflow-hidden transition-colors",
                  isActive ? "bg-accent/5 border-accent/30" : "bg-transparent hover:bg-white/5"
                )}
              >
                <button
                  onClick={() => setActiveIndex(isActive ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-semibold text-lg">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-accent transition-transform duration-300",
                      isActive ? "rotate-180" : ""
                    )}
                  />
                </button>
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
