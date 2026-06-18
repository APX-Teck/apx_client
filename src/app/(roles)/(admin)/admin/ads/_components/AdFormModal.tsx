import React, { useRef } from 'react';
import { Edit, PlusCircle, XCircle, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { useAdFormLogic } from '../_hooks/useAdFormLogic';

interface AdFormModalProps {
  onClose: () => void;
  formLogic: ReturnType<typeof useAdFormLogic>;
}

export default function AdFormModal({ onClose, formLogic }: AdFormModalProps) {
  const {
    form,
    editingAd,
    bannerFile,
    setBannerFile,
    targetPage,
    setTargetPage,
    onSubmit,
    adType,
  } = formLogic;

  const {
    register,
    watch,
    formState: { errors },
  } = form;
  const placement = watch('placement');
  const isActive = watch('isActive');

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
            {editingAd ? (
              <Edit className="text-pink-500" size={20} />
            ) : (
              <PlusCircle className="text-pink-500" size={20} />
            )}
            {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-white dark:bg-[#222] min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full border border-gray-200 dark:border-white/10"
          >
            <XCircle size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ad Type
                </label>
                <select
                  {...register('adType')}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                >
                  <option value="CLIENT">Client Banner</option>
                  <option value="GOOGLE">Google AdSense</option>
                </select>
                {errors.adType && (
                  <p className="text-xs text-red-500">{errors.adType.message as string}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Target Page
                </label>
                <select
                  value={targetPage}
                  onChange={(e) => setTargetPage(e.target.value as 'LIST' | 'POST')}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                >
                  <option value="LIST">Blog List Page</option>
                  <option value="POST">Blog Post Details</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Placement Slot
                </label>
                <select
                  {...register('placement')}
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                >
                  {targetPage === 'LIST' ? (
                    <>
                      <option value="BLOG_LIST_TOP">List Top Banner</option>
                      <option value="BLOG_LIST_MID">List Middle Feed</option>
                    </>
                  ) : (
                    <>
                      <option value="BLOG_POST_TOP">Post Top Banner</option>
                      <option value="BLOG_POST_MID">Post Middle Content</option>
                      <option value="BLOG_POST_BOTTOM">Post Bottom</option>
                      <option value="BLOG_POST_SIDEBAR">Right Sidebar</option>
                    </>
                  )}
                </select>
                {errors.placement && (
                  <p className="text-xs text-red-500">{errors.placement.message as string}</p>
                )}
              </div>
            </div>

            {adType === 'CLIENT' ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    {...register('clientName')}
                    placeholder="e.g. APXTeck Hosting"
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  />
                  {(errors as any).clientName && (
                    <p className="text-xs text-red-500">
                      {(errors as any).clientName.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Target URL *
                  </label>
                  <input
                    type="url"
                    {...register('targetUrl')}
                    placeholder="https://client-website.com/promo"
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  />
                  {(errors as any).targetUrl && (
                    <p className="text-xs text-red-500">
                      {(errors as any).targetUrl.message as string}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Banner Image {editingAd ? '(Optional to change)' : '*'}
                  </label>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full border-2 border-dashed ${bannerFile ? 'border-pink-500 bg-pink-50 dark:bg-pink-500/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'} rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) setBannerFile(e.target.files[0]);
                      }}
                    />
                    <div className="w-12 h-12 bg-white dark:bg-[#222] border border-gray-100 dark:border-white/5 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                      <ImageIcon size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {bannerFile ? bannerFile.name : 'Click to upload banner image'}
                    </p>
                    <p className="text-xs font-medium text-gray-500 mt-1">
                      {placement === 'BLOG_POST_SIDEBAR'
                        ? 'Recommended format: Vertical banner (e.g., 300x600 px)'
                        : 'Recommended format: Horizontal banner (16:9 or 21:9 aspect ratio)'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Google AdSense HTML Code *
                </label>
                <textarea
                  {...register('adCode')}
                  placeholder="<script async src='...'></script><ins class='adsbygoogle' ...></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[200px] text-sm font-mono focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                />
                {(errors as any).adCode && (
                  <p className="text-xs text-red-500">{(errors as any).adCode.message as string}</p>
                )}
                <p className="text-xs text-gray-500 font-medium">
                  Paste the entire embed code block from Google AdSense.
                </p>
              </div>
            )}

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group w-fit">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="sr-only"
                  />
                  <div
                    className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center ${
                      isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <div
                      className={`bg-white h-5 w-5 rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${
                        isActive ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 select-none">
                  Publish Immediately
                </span>
              </label>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50 flex items-center justify-end gap-3 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex items-center justify-center flex-1 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-sm bg-pink-600 hover:bg-pink-700 text-white shadow-md transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-none"
            >
              <CheckCircle2 size={16} />
              {editingAd ? 'Save Changes' : 'Create Ad'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
