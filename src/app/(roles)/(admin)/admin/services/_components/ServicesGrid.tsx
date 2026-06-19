import React from 'react';
import { Layers, IndianRupee, Edit, Trash2 } from 'lucide-react';
import { Service } from '@/services/admin/services.service';

interface Props {
  filteredServices: Service[];
  isLoading: boolean;
  searchTerm: string;
  handleToggleActive: (id: number, currentStatus: boolean) => void;
  navigateToManageFields: (id: number) => void;
  navigateToEdit: (id: number) => void;
  handleDelete: (id: number) => void;
}

export function ServicesGrid({
  filteredServices,
  isLoading,
  searchTerm,
  handleToggleActive,
  navigateToManageFields,
  navigateToEdit,
  handleDelete,
}: Props) {
  if (isLoading && filteredServices.length === 0) {
    return (
      <div className="h-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
        <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
          <Layers className="text-gray-400 dark:text-gray-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
          We couldn't find any services matching "{searchTerm}".
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredServices.map((service) => (
        <div
          key={service.id}
          className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-all flex flex-col group relative"
        >
          <button
            onClick={() => handleToggleActive(service.id, service.isActive)}
            className="absolute top-5 right-5 z-10 p-1 min-w-[44px] min-h-[44px] rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
            title={`Toggle Status (Currently ${service.isActive ? 'Active' : 'Inactive'})`}
          >
            <div
              className={`w-8 h-4 rounded-full p-0.5 transition-colors ${service.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${service.isActive ? 'translate-x-4' : 'translate-x-0'}`}
              ></div>
            </div>
          </button>

          <div className="flex gap-4 items-start mb-4 pr-12">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {service.name}
              </h3>
              <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-0.5 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded inline-block">
                /{service.slug}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium line-clamp-2 mb-6">
            {service.description || 'No description provided.'}
          </p>

          <div className="mt-auto grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                Pricing
              </p>
              <p className="font-black text-gray-900 dark:text-white flex items-center text-sm">
                {service.price ? (
                  <>
                    <IndianRupee size={12} className="mr-0.5" />
                    {Number(service.price).toFixed(2)}
                  </>
                ) : (
                  'Custom'
                )}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5">
              <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
                Timeline
              </p>
              <p className="font-bold text-gray-900 dark:text-white text-sm">
                {service.timeline || 'TBD'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
            <button
              onClick={() => navigateToManageFields(service.id)}
              className="flex-1 min-h-[44px] flex items-center justify-center bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs transition-colors text-gray-700 dark:text-gray-300"
            >
              Manage Fields
            </button>
            <button
              onClick={() => navigateToEdit(service.id)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:text-indigo-400 dark:hover:bg-indigo-500/10 rounded-xl transition-colors border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/20"
              title="Edit Service"
            >
              <Edit size={18} />
            </button>
            <button
              onClick={() => handleDelete(service.id)}
              className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
              title="Delete Service"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
