'use client';

import { Portfolio } from '@/app/types/portfolio.types';
import { PortfolioDetailHeader } from './components/PortfolioDetailHeader';
import { PortfolioDetailContent } from './components/PortfolioDetailContent';
import { PortfolioDetailResults } from './components/PortfolioDetailResults';
import { PortfolioDetailGallery } from './components/PortfolioDetailGallery';

import { useState, useEffect } from 'react';
import { api } from '@/lib/axios';

interface Props {
  project: Portfolio | null;
  slug: string;
}

export function PortfolioDetailClient({ project: initialProject, slug }: Props) {
  const [project, setProject] = useState<Portfolio | null>(initialProject);
  const [isLoading, setIsLoading] = useState(!initialProject);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!project && slug) {
      setIsLoading(true);
      api
        .fetchPortfolioBySlug(slug)
        .then((data) => {
          if (data) {
            setProject(data);
          } else {
            setIsError(true);
          }
        })
        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  }, [project, slug]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center w-full">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#39FF14] animate-spin"></div>
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center w-full text-center px-4">
        <h1 className="text-3xl font-black text-white mb-2">Project Not Found</h1>
        <p className="text-gray-400">The portfolio project you're looking for doesn't exist or failed to load.</p>
      </div>
    );
  }
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12 w-full overflow-x-hidden">
      <PortfolioDetailHeader project={project} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start w-full">
        <PortfolioDetailContent project={project} />
        <PortfolioDetailResults project={project} />
      </div>

      <PortfolioDetailGallery project={project} />
    </section>
  );
}
