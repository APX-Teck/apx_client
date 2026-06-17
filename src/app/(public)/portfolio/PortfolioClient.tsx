'use client';

import { MouseSpotlight } from '@/components/ui/MouseSpotlight';
import { FloatingWhatsApp } from '@/components/ui/FloatingWhatsApp';
import { PortfolioHero } from './components/PortfolioHero';
import { PortfolioPhilosophy } from './components/PortfolioPhilosophy';

export function PortfolioClient() {
  return (
    <>
      <MouseSpotlight />
      <FloatingWhatsApp phoneNumber="919405282582" />
      <PortfolioHero />
      <PortfolioPhilosophy />
    </>
  );
}
