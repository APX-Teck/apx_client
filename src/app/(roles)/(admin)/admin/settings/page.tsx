"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Settings, Image as ImageIcon, CheckCircle2, XCircle, 
  PlusCircle, Edit, Trash2, Palette, Monitor, 
  MonitorSmartphone, HardDrive, Cpu, Activity, UploadCloud,
  Database, Code2, Download, Upload, Trash, Wifi, Globe, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { heroBannersService } from "@/services/admin/heroBanners.service";
import { HeroBanner } from "@/app/types/home.types";
import { AlertCircle } from "lucide-react";

// --- Toast Component ---
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

// -------------------------------------------------------------
// 1. HERO BANNERS TAB
// -------------------------------------------------------------
function HeroBannersTab({ setToast }: { setToast: any }) {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const [mediaType, setMediaType] = useState<"IMAGE" | "VIDEO">("IMAGE");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [ctaLink, setCtaLink] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      const res = await heroBannersService.getBanners();
      setBanners(res.data || []);
    } catch (error) {
      setToast({ message: "Failed to load banners", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, []);

  const openCreateModal = () => {
    setEditingBanner(null); setMediaType("IMAGE"); setTitle(""); setSubtitle("");
    setCtaText(""); setCtaLink(""); setSortOrder(banners.length > 0 ? Math.max(...banners.map(b => b.sortOrder)) + 1 : 0);
    setIsActive(true); setMediaFile(null); setIsModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner); setMediaType(banner.mediaType || "IMAGE"); setTitle(banner.title || "");
    setSubtitle(banner.subtitle || ""); setCtaText(banner.ctaText || ""); setCtaLink(banner.ctaLink || "");
    setSortOrder(banner.sortOrder || 0); setIsActive(banner.isActive); setMediaFile(null); setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setToast({ message: editingBanner ? "Updating banner..." : "Creating banner...", type: "loading" });
      const formData = new FormData();
      formData.append("mediaType", mediaType);
      if (title) formData.append("title", title);
      if (subtitle) formData.append("subtitle", subtitle);
      if (ctaText) formData.append("ctaText", ctaText);
      if (ctaLink) formData.append("ctaLink", ctaLink);
      formData.append("sortOrder", sortOrder.toString());
      formData.append("isActive", isActive.toString());
      if (mediaFile) formData.append("media", mediaFile);

      if (editingBanner) await heroBannersService.updateBanner(editingBanner.id, formData);
      else await heroBannersService.createBanner(formData);
      
      setToast({ message: "Banner saved successfully", type: "success" });
      setIsModalOpen(false); fetchBanners();
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || "Operation failed", type: "error" });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Delete this banner permanently?")) {
      try {
        setToast({ message: "Deleting...", type: "loading" });
        await heroBannersService.deleteBanner(id);
        setToast({ message: "Banner deleted", type: "success" });
        fetchBanners();
      } catch (error) { setToast({ message: "Failed to delete", type: "error" }); }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await heroBannersService.toggleBannerActive(id);
      setToast({ message: "Status updated", type: "success" });
      fetchBanners();
    } catch (error) { setToast({ message: "Failed to update status", type: "error" }); }
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Homepage Sliders</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage the hero banners that appear on the homepage.</p>
        </div>
        <button onClick={openCreateModal} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md transition-colors flex items-center gap-2">
          <PlusCircle size={16} /> Create Banner
        </button>
      </div>

      <div className="p-6 bg-gray-50 dark:bg-[#151515] min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
        ) : banners.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No banners uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white dark:bg-[#111] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col shadow-sm group relative">
                <button onClick={() => handleToggleActive(banner.id)} className="absolute top-4 right-4 z-10 p-1 rounded-full border border-gray-200 dark:border-white/10 shadow-sm bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md flex items-center justify-center">
                  <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${banner.isActive ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${banner.isActive ? 'translate-x-4' : 'translate-x-0'}`}></div>
                  </div>
                </button>
                <div className="h-48 bg-gray-100 dark:bg-[#222] relative">
                  {banner.mediaType === "IMAGE" && banner.mediaUrl ? (
                    <img src={banner.mediaUrl} alt="Banner" className="w-full h-full object-cover" />
                  ) : banner.mediaType === "VIDEO" && banner.mediaUrl ? (
                    <video src={banner.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={32} /></div>
                  )}
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider">
                    Order: {banner.sortOrder}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 truncate">{banner.title || "Untitled Banner"}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{banner.subtitle || "No subtitle provided."}</p>
                  <div className="mt-auto flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
                    <button onClick={() => openEditModal(banner)} className="flex-1 bg-gray-50 hover:bg-indigo-50 dark:bg-white/5 text-gray-700 hover:text-indigo-600 dark:text-gray-300 px-4 py-2 rounded-xl font-bold text-xs transition-colors border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDelete(banner.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 rounded-xl transition-colors border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-xl font-black text-gray-900 dark:text-white">{editingBanner ? 'Edit Banner' : 'Create Banner'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white"><XCircle size={24} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white" /></div>
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">CTA Text</label><input type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label><textarea value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white min-h-[80px]" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">CTA Link</label><input type="url" value={ctaLink} onChange={e => setCtaLink(e.target.value)} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white" /></div>
                <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Sort Order</label><input type="number" value={sortOrder} onChange={e => setSortOrder(parseInt(e.target.value) || 0)} min={0} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white" /></div>
              </div>
              <div className="space-y-1.5"><label className="text-xs font-bold text-gray-500 uppercase">Media Type</label><select value={mediaType} onChange={e => setMediaType(e.target.value as "IMAGE"|"VIDEO")} className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none dark:text-white"><option value="IMAGE">Image</option><option value="VIDEO">Video</option></select></div>
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Upload Media File</label>
                <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <UploadCloud size={32} className="mx-auto text-indigo-500 mb-2" />
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{mediaFile ? mediaFile.name : `Click to upload a new ${mediaType.toLowerCase()}`}</p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB</p>
                  <input type="file" className="hidden" ref={fileInputRef} accept={mediaType === "IMAGE" ? "image/*" : "video/*"} onChange={(e) => { if (e.target.files && e.target.files[0]) setMediaFile(e.target.files[0]); }} />
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div className="relative flex items-center">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="peer sr-only" />
                  <label htmlFor="isActive" className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 cursor-pointer"></label>
                </div>
                <label htmlFor="isActive" className="text-sm font-bold text-gray-700 dark:text-gray-300 cursor-pointer">Active</label>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 rounded-xl text-sm font-bold bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-300">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// 2. APPEARANCE & THEMING TAB
// -------------------------------------------------------------
function AppearanceTab({ setToast }: { setToast: any }) {
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [accentColor, setAccentColor] = useState("indigo");

  const colors = [
    { id: "indigo", hex: "#4f46e5", name: "Indigo" },
    { id: "rose", hex: "#e11d48", name: "Rose" },
    { id: "emerald", hex: "#059669", name: "Emerald" },
    { id: "violet", hex: "#7c3aed", name: "Violet" },
    { id: "amber", hex: "#d97706", name: "Amber" },
    { id: "sky", hex: "#0284c7", name: "Sky Blue" },
  ];

  useEffect(() => {
    setAnimationsEnabled(localStorage.getItem("apx_pref_animations") !== "false");
    setCompactMode(localStorage.getItem("apx_pref_compact") === "true");
    setAccentColor(localStorage.getItem("apx_pref_accent") || "indigo");
  }, []);

  const savePreferences = () => {
    localStorage.setItem("apx_pref_animations", animationsEnabled.toString());
    localStorage.setItem("apx_pref_compact", compactMode.toString());
    localStorage.setItem("apx_pref_accent", accentColor);
    setToast({ message: "Appearance preferences saved successfully", type: "success" });
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance & Theming</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Customize the look and feel of your admin dashboard.</p>
      </div>

      <div className="p-6 space-y-8 min-h-[400px]">
        {/* Accent Color Picker */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">Accent Color</h3>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setAccentColor(color.id)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform ${accentColor === color.id ? 'ring-2 ring-offset-2 ring-gray-900 dark:ring-white scale-110' : 'hover:scale-110'}`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {accentColor === color.id && <CheckCircle2 size={16} className="text-white" />}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Choose the primary color for buttons and active states.</p>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Enable UI Animations</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Allows micro-interactions and transitions to play smoothly across the dashboard.</p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input type="checkbox" id="pref_anim" checked={animationsEnabled} onChange={(e) => setAnimationsEnabled(e.target.checked)} className="peer sr-only" />
            <label htmlFor="pref_anim" className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer"></label>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Compact Mode UI</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Reduces padding and spacing in data tables to show more information on screen.</p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input type="checkbox" id="pref_comp" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} className="peer sr-only" />
            <label htmlFor="pref_comp" className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer"></label>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 dark:border-white/5">
          <button onClick={savePreferences} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors">
            Save Appearance
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 3. DATA & CACHE TAB
// -------------------------------------------------------------
function DataCacheTab({ setToast }: { setToast: any }) {
  const fileReaderRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = JSON.stringify(localStorage);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `apx-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ message: "Settings exported successfully", type: "success" });
    } catch (e) {
      setToast({ message: "Failed to export settings", type: "error" });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        Object.keys(json).forEach(key => {
          localStorage.setItem(key, json[key]);
        });
        setToast({ message: "Settings imported successfully! Reloading...", type: "success" });
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setToast({ message: "Invalid backup file", type: "error" });
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    if (window.confirm("WARNING: This will clear all local dashboard preferences. You will be logged out. Proceed?")) {
      localStorage.clear();
      sessionStorage.clear();
      setToast({ message: "Cache cleared. Reloading...", type: "loading" });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Data & Cache Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Export your configurations, clear local cache, or restore backups.</p>
      </div>

      <div className="p-6 space-y-6 min-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-gray-50 dark:bg-[#151515]">
            <Download className="text-indigo-500 mb-3" size={28} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Export Settings</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Download a JSON backup of your current local dashboard configurations.</p>
            <button onClick={handleExport} className="bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Download JSON
            </button>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-gray-50 dark:bg-[#151515]">
            <Upload className="text-emerald-500 mb-3" size={28} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Import Settings</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Restore your dashboard settings from a previously downloaded JSON file.</p>
            <input type="file" ref={fileReaderRef} accept=".json" onChange={handleImport} className="hidden" />
            <button onClick={() => fileReaderRef.current?.click()} className="bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 px-4 py-2 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              Upload JSON
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

        <div>
          <h3 className="font-bold text-red-600 mb-1 flex items-center gap-2"><Trash size={16} /> Danger Zone</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Wipe all local storage, preferences, and session data. This is useful for resetting a broken UI state.</p>
          <button onClick={handleClearCache} className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
            Clear Local Cache
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 4. DEVELOPER OPTIONS TAB
// -------------------------------------------------------------
function DeveloperTab({ setToast }: { setToast: any }) {
  const [devMode, setDevMode] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(false);

  useEffect(() => {
    setDevMode(localStorage.getItem("apx_dev_mode") === "true");
    setNetworkLatency(localStorage.getItem("apx_dev_latency") === "true");
  }, []);

  const saveDevSettings = () => {
    localStorage.setItem("apx_dev_mode", devMode.toString());
    localStorage.setItem("apx_dev_latency", networkLatency.toString());
    setToast({ message: "Developer options saved", type: "success" });
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Code2 size={20} className="text-indigo-500" /> Developer Options
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Advanced diagnostic tools for dashboard administrators and engineers.</p>
      </div>

      <div className="p-6 space-y-6 min-h-[400px]">
        <div className="flex items-start justify-between gap-4 p-4 border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl">
          <div>
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 mb-1">Enable Developer Mode</h3>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">Unlocks raw JSON payloads, exact timestamps, and internal UUIDs in tooltips across the platform.</p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input type="checkbox" id="dev_mode" checked={devMode} onChange={(e) => setDevMode(e.target.checked)} className="peer sr-only" />
            <label htmlFor="dev_mode" className="w-12 h-6 bg-gray-300 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer"></label>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 dark:border-white/10 rounded-2xl">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">Simulate Network Latency</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Adds an artificial 1.5s delay to all outgoing API requests to test loading states.</p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input type="checkbox" id="dev_latency" checked={networkLatency} onChange={(e) => setNetworkLatency(e.target.checked)} className="peer sr-only" />
            <label htmlFor="dev_latency" className="w-12 h-6 bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 cursor-pointer"></label>
          </div>
        </div>

        <div className="pt-4">
          <button onClick={saveDevSettings} className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-6 py-2.5 rounded-xl text-sm font-bold shadow-md transition-colors">
            Apply Developer Settings
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// 5. SYSTEM INFO TAB
// -------------------------------------------------------------
function SystemInfoTab() {
  const [browserInfo, setBrowserInfo] = useState({ agent: "", language: "", platform: "", online: true });

  useEffect(() => {
    setBrowserInfo({
      agent: navigator.userAgent.split(" ")[0],
      language: navigator.language,
      platform: navigator.platform || "Unknown",
      online: navigator.onLine
    });
  }, []);

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Enhanced System Information</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">Real-time diagnostics of your current administrative session.</p>
      </div>

      <div className="p-6 min-h-[400px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Backend API</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">Online & Active</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <Cpu size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Frontend Engine</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">Next.js React</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <MonitorSmartphone size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Environment</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <Laptop size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client Platform</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{browserInfo.platform}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <Globe size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Browser Lang</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{browserInfo.language.toUpperCase()}</p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-[#151515] border border-gray-100 dark:border-white/5 p-4 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl">
              <Wifi size={24} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Connection</p>
              <p className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{browserInfo.online ? 'Connected' : 'Offline'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN PAGE LAYOUT
// -------------------------------------------------------------
type TabType = "hero" | "appearance" | "data" | "developer" | "system";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("hero");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const TabButton = ({ id, icon, title }: { id: TabType, icon: React.ReactNode, title: string }) => {
    const isActive = activeTab === id;
    return (
      <button 
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
          isActive 
            ? "bg-indigo-600 text-white shadow-md" 
            : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {title}
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Settings size={24} />
            </div>
            Advanced Site Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Configure enterprise-grade platform parameters, system cache, and UI preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 shrink-0 space-y-2">
           <TabButton id="hero" icon={<ImageIcon size={18} />} title="Homepage Sliders" />
           <TabButton id="appearance" icon={<Palette size={18} />} title="Appearance & Theme" />
           <TabButton id="data" icon={<Database size={18} />} title="Data & Cache" />
           <TabButton id="developer" icon={<Code2 size={18} />} title="Developer Options" />
           <TabButton id="system" icon={<Monitor size={18} />} title="System Info" />
        </div>
        
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "hero" && <HeroBannersTab setToast={setToast} />}
              {activeTab === "appearance" && <AppearanceTab setToast={setToast} />}
              {activeTab === "data" && <DataCacheTab setToast={setToast} />}
              {activeTab === "developer" && <DeveloperTab setToast={setToast} />}
              {activeTab === "system" && <SystemInfoTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
