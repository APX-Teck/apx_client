"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { servicesAdminService } from "@/services/admin/services.service";

export default function CreateServicePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    timeline: "",
    isActive: true,
    sortOrder: 0,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "sortOrder") {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      if (formData.slug) submitData.append("slug", formData.slug);
      if (formData.description) submitData.append("description", formData.description);
      if (formData.price) submitData.append("price", formData.price);
      if (formData.timeline) submitData.append("timeline", formData.timeline);
      submitData.append("isActive", formData.isActive.toString());
      submitData.append("sortOrder", formData.sortOrder.toString());
      
      if (thumbnailFile) {
        submitData.append("thumbnail", thumbnailFile);
      }

      await servicesAdminService.createService(submitData);
      router.push("/admin/services");
      router.refresh();
    } catch (error) {
      console.error("Failed to create service", error);
      alert("Failed to create service. Please check the inputs and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Link href="/admin/services" className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              <ArrowLeft size={16} />
              Back to Services
            </Link>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Create New Service
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Add a new service offering to be displayed on the public site.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Thumbnail Upload */}
            <div className="w-full md:w-1/3 shrink-0 space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Service Thumbnail</label>
              <div 
                className="w-full aspect-square bg-gray-50 dark:bg-[#1a1a1a] border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl flex flex-col items-center justify-center p-4 relative overflow-hidden group hover:border-indigo-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('thumbnail-upload')?.click()}
              >
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Thumbnail preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-bold text-sm">Change Image</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-bold text-gray-500 dark:text-gray-400">Upload Image</span>
                    <p className="text-[10px] text-gray-400 mt-1">JPEG, PNG, WebP</p>
                  </div>
                )}
                <input 
                  id="thumbnail-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* Form Fields */}
            <div className="w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Service Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Web Development"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Slug</label>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="e.g. web-development (optional)"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Price Indicator</label>
                  <input 
                    type="text" 
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="e.g. Starts at ₹10,000"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Timeline</label>
                  <input 
                    type="text" 
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    placeholder="e.g. 2-4 Weeks"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-900 dark:text-white">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description of the service..."
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none custom-scrollbar"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Sort Order</label>
                  <input 
                    type="number" 
                    name="sortOrder"
                    value={formData.sortOrder}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-bold text-gray-900 dark:text-white">Service is Active</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/5">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Service
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
