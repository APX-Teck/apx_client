"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { portfolioService } from "@/services/admin/portfolio.service";
import { Save, X, Image as ImageIcon, Briefcase, Link as LinkIcon, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export default function PortfolioForm({ initialData, mode = "create" }: { initialData?: any; mode?: "create" | "edit" }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    clientName: initialData?.clientName || "",
    serviceType: initialData?.serviceType || "",
    problem: initialData?.problem || "",
    solution: initialData?.solution || "",
    results: initialData?.results || "",
    liveUrl: initialData?.liveUrl || "",
    isPublished: initialData?.isPublished ?? false,
    sortOrder: initialData?.sortOrder || 0,
    completedAt: initialData?.completedAt ? new Date(initialData.completedAt).toISOString().split("T")[0] : "",
  });

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToast({ message: "Saving portfolio...", type: "loading" });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          data.append(key, String(value));
        }
      });

      if (coverImage) data.append("coverImage", coverImage);
      if (clientLogo) data.append("clientLogo", clientLogo);
      galleryImages.forEach((file) => data.append("galleryImages", file));

      if (mode === "create") {
        await portfolioService.createPortfolio(data);
      } else {
        await portfolioService.updatePortfolio(initialData.id, data, "replace");
      }

      setToast({ message: "Portfolio saved successfully!", type: "success" });
      setTimeout(() => router.push("/admin/portfolio"), 1000);
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || "Failed to save portfolio", type: "error" });
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto pb-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white flex items-center gap-3">
          <Briefcase className="text-[#39FF14]" size={28} />
          {mode === "create" ? "Create New Portfolio" : "Edit Portfolio"}
        </h1>
        <div className="flex gap-3">
          <button type="button" onClick={() => router.back()} className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors flex items-center gap-2">
            <X size={18} /> Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="bg-[#39FF14] text-black px-6 py-2.5 rounded-xl font-bold hover:bg-[#32e012] transition-colors flex items-center gap-2 disabled:opacity-50">
            <Save size={18} /> {isSubmitting ? "Saving..." : "Save Portfolio"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Project Title</label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" placeholder="e.g. Next.js E-commerce Redesign" />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Client Name</label>
                <input required type="text" name="clientName" value={formData.clientName} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Service Type</label>
                <input required type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" placeholder="e.g. Web Development" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Problem Statement</label>
              <textarea name="problem" value={formData.problem} onChange={handleChange} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Solution</label>
              <textarea name="solution" value={formData.solution} onChange={handleChange} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Results / Impact</label>
              <textarea name="results" value={formData.results} onChange={handleChange} rows={3} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#39FF14] outline-none transition-colors" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.isPublished ? "bg-[#39FF14]" : "bg-gray-700"}`}>
                <div className={`w-4 h-4 bg-black rounded-full transition-transform ${formData.isPublished ? "translate-x-6" : ""}`} />
              </div>
              <span className="font-bold text-white">Publish Portfolio</span>
              <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleChange} className="hidden" />
            </label>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Sort Order</label>
              <input type="number" name="sortOrder" value={formData.sortOrder} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Live URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-3 text-gray-500" size={18} />
                <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white outline-none" placeholder="https://" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Completion Date</label>
              <input type="date" name="completedAt" value={formData.completedAt} onChange={handleChange} className="w-full bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-white outline-none" />
            </div>
          </div>

          <div className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Cover Image</label>
              <input type="file" accept="image/*" onChange={(e) => setCoverImage(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Client Logo</label>
              <input type="file" accept="image/*" onChange={(e) => setClientLogo(e.target.files?.[0] || null)} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Gallery Images</label>
              <input type="file" multiple accept="image/*" onChange={(e) => setGalleryImages(Array.from(e.target.files || []))} className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20" />
              <p className="text-xs text-gray-500 mt-2">Selecting new images will replace existing ones (unless galleryMode is changed in backend call)</p>
            </div>
          </div>
        </div>
      </div>
      
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : toast.type === 'error' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
          {toast.type === "success" && <CheckCircle2 size={18} />}
          {toast.type === "error" && <AlertCircle size={18} />}
          {toast.type === "loading" && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </form>
  );
}
