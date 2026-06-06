"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare } from "lucide-react";
import { api } from "@/lib/axios";
import { Service } from "@/app/types/service.types";

const contactSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Name must be between 2 and 80 characters" })
    .max(80, { message: "Name must be between 2 and 80 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: "Please enter a valid 10-digit Indian phone number",
    }),
  businessName: z
    .string()
    .max(100, { message: "Business Name can be at most 100 characters" })
    .optional(),
  serviceInterest: z.string().optional(),
  message: z
    .string()
    .min(20, { message: "Message must be between 20 and 1000 characters" })
    .max(1000, { message: "Message must be between 20 and 1000 characters" }),
  // Honeypot field for bot spam blocking
  website: z.string().max(100).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactPageSectionProps {
  services: Service[];
}

export function ContactPageSection({ services }: ContactPageSectionProps) {
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      businessName: "",
      serviceInterest: "",
      message: "",
      website: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Honeypot bot protection check: if filled, fail silently or block
    if (values.website) {
      console.warn("Spam Bot Detected.");
      setIsSubmitSuccess(true); // fool the bot into thinking it succeeded
      reset();
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");
    setIsSubmitSuccess(false);

    try {
      const { website, ...submitData } = values; // Exclude honeypot
      const res = await api.submitEnquiry(submitData);
      if (res.success) {
        setIsSubmitSuccess(true);
        reset();
      } else {
        setErrorMessage(res.message || "Failed to submit enquiry.");
      }
    } catch {
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-6">
      
      <div className="grid lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Info Cards & Map */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Get in Touch</h1>
            <p className="text-foreground/75 leading-relaxed">
              Have questions about our custom services, API systems, or packages? Talk to our technology experts.
            </p>
          </div>

          {/* Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-glass-border flex gap-3">
              <Mail className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Write to Us</h4>
                <p className="text-xs text-foreground/60 mt-1">hello@apxteck.com</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-glass-border flex gap-3">
              <Phone className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Call Our Office</h4>
                <p className="text-xs text-foreground/60 mt-1">+91 98765 43210</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-foreground/[0.01] border border-glass-border flex gap-3 sm:col-span-2">
              <MapPin className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Business Address</h4>
                <p className="text-xs text-foreground/60 mt-1">
                  102, Technology Innovation Incubator, Infotech Park, Hinjawadi Phase 1, Pune, MH, India
                </p>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="w-full h-64 rounded-3xl overflow-hidden border border-glass-border shadow-inner">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15127.886071850125!2d73.72970597321289!3d18.5753063546706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m2s0x3bc2bbc10d8fa093%3A0xc3cf02b98218a0!2sHinjawadi%20Phase%201%2C%20Hinjawadi%2C%20Pune%2C%20Maharashtra%20411057!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="APXTeck Office Location"
            />
          </div>

        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7">
          <GlassCard className="p-8 md:p-10 border border-glass-border">
            
            {isSubmitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Thank you! Your enquiry has been received. We will contact you in 24 hours.</span>
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-sm font-semibold">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              
              {/* Honeypot field (hidden completely from humans) */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  {...register("website")}
                  tabIndex={-1}
                  autoComplete="off"
                  placeholder="Leave blank"
                />
              </div>

              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullName")}
                  className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                    errors.fullName ? "border-rose-500/50 focus:border-rose-500" : "border-glass-border focus:border-accent"
                  }`}
                  placeholder="e.g. Rahul Deshmukh"
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-500 font-medium pl-1">{errors.fullName.message}</p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid md:grid-cols-2 gap-5">
                
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                      errors.email ? "border-rose-500/50 focus:border-rose-500" : "border-glass-border focus:border-accent"
                    }`}
                    placeholder="name@company.com"
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.email.message}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                    Mobile Number (Indian)
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                      errors.phone ? "border-rose-500/50 focus:border-rose-500" : "border-glass-border focus:border-accent"
                    }`}
                    placeholder="10-digit mobile"
                  />
                  {errors.phone && (
                    <p className="text-xs text-rose-500 font-medium pl-1">{errors.phone.message}</p>
                  )}
                </div>

              </div>

              {/* Business Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Business Name
                </label>
                <input
                  type="text"
                  {...register("businessName")}
                  className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                    errors.businessName ? "border-rose-500/50 focus:border-rose-500" : "border-glass-border focus:border-accent"
                  }`}
                  placeholder="e.g. Acme Tech Solutions"
                />
                {errors.businessName && (
                  <p className="text-xs text-rose-500 font-medium pl-1">{errors.businessName.message}</p>
                )}
              </div>

              {/* Service Interest */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Service Interest
                </label>
                <select
                  {...register("serviceInterest")}
                  className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent appearance-none relative text-foreground/80 dark:bg-zinc-950"
                >
                  <option value="">Select a service category</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                  Detailed Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  {...register("message")}
                  className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all resize-none focus:ring-2 focus:ring-accent/50 ${
                    errors.message ? "border-rose-500/50 focus:border-rose-500" : "border-glass-border focus:border-accent"
                  }`}
                  placeholder="Please write at least 20 characters detailing your request requirements..."
                />
                {errors.message && (
                  <p className="text-xs text-rose-500 font-medium pl-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-accent text-white px-8 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {isSubmitting ? "Sending message..." : "Send Message"}
                  {!isSubmitting && (
                    <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  )}
                </span>
              </button>

            </form>
          </GlassCard>
        </div>

      </div>

    </section>
  );
}
