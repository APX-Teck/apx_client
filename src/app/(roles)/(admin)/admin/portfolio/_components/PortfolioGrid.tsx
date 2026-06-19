import React from 'react';
import { Briefcase, Eye, Edit, Trash2 } from 'lucide-react';
import { Portfolio } from '@/services/admin/portfolio.service';

interface Props {
  filteredPortfolios: Portfolio[];
  isLoading: boolean;
  searchTerm: string;
  onTogglePublish: (id: number, currentStatus: boolean) => void;
  onNavigatePublic: (slug: string) => void;
  onNavigateEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function PortfolioGrid({
  filteredPortfolios,
  isLoading,
  searchTerm,
  onTogglePublish,
  onNavigatePublic,
  onNavigateEdit,
  onDelete,
}: Props) {
  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading portfolios...
          </p>
        </div>
      </div>
    );
  }

  if (filteredPortfolios.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
          <Briefcase className="text-gray-400 dark:text-gray-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          No portfolios found
        </h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
          We couldn't find any portfolios matching "{searchTerm}".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredPortfolios.map((portfolio) => (
        <div
          key={portfolio.id}
          className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col group overflow-hidden relative"
        >
          <div className="h-48 w-full bg-gray-100 dark:bg-gray-800 relative">
            {portfolio.coverImageUrl ? (
              <img
                src={portfolio.coverImageUrl}
                alt={portfolio.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Briefcase size={32} />
              </div>
            )}

            <button
              onClick={() => onTogglePublish(portfolio.id, portfolio.isPublished)}
              className="absolute top-4 right-4 z-10 p-1 min-w-[44px] min-h-[44px] rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
              title={`Toggle Status (Currently ${portfolio.isPublished ? 'Published' : 'Draft'})`}
            >
              <div
                className={`w-8 h-4 rounded-full p-0.5 transition-colors ${portfolio.isPublished ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
              >
                <div
                  className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${portfolio.isPublished ? 'translate-x-4' : 'translate-x-0'}`}
                ></div>
              </div>
            </button>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <span className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border border-white/10">
                {portfolio.serviceType}
              </span>
            </div>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight mb-1 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {portfolio.title}
            </h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
              Client:{' '}
              <span className="text-gray-900 dark:text-gray-200">{portfolio.clientName}</span>
            </p>

            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-2">
              <button
                onClick={() => onNavigatePublic(portfolio.slug)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:text-blue-400 dark:hover:bg-blue-500/10 rounded-xl transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-500/20"
                title="View Public Page"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => onNavigateEdit(portfolio.id)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20"
                title="Edit Portfolio"
              >
                <Edit size={18} />
              </button>
              <button
                onClick={() => onDelete(portfolio.id)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                title="Delete Portfolio"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
