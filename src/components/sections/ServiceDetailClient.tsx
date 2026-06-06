"use client";

import { useEffect, useState, useRef } from "react";
import { useForm, FieldValues } from "react-hook-form";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Clock, Tag, FileText, Send, CheckCircle2, ChevronDown, User, ArrowRight, Quote, Star, ShieldAlert } from "lucide-react";
import { api } from "@/lib/axios";
import { Service, ServiceField } from "@/app/types/service.types";
import { Testimonial } from "@/app/types/testimonial.types";
import { Faq } from "@/app/types/faq.types";
import Link from "next/link";

interface ServiceDetailClientProps {
  service: Service;
  fields: ServiceField[];
  allServices: Service[];
  testimonials: Testimonial[];
  faqs: Faq[];
}

const getServiceDeliverables = (slug: string) => {
  switch (slug) {
    case "web-development":
      return [
        "Custom Next.js App Router Setup",
        "Prisma ORM & PostgreSQL Database schemas",
        "Responsive, modern glassmorphic interface UI",
        "Full SEO Structured Data (JSON-LD) configuration",
        "Admin Dashboard control panels integration",
        "Turbopack compiling optimizations"
      ];
    case "seo-optimization":
      return [
        "Complete technical and code-level SEO auditing",
        "Detailed competitor keywords research",
        "On-page meta tags and semantic HTML structuring",
        "Google Search Console & Analytics integration",
        "Schema micro-data implementations",
        "Quality link profile generation roadmap"
      ];
    case "ui-ux-design":
      return [
        "High-fidelity responsive UI designs (Figma)",
        "Premium color palettes & typography pairing",
        "Micro-animations & transitions mockups",
        "User persona mapping & card sorting surveys",
        "Interactive desktop & mobile prototypes",
        "Full developer handoff assets library"
      ];
    default:
      return [
        "Target client audience scoping",
        "Modern system architecture planning",
        "Responsive stylesheet setups",
        "Secure APIs & connection routers",
        "Performance and speed testing audits",
        "24/7 post-launch maintenance logs"
      ];
  }
};

const processSteps = [
  { step: "01", title: "Discovery", desc: "Aligning on goals, scope, inputs, and budget." },
  { step: "02", title: "Engineering & Design", desc: "Creating visual prototypes and writing modular code." },
  { step: "03", title: "Deploy & Scale", desc: "Conducting speed optimizations and launching public services." }
];

export function ServiceDetailClient({
  service,
  fields,
  allServices,
  testimonials,
  faqs
}: ServiceDetailClientProps) {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);
  
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm();

  // Load saved form values if returning from auth redirect
  useEffect(() => {
    const saved = sessionStorage.getItem("saved_request_form");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([key, val]) => {
          setValue(key, val);
        });
        // Scroll directly to form for convenience
        setTimeout(() => {
          formRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 800);
      } catch (err) {
        console.error("Failed to restore form inputs", err);
      }
    }
  }, [setValue]);

  const onSubmit = async (values: FieldValues) => {
    setErrorMessage("");
    setIsSubmitSuccess(false);

    // Authentication Gate Check
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      // Save form state in sessionStorage to prevent data loss
      sessionStorage.setItem("saved_request_form", JSON.stringify(values));
      // Redirect to login page
      router.push(`/login?redirect=/services/${service.slug}`);
      return;
    }

    setIsSubmitting(true);
    
    // Construct Multi-part FormData
    const formData = new FormData();
    Object.entries(values).forEach(([key, val]) => {
      if (val instanceof FileList) {
        if (val.length > 0) {
          formData.append(key, val[0]);
        }
      } else {
        formData.append(key, String(val));
      }
    });

    try {
      const res = await api.submitServiceRequest(service.id, formData);
      if (res.success) {
        setIsSubmitSuccess(true);
        sessionStorage.removeItem("saved_request_form");
        reset();
      } else {
        setErrorMessage(res.message);
      }
    } catch {
      setErrorMessage("Connection failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const filteredTestimonials = testimonials.filter(
    (t) => t.projectType?.toLowerCase().includes(service.name.toLowerCase()) || 
           service.name.toLowerCase().includes(t.projectType?.toLowerCase() || "")
  );

  const relatedServices = allServices
    .filter((s) => s.slug !== service.slug)
    .slice(0, 3);

  const deliverables = getServiceDeliverables(service.slug);

  return (
    <div className="space-y-24">
      {/* 1. Hero */}
      <section className="relative py-20 overflow-hidden bg-background">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider">
              Service Specs
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              {service.name}
            </h1>
            <p className="text-foreground/75 text-lg leading-relaxed max-w-xl">
              {service.description}
            </p>

            <div className="flex flex-wrap gap-6 text-sm text-foreground/60 py-4 border-y border-glass-border">
              {service.timeline && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" />
                  <span>Timeline: <strong>{service.timeline}</strong></span>
                </div>
              )}
              {service.price && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span>Estimation: <strong className="text-foreground">{service.price}</strong></span>
                </div>
              )}
            </div>

            <button
              onClick={scrollToForm}
              className="inline-flex h-12 items-center gap-2 rounded-xl bg-accent hover:bg-accent/90 text-white px-8 text-sm font-semibold transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-accent/25 cursor-pointer"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="lg:col-span-5 relative w-full h-[320px] rounded-3xl overflow-hidden border border-glass-border">
            {service.thumbnailUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={service.thumbnailUrl}
                alt={service.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent/5 flex items-center justify-center">
                <FileText className="w-20 h-20 text-accent/20" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. What's Included & Process */}
      <section className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">What is Included</h2>
          <ul className="grid sm:grid-cols-2 gap-4">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground/75 text-sm leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Our Delivery Process</h2>
          <div className="space-y-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-4">
                <span className="text-3xl font-black text-accent/30 tracking-tight">{step.step}</span>
                <div>
                  <h4 className="font-extrabold text-foreground tracking-tight text-base mb-1">{step.title}</h4>
                  <p className="text-foreground/60 text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Dynamic Service Request Form */}
      <section ref={formRef} className="max-w-3xl mx-auto px-6">
        <GlassCard className="p-8 md:p-12 border border-glass-border relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-purple-500/5 pointer-events-none" />
          
          <div className="text-center mb-8 space-y-2 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight">Submit Requirements</h2>
            <p className="text-foreground/60 text-sm">
              Submit your request parameters. Authentic login is required to process requests.
            </p>
          </div>

          {isSubmitSuccess && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center gap-3 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Request registered successfully! Check your user panel for updates.</span>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center gap-3 text-sm font-semibold">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {fields.length === 0 ? (
            <div className="text-center text-foreground/50 py-6 text-sm">
              No additional configuration fields requested. Ready to build custom modules? Contact us!
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative z-10">
              {fields.map((field) => {
                const requiredSymbol = field.isRequired ? " *" : "";
                
                return (
                  <div key={field.id} className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-foreground/75">
                      {field.fieldLabel} {requiredSymbol}
                    </label>

                    {field.fieldType === "TEXT" && (
                      <input
                        type="text"
                        {...register(field.fieldKey, { required: field.isRequired })}
                        placeholder={field.placeholder || ""}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      />
                    )}

                    {field.fieldType === "TEXTAREA" && (
                      <textarea
                        rows={4}
                        {...register(field.fieldKey, { required: field.isRequired })}
                        placeholder={field.placeholder || ""}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm resize-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      />
                    )}

                    {field.fieldType === "DROPDOWN" && (
                      <select
                        {...register(field.fieldKey, { required: field.isRequired })}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent dark:bg-zinc-950"
                      >
                        <option value="">{field.placeholder || "Select option"}</option>
                        {Array.isArray(field.options) &&
                          field.options.map((opt: string, oIdx: number) => (
                            <option key={oIdx} value={opt}>{opt}</option>
                          ))}
                      </select>
                    )}

                    {field.fieldType === "FILE" && (
                      <input
                        type="file"
                        {...register(field.fieldKey, { required: field.isRequired })}
                        className="w-full text-sm text-foreground/70 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20 file:cursor-pointer"
                      />
                    )}

                    {field.fieldType === "NUMBER" && (
                      <input
                        type="number"
                        {...register(field.fieldKey, { required: field.isRequired })}
                        placeholder={field.placeholder || ""}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                      />
                    )}

                    {field.fieldType === "DATE" && (
                      <input
                        type="date"
                        {...register(field.fieldKey, { required: field.isRequired })}
                        className="w-full bg-foreground/[0.02] border border-glass-border rounded-xl px-4 py-3 outline-none text-sm focus:ring-2 focus:ring-accent/50 focus:border-accent dark:bg-zinc-950"
                      />
                    )}

                    {errors[field.fieldKey] && (
                      <p className="text-xs text-rose-500 font-medium pl-1">This field is required</p>
                    )}
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-accent text-white px-8 text-sm font-semibold transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/25"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? "Submitting requirements..." : "Submit Project Requirements"}</span>
              </button>
            </form>
          )}
        </GlassCard>
      </section>

      {/* 4. Testimonials Filter (only matching ones) */}
      {filteredTestimonials.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Service Case Feedbacks</h2>
            <p className="text-foreground/60 max-w-md mx-auto">
              Real review metrics from project managers who hired our {service.name} teams.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 justify-center">
            {filteredTestimonials.map((t) => (
              <GlassCard key={t.id} className="relative flex flex-col justify-between">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-accent/15" />
                <div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-foreground/80 italic text-base leading-relaxed mb-6 font-medium">
                    &quot;{t.feedback}&quot;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent">
                    {t.clientName[0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-foreground">{t.clientName}</h4>
                    <p className="text-[10px] text-foreground/50">{t.clientBusiness}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* 5. FAQ Section */}
      {faqs.length > 0 && (
        <section className="py-16 max-w-3xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight">Service Specific FAQs</h2>
            <p className="text-foreground/60">Find clear, rapid answers relating to {service.name}.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isActive = activeFaq === idx;
              return (
                <div
                  key={faq.id}
                  className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                    isActive ? "bg-accent/5 border-accent/25" : "border-glass-border hover:bg-white/5"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(isActive ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-base text-foreground focus:outline-none"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-accent transition-transform duration-300 ${isActive ? "rotate-180" : ""}`} />
                  </button>
                  {isActive && (
                    <div className="px-6 pb-6 text-foreground/70 text-sm leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 6. Related Services */}
      {relatedServices.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8">Other Services We Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedServices.map((r) => (
              <GlassCard key={r.id} className="flex flex-col justify-between hover:-translate-y-1 transition-all duration-300">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">{r.name}</h3>
                  <p className="text-foreground/70 text-xs leading-relaxed line-clamp-3">{r.description}</p>
                </div>
                <div className="pt-4 border-t border-glass-border mt-6 flex justify-between items-center text-xs">
                  <span className="font-semibold text-accent">{r.price}</span>
                  <Link href={`/services/${r.slug}`} className="font-bold hover:text-accent transition-colors flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>
      )}

      {/* 7. Sticky CTA Mobile panel */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-t border-glass-border p-4 flex items-center justify-between md:hidden shadow-lg">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Start Project</span>
          <span className="text-xs font-bold text-foreground truncate max-w-[150px]">{service.name}</span>
        </div>
        <button
          onClick={scrollToForm}
          className="bg-accent hover:bg-accent/90 text-white font-semibold text-xs px-5 py-2.5 rounded-full shadow-md shadow-accent/15 cursor-pointer"
        >
          Request Service
        </button>
      </div>

    </div>
  );
}
