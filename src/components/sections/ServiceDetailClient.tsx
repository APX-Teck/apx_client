'use client';

import { useRef } from 'react';
import { Service, ServiceField } from '@/app/types/service.types';
import { Testimonial } from '@/app/types/testimonial.types';
import { Faq } from '@/app/types/faq.types';

import { ServiceDetailHero } from '@/app/(public)/services/[slug]/components/ServiceDetailHero';
import { ServiceDetailProcess } from '@/app/(public)/services/[slug]/components/ServiceDetailProcess';
import { ServiceDetailForm } from '@/app/(public)/services/[slug]/components/ServiceDetailForm';
import { ServiceDetailTestimonials } from '@/app/(public)/services/[slug]/components/ServiceDetailTestimonials';
import { ServiceDetailFaq } from '@/app/(public)/services/[slug]/components/ServiceDetailFaq';
import { ServiceDetailRelated } from '@/app/(public)/services/[slug]/components/ServiceDetailRelated';
import { ServiceDetailStickyCTA } from '@/app/(public)/services/[slug]/components/ServiceDetailStickyCTA';

interface ServiceDetailClientProps {
  service: Service;
  fields: ServiceField[];
  allServices: Service[];
  testimonials: Testimonial[];
  faqs: Faq[];
}

export function ServiceDetailClient({
  service,
  fields,
  allServices,
  testimonials,
  faqs,
}: ServiceDetailClientProps) {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-24">
      {/* 1. Hero */}
      <ServiceDetailHero service={service} scrollToForm={scrollToForm} />

      {/* 2. What's Included & Process */}
      <ServiceDetailProcess slug={service.slug} />

      {/* 3. Dynamic Service Request Form */}
      <ServiceDetailForm 
        serviceId={service.id} 
        serviceSlug={service.slug} 
        fields={fields} 
        formRef={formRef} 
      />

      {/* 4. Testimonials Filter */}
      <ServiceDetailTestimonials serviceName={service.name} testimonials={testimonials} />

      {/* 5. FAQ Section */}
      <ServiceDetailFaq serviceName={service.name} faqs={faqs} />

      {/* 6. Related Services */}
      <ServiceDetailRelated currentServiceSlug={service.slug} allServices={allServices} />

      {/* 7. Sticky CTA Mobile panel */}
      <ServiceDetailStickyCTA serviceName={service.name} scrollToForm={scrollToForm} />
    </div>
  );
}
