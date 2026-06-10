'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Send, Mail, Phone, MapPin, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';
import { Service } from '@/app/types/service.types';

const enquirySchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Name must be between 2 and 80 characters' })
    .max(80, { message: 'Name must be between 2 and 80 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^[6-9]\d{9}$/.test(val), {
      message: 'Please enter a valid 10-digit Indian mobile number',
    }),
  serviceInterest: z.string().optional(),
  message: z
    .string()
    .min(10, { message: 'Message must be between 10 and 500 characters' })
    .max(500, { message: 'Message must be between 10 and 500 characters' }),
});

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export function ContactCTASection() {
  const [services, setServices] = useState<Service[]>([]);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState('');
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      serviceInterest: '',
      message: '',
    },
  });

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.fetchServices();
        setServices(data.filter((s) => s.isActive));
      } catch (err) {
        console.error('Failed to load services for dropdown', err);
      }
    }
    loadServices();
  }, []);

  const onSubmit = async (values: EnquiryFormValues) => {
    setIsSubmittingForm(true);
    setSubmitErrorMessage('');
    setIsSubmitSuccess(false);

    try {
      const res = await api.submitEnquiry(values);
      if (res.success) {
        setIsSubmitSuccess(true);
        reset();
      } else {
        setSubmitErrorMessage(res.message || 'Failed to submit enquiry.');
      }
    } catch (err) {
      setSubmitErrorMessage('A connection error occurred. Please try again.');
    } finally {
      setIsSubmittingForm(false);
    }
  };

  return (
    <section id="contact" className="py-32 relative bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <GlassCard className="relative overflow-hidden !p-0 border border-glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-purple-500/10 pointer-events-none" />

          <div className="grid lg:grid-cols-12">
            {/* Left Info Panel */}
            <div className="lg:col-span-5 p-10 lg:p-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-glass-border">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 text-accent text-xs font-bold uppercase tracking-wider">
                  Contact
                </div>
                <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                  Let&apos;s Build <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">
                    Something Amazing
                  </span>
                </h2>
                <p className="text-foreground/75 text-base leading-relaxed">
                  Ready to elevate your operations with advanced visual interfaces? Submit an
                  enquiry and our engineering leads will respond within 24 hours.
                </p>

                <div className="space-y-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel border border-glass-border flex items-center justify-center text-accent">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Email Us</p>
                      <p className="text-foreground/60 text-sm">info@apxteck.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel border border-glass-border flex items-center justify-center text-purple-500">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Call Us</p>
                      <p className="text-foreground/60 text-sm">+91 94052 82582</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl glass-panel border border-glass-border flex items-center justify-center text-pink-500">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-foreground">Visit Us</p>
                      <p className="text-foreground/60 text-sm">
                        Flat No. 24, 3rd Floor, Balaji Residency Dighe, Manaji Nagar, Narhe, Pune. 411041
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Form Panel */}
            <div className="lg:col-span-7 p-10 lg:p-16">
              {isSubmitSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 text-sm font-medium"
                >
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <span>
                    Your enquiry has been submitted successfully! An administrator has been
                    notified.
                  </span>
                </motion.div>
              )}

              {submitErrorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-sm font-medium"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submitErrorMessage}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    suppressHydrationWarning
                    type="text"
                    {...register('fullName')}
                    className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                      errors.fullName
                        ? 'border-rose-500/50 focus:border-rose-500'
                        : 'border-glass-border focus:border-accent'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="text-xs text-rose-500 font-medium pl-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      suppressHydrationWarning
                      type="email"
                      {...register('email')}
                      className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                        errors.email
                          ? 'border-rose-500/50 focus:border-rose-500'
                          : 'border-glass-border focus:border-accent'
                      }`}
                      placeholder="name@company.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-rose-500 font-medium pl-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                      Indian Phone Number
                    </label>
                    <input
                      suppressHydrationWarning
                      type="tel"
                      {...register('phone')}
                      className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all focus:ring-2 focus:ring-accent/50 ${
                        errors.phone
                          ? 'border-rose-500/50 focus:border-rose-500'
                          : 'border-glass-border focus:border-accent'
                      }`}
                      placeholder="e.g. 9876543210"
                    />
                    {errors.phone && (
                      <p className="text-xs text-rose-500 font-medium pl-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Service Interest dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    Service Interest
                  </label>
                  <select
                    suppressHydrationWarning
                    {...register('serviceInterest')}
                    className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent appearance-none relative text-foreground/80"
                  >
                    <option value="" className="text-foreground/50 bg-background">
                      Select a service of interest
                    </option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name} className="text-foreground bg-background">
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-foreground/70">
                    Your Message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    suppressHydrationWarning
                    rows={4}
                    {...register('message')}
                    className={`w-full bg-foreground/[0.02] border rounded-xl px-4 py-3 outline-none text-sm transition-all resize-none focus:ring-2 focus:ring-accent/50 ${
                      errors.message
                        ? 'border-rose-500/50 focus:border-rose-500'
                        : 'border-glass-border focus:border-accent'
                    }`}
                    placeholder="Tell us about your project requirements..."
                  />
                  {errors.message && (
                    <p className="text-xs text-rose-500 font-medium pl-1">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  suppressHydrationWarning
                  type="submit"
                  disabled={isSubmittingForm}
                  className="w-full group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-accent px-8 text-sm font-semibold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {isSubmittingForm ? 'Submitting Enquiry...' : 'Submit Enquiry'}
                    {!isSubmittingForm && (
                      <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    )}
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
