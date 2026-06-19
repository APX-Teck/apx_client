import React from 'react';
import { portfolioService } from '@/services/admin/portfolio.service';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import PortfolioForm from '../../_components/PortfolioForm';

export default async function EditPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (isNaN(id)) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Layers size={48} className="text-gray-500" />
        <h2 className="text-xl font-bold text-white">Invalid Portfolio ID</h2>
        <Link href="/admin/portfolio" className="text-indigo-400 hover:text-indigo-300">
          Return to Portfolio Management
        </Link>
      </div>
    );
  }

  let portfolio = null;
  try {
    portfolio = await portfolioService.getPortfolioByIdAdmin(id);
  } catch (error) {
    console.error('Failed to load portfolio on SSR, deferring to client:', error);
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 pb-safe px-4 sm:px-6 md:px-8">
      <PortfolioForm mode="edit" initialData={portfolio} portfolioId={id} />
    </div>
  );
}
