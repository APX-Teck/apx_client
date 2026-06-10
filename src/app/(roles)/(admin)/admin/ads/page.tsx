"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  MonitorPlay, PlusCircle, Edit, Trash2, CheckCircle2, 
  XCircle, Search, AlertCircle, Image as ImageIcon, 
  Link as LinkIcon, Code, Calendar, Globe
} from "lucide-react";
import { adsService } from "@/services/admin/ads.service";
import { Ad } from "@/app/types/ad.types";

/* ─── tiny inline toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" 
    ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" 
    : type === "error" 
    ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" 
    : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-[9999] px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function AdsManagementPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);

  // Form State
  const [adType, setAdType] = useState<"GOOGLE" | "CLIENT">("CLIENT");
  const [targetPage, setTargetPage] = useState<"LIST" | "POST">("POST");
  const [placement, setPlacement] = useState<string>("BLOG_POST_TOP");
  const [clientName, setClientName] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [adCode, setAdCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAds = async () => {
    try {
      setIsLoading(true);
      const data = await adsService.getAds({ limit: 100 });
      setAds(data.data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch ads", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this ad? This action cannot be undone.")) {
      try {
        setToast({ message: "Deleting ad...", type: "loading" });
        await adsService.deleteAd(id);
        setToast({ message: "Ad deleted successfully", type: "success" });
        fetchAds();
      } catch (error) {
        setToast({ message: "Failed to delete ad", type: "error" });
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await adsService.toggleAdActive(id);
      setToast({ message: `Ad is now ${!currentStatus ? 'Active' : 'Inactive'}`, type: "success" });
      fetchAds();
    } catch (error) {
      setToast({ message: "Failed to update ad status", type: "error" });
    }
  };

  const openCreateModal = () => {
    setEditingAd(null);
    setAdType("CLIENT");
    setTargetPage("POST");
    setPlacement("BLOG_POST_TOP");
    setClientName("");
    setTargetUrl("");
    setAdCode("");
    setIsActive(true);
    setBannerFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ad: Ad) => {
    setEditingAd(ad);
    setAdType(ad.adType);
    setTargetPage(ad.placement.startsWith("BLOG_LIST") ? "LIST" : "POST");
    setPlacement(ad.placement);
    setClientName(ad.clientName || "");
    setTargetUrl(ad.targetUrl || "");
    setAdCode(ad.adCode || "");
    setIsActive(ad.isActive);
    setBannerFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setToast({ message: editingAd ? "Updating ad..." : "Creating ad...", type: "loading" });
      const formData = new FormData();
      formData.append("adType", adType);
      formData.append("placement", placement);
      formData.append("isActive", String(isActive));

      if (adType === "CLIENT") {
        if (clientName) formData.append("clientName", clientName);
        if (targetUrl) {
          // Ensure it's a valid URL for backend zod validation
          const formattedUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
          formData.append("targetUrl", formattedUrl);
        }
        if (bannerFile) {
          formData.append("bannerImage", bannerFile);
        }
      } else {
        if (adCode) formData.append("adCode", adCode);
      }

      if (editingAd) {
        await adsService.updateAd(editingAd.id, formData);
        setToast({ message: "Ad updated successfully", type: "success" });
      } else {
        await adsService.createAd(formData);
        setToast({ message: "Ad created successfully", type: "success" });
      }
      setIsModalOpen(false);
      fetchAds();
    } catch (error) {
      setToast({ message: "Failed to save ad", type: "error" });
    }
  };

  const filteredAds = ads.filter(ad => 
    (ad.clientName && ad.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    ad.placement.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ad.adType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-pink-50 dark:bg-pink-500/10 rounded-xl text-pink-600 dark:text-pink-400">
              <MonitorPlay size={24} />
            </div>
            Advertisements
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage banner ads, Google AdSense codes, and placements across the platform.
          </p>
        </div>
        <button 
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-md flex items-center gap-2 shrink-0"
        >
          <PlusCircle size={18} />
          Create Ad
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search ads by client, placement, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 dark:focus:border-pink-400 transition-all"
            />
          </div>
        </div>

        {/* Ads Grid */}
        <div className="p-6 overflow-auto bg-gray-50 dark:bg-[#151515] min-h-[400px]">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-pink-100 dark:border-pink-500/20 border-t-pink-600 dark:border-t-pink-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading ads...</p>
              </div>
            </div>
          ) : filteredAds.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-white dark:bg-[#222] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <MonitorPlay className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No ads found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any advertisements matching your criteria. Create a new one to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAds.map((ad) => (
                <div key={ad.id} className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
                  
                  {/* Status Toggle on Top Right */}
                  <button 
                    onClick={() => handleToggleActive(ad.id, ad.isActive)}
                    className="absolute top-4 right-4 z-10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white dark:bg-[#151515] flex items-center justify-center"
                    title={`Toggle Status (Currently ${ad.isActive ? 'Active' : 'Inactive'})`}
                  >
                    <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${ad.isActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-700'}`}>
                      <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${ad.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                  </button>

                  {/* Ad Banner Preview */}
                  <div className="h-40 w-full bg-gray-100 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/5 relative flex items-center justify-center overflow-hidden group-hover:opacity-95 transition-opacity">
                    {ad.adType === 'CLIENT' && ad.bannerUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={ad.bannerUrl} alt={ad.clientName || 'Ad'} className="w-full h-full object-cover" />
                    ) : ad.adType === 'GOOGLE' ? (
                      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                        <Code size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">Google AdSense</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500">
                        <ImageIcon size={32} />
                        <span className="text-xs font-bold uppercase tracking-widest">No Banner</span>
                      </div>
                    )}
                    
                    {/* Badge */}
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-md border border-white/10 text-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                      {ad.adType === 'CLIENT' ? <Globe size={12} className="text-pink-500"/> : <Code size={12} className="text-indigo-500" />}
                      {ad.adType}
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight mb-1">
                      {ad.clientName || 'Google AdSense Campaign'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4 font-mono">
                      <span className="bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded">
                        {ad.placement}
                      </span>
                    </div>

                    {ad.targetUrl && (
                      <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 font-medium mb-4 hover:underline break-all">
                        <LinkIcon size={14} className="shrink-0" />
                        <span className="line-clamp-1">{ad.targetUrl}</span>
                      </a>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                      <button 
                        onClick={() => openEditModal(ad)}
                        className="flex-1 bg-gray-50 hover:bg-indigo-50 dark:bg-white/5 dark:hover:bg-indigo-500/10 text-gray-700 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-gray-200 dark:border-white/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 flex items-center justify-center gap-2"
                      >
                        <Edit size={14} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-gray-200 dark:border-white/10 hover:border-red-200 dark:hover:border-red-500/30 bg-gray-50 dark:bg-white/5"
                        title="Delete Ad"
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
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                {editingAd ? <Edit className="text-pink-500" size={20} /> : <PlusCircle className="text-pink-500" size={20} />}
                {editingAd ? 'Edit Advertisement' : 'Create Advertisement'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors bg-white dark:bg-[#222] p-1.5 rounded-full border border-gray-200 dark:border-white/10">
                <XCircle size={20} />
              </button>
            </div>

            <form id="ad-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ad Type</label>
                  <select 
                    value={adType} 
                    onChange={(e) => setAdType(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="CLIENT">Client Banner</option>
                    <option value="GOOGLE">Google AdSense</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target Page</label>
                  <select 
                    value={targetPage} 
                    onChange={(e) => {
                      const newPage = e.target.value as "LIST" | "POST";
                      setTargetPage(newPage);
                      setPlacement(newPage === "LIST" ? "BLOG_LIST_TOP" : "BLOG_POST_TOP");
                    }}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  >
                    <option value="LIST">Blog List Page</option>
                    <option value="POST">Blog Post Details</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Placement Slot</label>
                  <select 
                    value={placement} 
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                  >
                    {targetPage === "LIST" ? (
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
                </div>
              </div>

              {adType === 'CLIENT' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Name *</label>
                    <input 
                      type="text" 
                      required
                      value={clientName} 
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="e.g. APXTeck Hosting"
                      className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Target URL *</label>
                    <input 
                      type="url" 
                      required
                      value={targetUrl} 
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="https://client-website.com/promo"
                      className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Banner Image {editingAd ? '(Optional to change)' : '*'}</label>
                    
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
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Google AdSense HTML Code *</label>
                  <textarea 
                    required
                    value={adCode} 
                    onChange={(e) => setAdCode(e.target.value)}
                    placeholder="<script async src='...'></script><ins class='adsbygoogle' ...></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>"
                    className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 outline-none transition-all min-h-[200px]"
                  />
                  <p className="text-xs text-gray-500 font-medium">Paste the entire embed code block from Google AdSense.</p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="peer sr-only"
                  />
                  <label 
                    htmlFor="isActive"
                    className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 cursor-pointer shadow-inner"
                  ></label>
                </div>
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                  Publish Immediately
                </label>
              </div>

            </form>

            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#151515]/50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="ad-form"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={16} />
                {editingAd ? 'Save Changes' : 'Create Ad'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
