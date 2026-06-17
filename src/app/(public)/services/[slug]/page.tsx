import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ServiceDetailClient } from '@/components/sections/ServiceDetailClient';
import { api } from '@/lib/axios';
import { Service, ServiceField } from '@/app/types/service.types';
import { Testimonial } from '@/app/types/testimonial.types';
import { Faq } from '@/app/types/faq.types';
import { getServiceJsonLd } from './constants';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const services = await api.fetchServices();
    return services.map((s) => ({ slug: s.slug }));
  } catch {
    return [
      { slug: 'web-development' },
      { slug: 'seo-optimization' },
      { slug: 'ui-ux-design' },
      { slug: 'digital-marketing' },
    ];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const services = await api.fetchServices();
    const service = services.find((s) => s.slug === slug);
    if (!service) return { title: 'Service Not Found' };

    return {
      title: `${service.name} — APXTECK`,
      description: service.description || `Premium ${service.name} solutions for Indian SMBs.`,
      openGraph: {
        title: `${service.name} — APXTECK`,
        description: service.description || `Premium ${service.name} solutions for Indian SMBs.`,
        url: `https://apxteck.com/services/${slug}`,
        siteName: 'APXTeck',
        type: 'website',
      },
      alternates: {
        canonical: `https://apxteck.com/services/${slug}`,
      },
    };
  } catch {
    return {
      title: 'Service Details — APXTeck',
    };
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;

  let services: Service[] = [];
  let testimonials: Testimonial[] = [];
  let faqs: Faq[] = [];

  try {
    services = await api.fetchServices();
    testimonials = await api.fetchTestimonials();
  } catch (err) {
    console.error('Failed to load server data', err);
  }

  const service = services.find((s) => s.slug === slug);
  if (!service) {
    notFound();
  }

  // Load category faqs
  try {
    faqs = await api.fetchFaqs(service.slug);
  } catch (err) {
    console.error('Failed to load FAQs', err);
  }

  // Filter dynamic fields
  let fields: ServiceField[] = [];
  try {
    fields = await api.fetchServiceFields(service.id);
  } catch {}

  const jsonLdService = getServiceJsonLd(service);

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30 bg-background text-foreground transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdService) }}
      />

      <Navbar />

      <main className="flex-1 pt-20">
        <ServiceDetailClient
          service={service}
          fields={fields}
          allServices={services}
          testimonials={testimonials}
          faqs={faqs}
        />
      </main>

      <Footer />
    </div>
  );
}
