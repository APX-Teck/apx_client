"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Send, Mail, Phone, MapPin } from "lucide-react";

export function ContactCTASection() {
  return (
    <section id="contact" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <GlassCard className="relative overflow-hidden !p-0">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-purple-500/20 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-glass-border">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
              >
                Let&apos;s Build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                  Something Amazing
                </span>
              </motion.h2>
              <p className="text-foreground/70 text-lg mb-10">
                Ready to take your digital presence to the next level? Drop us a message and our team will get back to you within 24 hours.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Email Us</p>
                    <p className="text-foreground/60">hello@apxteck.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Call Us</p>
                    <p className="text-foreground/60">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">Visit Us</p>
                    <p className="text-foreground/60">123 Innovation Drive, Tech City</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 lg:p-16">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="John"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all"
                    placeholder="john@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    rows={4}
                    className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden shadow-lg shadow-accent/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Send Message
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </button>
              </form>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
