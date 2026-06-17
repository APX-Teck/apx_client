'use client';

import { Portfolio } from '@/app/types/portfolio.types';
import { PortfolioDetailHeader } from './components/PortfolioDetailHeader';
import { PortfolioDetailContent } from './components/PortfolioDetailContent';
import { PortfolioDetailResults } from './components/PortfolioDetailResults';
import { PortfolioDetailGallery } from './components/PortfolioDetailGallery';

interface Props {
  project: Portfolio;
}

export function PortfolioDetailClient({ project }: Props) {
  return (
    <section className="max-w-5xl mx-auto px-6 space-y-12">
      <PortfolioDetailHeader project={project} />

      <div className="grid md:grid-cols-12 gap-8 items-start">
        <PortfolioDetailContent project={project} />
        <PortfolioDetailResults project={project} />
      </div>

      <PortfolioDetailGallery project={project} />
    </section>
  );
}
