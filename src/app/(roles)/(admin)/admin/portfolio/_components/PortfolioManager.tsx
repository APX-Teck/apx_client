'use client';

import React from 'react';
import { PortfolioHeader } from './PortfolioHeader';
import { PortfolioToolbar } from './PortfolioToolbar';
import { PortfolioGrid } from './PortfolioGrid';
import { Toast } from './Toast';
import { usePortfolioLogic } from '../_hooks/usePortfolioLogic';
import { Portfolio } from '@/services/admin/portfolio.service';

interface Props {
  initialPortfolios: Portfolio[];
}

export default function PortfolioManager({ initialPortfolios }: Props) {
  const logic = usePortfolioLogic(initialPortfolios);

  return (
    <>
      <PortfolioHeader onCreateClick={logic.navigateToCreate} />

      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden flex flex-col mt-6">
        <PortfolioToolbar searchTerm={logic.searchTerm} setSearchTerm={logic.setSearchTerm} />
        <div className="p-6 overflow-auto bg-transparent min-h-[400px]">
          <PortfolioGrid
            filteredPortfolios={logic.filteredPortfolios}
            isLoading={logic.isLoading}
            searchTerm={logic.searchTerm}
            onTogglePublish={logic.handleTogglePublish}
            onNavigatePublic={logic.navigateToPublic}
            onNavigateEdit={logic.navigateToEdit}
            onDelete={logic.handleDelete}
          />
        </div>
      </div>

      {logic.toast && (
        <Toast
          message={logic.toast.message}
          type={logic.toast.type}
          onClose={() => logic.setToast(null)}
        />
      )}
    </>
  );
}
