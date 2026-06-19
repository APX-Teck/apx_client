'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCreateRoleLogic } from '../_hooks/useCreateRoleLogic';

export default function CreateRolePage() {
  const { isSubmitting, formData, errors, serverError, handleChange, handleSubmit } = useCreateRoleLogic();

  return (
    <div className="w-full max-w-4xl mx-auto pb-safe pb-12 px-4 sm:px-6 md:px-8">
      {/* Header section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/roles"
            className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
              <Shield size={24} className="text-indigo-600 dark:text-indigo-400" />
              Create New Role
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
              Add a new custom role to the system.
            </p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6" noValidate>
          {serverError && (
            <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
              <Shield size={16} />
              {serverError}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. MARKETING_MANAGER"
                className={`w-full px-4 py-3 min-h-[44px] bg-gray-50 dark:bg-[#1a1a1a] border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white font-mono uppercase ${
                  errors.name
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
                required
              />
              {errors.name ? (
                <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-2">
                  Use uppercase letters and underscores only.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-900 dark:text-white">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what this role is used for..."
                rows={4}
                className={`w-full px-4 py-3 min-h-[44px] bg-gray-50 dark:bg-[#1a1a1a] border rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 dark:text-white resize-none ${
                  errors.description
                    ? 'border-red-500 focus:ring-red-500/50'
                    : 'border-gray-200 dark:border-white/10 focus:ring-indigo-500 focus:border-indigo-500'
                }`}
              ></textarea>
              {errors.description && (
                <p className="text-red-500 text-xs font-bold mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Link
              href="/admin/roles"
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] flex items-center justify-center rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-6 py-3 min-h-[44px] flex items-center justify-center rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-[0px_4px_14px_rgba(79,70,229,0.3)] gap-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {isSubmitting ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
