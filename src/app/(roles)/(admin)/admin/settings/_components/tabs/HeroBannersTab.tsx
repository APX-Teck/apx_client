'use client';
import React, { useRef } from 'react';
import { PlusCircle, Image as ImageIcon, Edit, Trash2, XCircle, UploadCloud } from 'lucide-react';
import { useHeroBannersLogic } from '../../_hooks/useHeroBannersLogic';
import { HeroBanner } from '@/app/types/home.types';
import { ToastState } from '../SettingsManager';

interface Props {
  initialBanners: HeroBanner[];
  setToast: (toast: ToastState) => void;
}

export function HeroBannersTab({ initialBanners, setToast }: Props) {
  const {
    banners,
    isLoadingBanners,
    isBannerModalOpen,
    setIsBannerModalOpen,
    editingBanner,
    bannerForm,
    setBannerForm,
    setBannerFile,
    bannerFile,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleToggleActive,
  } = useHeroBannersLogic(initialBanners, setToast);

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Sliders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage the hero banners that appear on the homepage.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 min-h-[48px] rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <PlusCircle size={16} /> Create Banner
        </button>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-[#151515] min-h-[400px]">
        {isLoadingBanners ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No banners uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div
                key={banner.id}
                className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col shadow-sm group relative"
              >
                <button
                  onClick={() => handleToggleActive(banner.id)}
                  className="absolute top-4 right-4 z-10 p-1 min-w-[44px] min-h-[48px] rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md flex items-center justify-center"
                >
                  <div
                    className={`w-8 h-4 rounded-full p-0.5 transition-colors ${banner.isActive ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`}
                  >
                    <div
                      className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${banner.isActive ? 'translate-x-4' : 'translate-x-0'}`}
                    ></div>
                  </div>
                </button>
                <div className="h-48 bg-gray-100 dark:bg-[#222] relative">
                  {banner.mediaType === 'IMAGE' && banner.mediaUrl ? (
                    <img
                      src={banner.mediaUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : banner.mediaType === 'VIDEO' && banner.mediaUrl ? (
                    <video
                      src={banner.mediaUrl}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                    Order: {banner.sortOrder}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">
                    {banner.title || 'Untitled Banner'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                    {banner.subtitle || 'No subtitle provided.'}
                  </p>
                  <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button
                      onClick={() => openEditModal(banner)}
                      className="flex-1 bg-gray-50 hover:bg-indigo-50 dark:bg-white/5 text-gray-700 hover:text-indigo-600 dark:text-gray-300 px-4 py-2 min-h-[48px] rounded-xl font-bold text-xs transition-colors border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2"
                    >
                      <Edit size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="p-2 min-w-[44px] min-h-[48px] flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 rounded-xl transition-colors border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h2>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white min-w-[44px] min-h-[48px] flex items-center justify-center"
              >
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Title</label>
                  <input
                    type="text"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[48px] rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">CTA Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[48px] rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
                <textarea
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 min-h-[80px] text-sm outline-none dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">CTA Link</label>
                  <input
                    type="url"
                    value={bannerForm.ctaLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaLink: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[48px] rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase">Sort Order</label>
                  <input
                    type="number"
                    value={bannerForm.sortOrder}
                    onChange={(e) =>
                      setBannerForm({ ...bannerForm, sortOrder: parseInt(e.target.value) || 0 })
                    }
                    min={0}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[48px] rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">Media Type</label>
                <select
                  value={bannerForm.mediaType}
                  onChange={(e) =>
                    setBannerForm({ ...bannerForm, mediaType: e.target.value as 'IMAGE' | 'VIDEO' })
                  }
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 min-h-[48px] rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white appearance-none"
                >
                  <option value="IMAGE">Image</option>
                  <option value="VIDEO">Video</option>
                </select>
              </div>
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Upload Media File
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <UploadCloud size={32} className="mx-auto text-indigo-500 mb-2" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {bannerFile
                      ? bannerFile.name
                      : `Click to upload a new ${bannerForm.mediaType.toLowerCase()}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                  <input
                    type="file"
                    className="hidden"
                    ref={fileInputRef}
                    accept={bannerForm.mediaType === 'IMAGE' ? 'image/*' : 'video/*'}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setBannerFile(file);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={bannerForm.isActive}
                    onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                    className="peer sr-only"
                  />
                  <label
                    htmlFor="isActive"
                    className="w-11 h-6 min-h-[24px] bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 cursor-pointer flex items-center"
                  ></label>
                </div>
                <label
                  htmlFor="isActive"
                  className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer"
                >
                  Active
                </label>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
