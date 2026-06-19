import React, { useRef } from 'react';
import { CompanyVaultDocument } from '@/services/admin/companyVault.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Archive, Loader2, Upload, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  formLogic: any;
}

export default function CompanyVaultFormModal({ onClose, formLogic }: Props) {
  const { editingDocument, isSubmitting, handleSubmit, formErrors = {} } = formLogic;
  const isEditing = !!editingDocument;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white dark:bg-[#111111] rounded-3xl sm:rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden max-h-[95dvh] sm:max-h-[90dvh]"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-white/10 shrink-0 relative z-10 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm shrink-0">
              <Archive size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                {isEditing ? 'Edit Document' : 'Upload Document'}
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                {isEditing
                  ? 'Update vault document details'
                  : 'Securely upload a new document to the vault'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar bg-gray-50/30 dark:bg-black/10 relative z-0"
        >
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>Document Key / Identifier <span className="text-red-500">*</span></span>
              </label>
              <input
                type="text"
                name="key"
                defaultValue={editingDocument?.key}
                placeholder="e.g. INCORPORATION_CERT_2023"
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all uppercase shadow-sm placeholder:font-normal placeholder:normal-case"
              />
              <p className="text-xs font-medium text-gray-500">Must be a unique identifier across the vault.</p>
              {formErrors.key && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {formErrors.key}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={editingDocument?.description || ''}
                rows={3}
                placeholder="Brief description of the document..."
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all resize-none shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                File Upload {isEditing ? '(Optional to replace)' : <span className="text-red-500">*</span>}
              </label>
              <div
                className={`border-2 border-dashed ${formErrors.document ? 'border-red-500 bg-red-50 dark:bg-red-500/10' : 'border-indigo-200 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 hover:bg-indigo-50 dark:hover:bg-indigo-500/10'} rounded-2xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer group shadow-sm`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className={`w-14 h-14 rounded-full ${formErrors.document ? 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400' : 'bg-white dark:bg-[#222] text-indigo-600 dark:text-indigo-400 shadow-sm border border-gray-100 dark:border-white/5'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Upload size={24} strokeWidth={2.5} />
                </div>
                <p className={`text-[15px] font-bold ${formErrors.document ? 'text-red-600 dark:text-red-400' : 'text-indigo-900 dark:text-indigo-100'} mb-1 text-center`}>
                  Click to browse for a document
                </p>
                <p className="text-[13px] font-medium text-gray-500 text-center max-w-[80%]">
                  {isEditing ? 'Leave blank to retain current file.' : 'Accepts PDF, DOCX, and Image files.'} Maximum size is 10MB.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="document"
                  className="hidden"
                  onChange={(e) => {
                    const fileName = e.target.files?.[0]?.name;
                    if (fileName) {
                      toast.success(`Attached: ${fileName}`, { id: 'file-selected' });
                    }
                  }}
                />
              </div>
              {formErrors.document && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-2">
                  <AlertCircle size={12} /> {formErrors.document}
                </p>
              )}
              {isEditing && editingDocument?.fileName && (
                <div className="flex items-center gap-2 mt-3 px-4 py-2.5 bg-white dark:bg-[#151515] rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                  <Archive size={14} className="text-indigo-500 shrink-0" />
                  <p className="text-[13px] font-bold text-gray-700 dark:text-gray-300 truncate">
                    Currently secured: <span className="text-indigo-600 dark:text-indigo-400">{editingDocument.fileName}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </form>

        <div className="p-6 sm:p-8 flex justify-end gap-3 border-t border-gray-100 dark:border-white/10 shrink-0 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md relative z-10">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-3 min-h-[44px] rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={() => {
              const form = document.querySelector('form');
              if (form) form.requestSubmit();
            }}
            disabled={isSubmitting}
            className="px-6 py-3 min-h-[44px] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold tracking-wide transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} strokeWidth={3} />
                Uploading...
              </>
            ) : (
              <>
                <Save size={18} strokeWidth={3} />
                {isEditing ? 'Save Changes' : 'Upload Document'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
