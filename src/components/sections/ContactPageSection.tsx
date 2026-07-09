import { Mail, Phone, MapPin } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Service } from '@/app/types/service.types';
import dynamic from 'next/dynamic';

const ContactForm = dynamic(
  () => import('@/components/forms/ContactForm').then((mod) => mod.ContactForm),
  { ssr: true }
);

interface ContactPageSectionProps {
  services: Service[];
}

export function ContactPageSection({ services }: ContactPageSectionProps) {
  return (
    <section
      aria-labelledby="contact-heading"
      className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start w-full">
        {/* Left Column: Info Cards & Map */}
        <div className="lg:col-span-5 flex flex-col gap-8 w-full">
          <header className="flex flex-col gap-4">
            <h1
              id="contact-heading"
              className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground w-full"
            >
              Get in Touch
            </h1>
            <p className="text-foreground/75 leading-relaxed text-base sm:text-lg">
              Have questions about our custom services, API systems, or packages? Talk to our
              technology experts.
            </p>
          </header>

          {/* Cards */}
          <address className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 not-italic w-full">
            <div className="p-4 sm:p-5 rounded-[1.25rem] bg-foreground/[0.01] border border-glass-border flex gap-3 w-full group transition-colors hover:bg-foreground/[0.03]">
              <Mail
                className="w-5 h-5 text-accent shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                aria-hidden="true"
                role="presentation"
              />
              <div className="flex flex-col">
                <h2 className="font-bold text-sm">Email Our Tech Experts</h2>
                <a
                  href="mailto:info@apxteck.com"
                  className="text-xs sm:text-sm text-foreground/60 mt-1 hover:text-accent transition-colors min-h-[44px] flex items-center -ml-2 px-2 -my-2"
                  aria-label="Email APXTeck at info@apxteck.com"
                >
                  info@apxteck.com
                </a>
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-[1.25rem] bg-foreground/[0.01] border border-glass-border flex gap-3 w-full group transition-colors hover:bg-foreground/[0.03]">
              <Phone
                className="w-5 h-5 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                aria-hidden="true"
                role="presentation"
              />
              <div className="flex flex-col">
                <h2 className="font-bold text-sm">Call Our IT Office</h2>
                <a
                  href="tel:+919405282582"
                  className="text-xs sm:text-sm text-foreground/60 mt-1 hover:text-accent transition-colors min-h-[44px] flex items-center -ml-2 px-2 -my-2"
                  aria-label="Call APXTeck at +91 94052 82582"
                >
                  +91 94052 82582
                </a>
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-[1.25rem] bg-foreground/[0.01] border border-glass-border flex gap-3 sm:col-span-2 lg:col-span-1 w-full group transition-colors hover:bg-foreground/[0.03]">
              <MapPin
                className="w-5 h-5 text-pink-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform"
                aria-hidden="true"
                role="presentation"
              />
              <div className="flex flex-col">
                <h2 className="font-bold text-sm">Business Headquarters Address</h2>
                <p className="text-xs sm:text-sm text-foreground/60 mt-1 leading-relaxed">
                  FL NO-F2-1006 SR NO-296/4, REVELL ORCHID, Lohogaon, Pune City, Pune- 411047, Maharashtra
                </p>
              </div>
            </div>
          </address>

          {/* Map Embed */}
          <div className="w-full h-[250px] sm:h-[300px] lg:h-64 rounded-3xl overflow-hidden border border-glass-border shadow-inner">
            <iframe
              src="https://maps.google.com/maps?q=REVELL%20ORCHID,%20Lohogaon,%20Pune%20411047&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="APXTeck Office Location in Pune"
            />
          </div>
        </div>

        {/* Right Column: Form */}
        <div className="lg:col-span-7 w-full">
          <GlassCard className="p-6 sm:p-8 md:p-10 border border-glass-border w-full flex flex-col">
            <ContactForm services={services} />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
