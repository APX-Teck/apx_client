"use client";

import React, { useState } from "react";
import { PlusCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateServiceRequestPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/admin/requests");
    }, 1000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Link href="/admin/requests" className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              <ArrowLeft size={16} />
              Back to Requests
            </Link>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <PlusCircle size={24} />
            </div>
            Create Service Request
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Fill in the details below to create a new service request.
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Customer Name</label>
              <input 
                type="text" 
                placeholder="Enter customer name"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Customer Email</label>
              <input 
                type="email" 
                placeholder="Enter email address"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Service Type</label>
            <select 
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
              required
            >
              <option value="" disabled selected>Select a service type</option>
              <option value="WEB_DEVELOPMENT">Web Development</option>
              <option value="APP_DEVELOPMENT">App Development</option>
              <option value="SEO_MARKETING">SEO & Marketing</option>
              <option value="UI_UX_DESIGN">UI/UX Design</option>
              <option value="SUPPORT_MAINTENANCE">Support & Maintenance</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-900 dark:text-white">Request Description</label>
            <textarea 
              placeholder="Describe the service request in detail..."
              rows={5}
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none custom-scrollbar"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Priority Level</label>
              <select className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-900 dark:text-white">Assigned Team Member</label>
              <select className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none">
                <option value="">-- Unassigned --</option>
                <option value="user_1">Praveen Maurya</option>
                <option value="user_2">Jane Doe</option>
                <option value="user_3">John Smith</option>
              </select>
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
                  Creating...
                </>
              ) : (
                "Create Request"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
