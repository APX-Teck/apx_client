'use client';

import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { ServicesHero } from './components/ServicesHero';
import { ServicesAdvantage } from './components/ServicesAdvantage';

export function ServicesClient() {
  return (
    <>
      <MouseSpotlight />
      <FloatingWhatsApp phoneNumber="919405282582" />

      {/* Hero Section */}
      <ServicesHero />

      {/* Why Choose Our Services (The APXTeck Advantage) */}
      <ServicesAdvantage />
    </>
  );
}
