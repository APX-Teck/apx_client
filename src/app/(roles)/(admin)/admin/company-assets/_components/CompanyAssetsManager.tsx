'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Plus, Search, Box } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useCompanyAssetsLogic } from '../_hooks/useCompanyAssetsLogic';
import { useCompanyAssetFormLogic } from '../_hooks/useCompanyAssetFormLogic';
import { CompanyAsset } from '@/services/admin/companyAssets.service';
import { CompanyAssetCard } from './CompanyAssetCard';

const CompanyAssetFormModal = dynamic(() => import('./CompanyAssetFormModal'), { ssr: false });

export function CompanyAssetsManager({ initialAssets = [] }: { initialAssets?: CompanyAsset[] }) {
  const { assets, filteredAssets, isLoading, searchTerm, setSearchTerm, assetType, setAssetType, fetchAssets, handleDelete } =
    useCompanyAssetsLogic(initialAssets);
    
  const uniqueTypes = Array.from(new Set(assets.map(a => a.type))).filter(Boolean);

  const formLogic = useCompanyAssetFormLogic({
    onSuccess: () => {
      toast.success('Asset saved successfully');
      fetchAssets();
    },
  });

  const onDelete = async (id: number) => {
    try {
      await handleDelete(id);
      toast.success('Asset deleted successfully');
    } catch {
      toast.error('Failed to delete asset');
    }
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto pb-safe pb-10 px-4 sm:px-6 md:px-8">
      <Toaster position="bottom-right" />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Company Assets</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage physical and digital company resources
          </p>
        </div>
        <button
          onClick={formLogic.openCreateModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 w-full md:w-auto"
        >
          <Plus size={20} />
          <span>Add Asset</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        {/* Search & Filter */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search assets by title, provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 min-h-[44px] bg-gray-50 dark:bg-[#1A1A1A] border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-gray-500"
            />
          </div>
          
          <div className="sm:w-48 shrink-0">
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value)}
              className="w-full px-4 py-3 min-h-[44px] bg-gray-50 dark:bg-[#1A1A1A] border-none rounded-2xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all cursor-pointer appearance-none font-medium"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2em' }}
            >
              <option value="ALL">All Types</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredAssets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <Box size={48} className="mb-4 opacity-20" />
              <p>No assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAssets.map((asset: CompanyAsset) => (
                <CompanyAssetCard
                  key={asset.id}
                  asset={asset}
                  onEdit={(asset) => formLogic.openEditModal(asset)}
                  onDelete={onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {formLogic.isModalOpen && (
        <CompanyAssetFormModal onClose={formLogic.closeModal} formLogic={formLogic} />
      )}
    </div>
  );
}
