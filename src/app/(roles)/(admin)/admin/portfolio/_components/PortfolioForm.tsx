'use client';

import React from 'react';
import { Save, X, Briefcase, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { usePortfolioFormLogic } from '../_hooks/usePortfolioFormLogic';

export default function PortfolioForm({
  initialData,
  mode = 'create',
}: {
  initialData?: any;
  mode?: 'create' | 'edit';
}) {
  const logic = usePortfolioFormLogic(initialData, mode);

  return (
    <form onSubmit={logic.handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Briefcase className="text-[#39FF14]" size={28} />
          {mode === 'create' ? 'Create New Portfolio' : 'Edit Portfolio'}
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={logic.handleCancel}
            className="px-5 py-2.5 min-h-[44px] rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} /> Cancel
          </button>
          <button
            type="submit"
            disabled={logic.isSubmitting}
            className="bg-[#39FF14] text-black px-6 py-2.5 min-h-[44px] rounded-xl font-bold hover:bg-[#32e012] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Save size={18} /> {logic.isSubmitting ? 'Saving...' : 'Save Portfolio'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-6">
            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Project Title <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={logic.formData.title}
                onChange={logic.handleChange}
                className={`w-full bg-white dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[48px] text-[15px] font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all ${
                  logic.formErrors?.title 
                    ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                    : 'border-gray-200 dark:border-white/10 focus:border-[#39FF14] focus:ring-[#39FF14]/20'
                }`}
                placeholder="e.g. Next.js E-commerce Redesign"
              />
              {logic.formErrors?.title && <p className="mt-2 text-sm font-bold text-red-500">{logic.formErrors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Client Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="clientName"
                  value={logic.formData.clientName}
                  onChange={logic.handleChange}
                  className={`w-full bg-white dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[48px] text-[15px] font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all ${
                    logic.formErrors?.clientName 
                      ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-white/10 focus:border-[#39FF14] focus:ring-[#39FF14]/20'
                  }`}
                />
                {logic.formErrors?.clientName && <p className="mt-2 text-sm font-bold text-red-500">{logic.formErrors.clientName}</p>}
              </div>
              <div>
                <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Service Type <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="serviceType"
                  value={logic.formData.serviceType}
                  onChange={logic.handleChange}
                  className={`w-full bg-white dark:bg-[#151515] border rounded-xl px-4 py-3 min-h-[48px] text-[15px] font-bold text-gray-900 dark:text-white focus:outline-none focus:ring-4 transition-all ${
                    logic.formErrors?.serviceType 
                      ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-gray-200 dark:border-white/10 focus:border-[#39FF14] focus:ring-[#39FF14]/20'
                  }`}
                  placeholder="e.g. Web Development"
                />
                {logic.formErrors?.serviceType && <p className="mt-2 text-sm font-bold text-red-500">{logic.formErrors.serviceType}</p>}
              </div>
            </div>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">
                Problem Statement
              </label>
              <textarea
                name="problem"
                value={logic.formData.problem}
                onChange={logic.handleChange}
                rows={3}
                className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
              />
            </div>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Solution</label>
              <textarea
                name="solution"
                value={logic.formData.solution}
                onChange={logic.handleChange}
                rows={3}
                className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
              />
            </div>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Results / Impact</label>
              <textarea
                name="results"
                value={logic.formData.results}
                onChange={logic.handleChange}
                rows={3}
                className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-6">
            <label className="flex items-center gap-3 min-h-[44px] cursor-pointer">
              <div
                className={`w-12 h-6 rounded-full p-1 transition-colors ${logic.formData.isPublished ? 'bg-[#39FF14]' : 'bg-gray-700'}`}
              >
                <div
                  className={`w-4 h-4 bg-black rounded-full transition-transform ${logic.formData.isPublished ? 'translate-x-6' : ''}`}
                />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Publish Portfolio</span>
              <input
                type="checkbox"
                name="isPublished"
                checked={logic.formData.isPublished}
                onChange={logic.handleChange}
                className="hidden"
              />
            </label>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={logic.formData.sortOrder}
                onChange={logic.handleChange}
                className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-[15px] font-bold text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
              />
            </div>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Live URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" size={18} />
                <input
                  type="url"
                  name="liveUrl"
                  value={logic.formData.liveUrl}
                  onChange={logic.handleChange}
                  className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl pl-10 pr-4 py-3 min-h-[48px] text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
                  placeholder="https://"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Completion Date</label>
              <input
                type="date"
                name="completedAt"
                value={logic.formData.completedAt}
                onChange={logic.handleChange}
                className="w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[48px] text-[15px] text-gray-900 dark:text-white focus:outline-none focus:border-[#39FF14] focus:ring-4 focus:ring-[#39FF14]/20 transition-all"
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] space-y-6">
            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => logic.setCoverImage(e.target.files?.[0] || null)}
                className="w-full min-h-[48px] text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 dark:file:bg-white/10 file:text-gray-900 dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-white/20 transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Client Logo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => logic.setClientLogo(e.target.files?.[0] || null)}
                className="w-full min-h-[48px] text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 dark:file:bg-white/10 file:text-gray-900 dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-white/20 transition-all cursor-pointer"
              />
            </div>
            <div>
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-2">Gallery Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => logic.setGalleryImages(Array.from(e.target.files || []))}
                className="w-full min-h-[48px] text-sm text-gray-600 dark:text-gray-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:bg-gray-100 dark:file:bg-white/10 file:text-gray-900 dark:file:text-white hover:file:bg-gray-200 dark:hover:file:bg-white/20 transition-all cursor-pointer"
              />
              <p className="text-xs text-gray-500 mt-3 font-medium">
                Selecting new images will replace existing ones (unless galleryMode is changed in
                backend call)
              </p>
            </div>
          </div>
        </div>
      </div>

      {logic.toast && (
        <div
          className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 ${logic.toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : logic.toast.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}
        >
          {logic.toast.type === 'success' && <CheckCircle2 size={18} />}
          {logic.toast.type === 'error' && <AlertCircle size={18} />}
          {logic.toast.type === 'loading' && (
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          )}
          <span className="font-bold">{logic.toast.message}</span>
        </div>
      )}
    </form>
  );
}
