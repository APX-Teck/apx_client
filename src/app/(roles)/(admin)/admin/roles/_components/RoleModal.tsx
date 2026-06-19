import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldAlert } from 'lucide-react';

interface Props {
  isModalOpen: boolean;
  modalMode: 'CREATE' | 'EDIT';
  handleCloseModal: () => void;
  formData: { name: string; description: string };
  setFormData: (data: { name: string; description: string }) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  errors?: Record<string, string>;
  serverError?: string;
}

export function RoleModal({
  isModalOpen,
  modalMode,
  handleCloseModal,
  formData,
  setFormData,
  handleSubmit,
  isSubmitting,
  errors = {},
  serverError = '',
}: Props) {
  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl w-full max-w-md rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-100/80 dark:border-white/10 overflow-hidden"
          >
            <div className="flex justify-between items-center p-6 lg:p-8 border-b border-gray-100/80 dark:border-white/10">
              <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                {modalMode === 'CREATE' ? 'Create New Role' : 'Edit Role'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 p-2 rounded-full"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-5" noValidate>
              {serverError && (
                <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <ShieldAlert size={16} />
                  {serverError}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. MARKETING_MANAGER"
                  className={`w-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border rounded-2xl px-5 py-4 min-h-[44px] text-[15px] focus:outline-none uppercase dark:text-white font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                    errors.name
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200/80 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                  }`}
                />
                {errors.name ? (
                  <p className="text-[13px] font-bold text-red-500 mt-2 ml-1">{errors.name}</p>
                ) : (
                  <p className="text-[13px] font-medium text-gray-500 mt-2 ml-1">
                    Spaces will be automatically converted to underscores.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this role's responsibilities..."
                  rows={3}
                  className={`w-full bg-white/50 dark:bg-black/20 backdrop-blur-sm border rounded-2xl px-5 py-4 min-h-[44px] text-[15px] focus:outline-none dark:text-white resize-none font-medium transition-all duration-300 shadow-sm hover:shadow-md ${
                    errors.description
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-gray-200/80 dark:border-white/10 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50'
                  }`}
                />
                {errors.description && (
                  <p className="text-[13px] font-bold text-red-500 mt-2 ml-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:flex-1 px-5 py-3.5 min-h-[44px] rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !formData.name}
                  className="w-full sm:flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-5 py-3.5 min-h-[44px] rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 active:scale-95"
                >
                  {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                  {modalMode === 'CREATE' ? 'Create Role' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
