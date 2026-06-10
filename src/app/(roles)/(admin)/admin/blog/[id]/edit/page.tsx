"use client";

import React from "react";
import { Edit3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Edit3 size={24} />
            </div>
            Edit Post
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Update existing blog post content.
          </p>
        </div>
      </div>

      {/* Empty State / Construction Placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full min-h-[500px] bg-white dark:bg-[#111111] border border-dashed border-gray-200 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center p-8 text-center shadow-[0px_4px_20px_rgba(0,0,0,0.02)]"
      >
        <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
          <AlertCircle className="text-gray-400 dark:text-gray-500" size={32} />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Module Under Construction</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
          The <strong>Edit Post</strong> frontend routing is active, but the backend APIs and data tables have not been connected yet. 
        </p>
        <button className="mt-6 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors border border-gray-200 dark:border-white/10">
          Go Back
        </button>
      </motion.div>
    </div>
  );
}
