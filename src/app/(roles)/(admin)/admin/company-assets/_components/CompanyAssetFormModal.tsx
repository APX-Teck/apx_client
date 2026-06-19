import React from 'react';
import { CompanyAsset } from '@/services/admin/companyAssets.service';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Box, Calendar, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  onClose: () => void;
  formLogic: any;
}

export default function CompanyAssetFormModal({ onClose, formLogic }: Props) {
  const { editingAsset, isSubmitting, handleSubmit, formErrors = {} } = formLogic;
  const isEditing = !!editingAsset;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      await handleSubmit(e);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
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
        className="relative w-full max-w-2xl bg-white dark:bg-[#111111] rounded-3xl sm:rounded-[2rem] shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden max-h-[95dvh] sm:max-h-[90dvh]"
      >
        <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100 dark:border-white/10 shrink-0 relative z-10 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-500/20 shadow-sm shrink-0">
              <Box size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-gray-900 dark:text-white">
                {isEditing ? 'Edit Company Asset' : 'Add New Asset'}
              </h2>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                {isEditing
                  ? 'Update the details of the selected asset'
                  : 'Fill in the information to add a new asset'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Asset Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                defaultValue={editingAsset?.type || ''}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  Select an asset type...
                </option>
                <option value="DOMAIN">Domain</option>
                <option value="TRADEMARK">Trademark</option>
                <option value="LICENSE">License</option>
                <option value="REGISTRATION">Registration</option>
                <option value="CERTIFICATE">Certificate</option>
                <option value="SUBSCRIPTION">Subscription</option>
                <option value="OTHER">Other</option>
              </select>
              {formErrors.type && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {formErrors.type}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                defaultValue={editingAsset?.title}
                placeholder="e.g. MacBook Pro M2"
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
              />
              {formErrors.title && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {formErrors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Reference Number
              </label>
              <input
                type="text"
                name="referenceNumber"
                defaultValue={editingAsset?.referenceNumber || ''}
                placeholder="e.g. SRN-2023-01"
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Provider / Vendor
              </label>
              <input
                type="text"
                name="provider"
                defaultValue={editingAsset?.provider || ''}
                placeholder="e.g. Apple Inc."
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Issued Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="issuedDate"
                  defaultValue={
                    editingAsset?.issuedDate
                      ? new Date(editingAsset.issuedDate).toISOString().split('T')[0]
                      : ''
                  }
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
                />
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Expiry / Return Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="expiryDate"
                  defaultValue={
                    editingAsset?.expiryDate
                      ? new Date(editingAsset.expiryDate).toISOString().split('T')[0]
                      : ''
                  }
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
                />
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Renewal / Asset Cost
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  name="renewalCost"
                  defaultValue={editingAsset?.renewalCost || ''}
                  placeholder="0.00"
                  className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
                />
                <DollarSign
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold"
                  size={18}
                />
              </div>
              {formErrors.renewalCost && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {formErrors.renewalCost}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                defaultValue={editingAsset?.status || 'ACTIVE'}
                className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all shadow-sm appearance-none cursor-pointer"
              >
                <option value="ACTIVE">Active</option>
                <option value="EXPIRING_SOON">Expiring Soon</option>
                <option value="EXPIRED">Expired</option>
                <option value="RENEWED">Renewed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
              {formErrors.status && (
                <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1">
                  <AlertCircle size={12} /> {formErrors.status}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 cursor-pointer hover:border-gray-300 dark:hover:border-white/20 transition-all shadow-sm">
              <input
                type="checkbox"
                name="autoRenew"
                defaultChecked={editingAsset?.autoRenew || false}
                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500/50"
              />
              <div className="flex-1">
                <div className="text-[15px] font-bold text-gray-900 dark:text-white">
                  Auto Renew
                </div>
                <div className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">
                  Automatically renew this asset or subscription upon expiry
                </div>
              </div>
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">Notes</label>
            <textarea
              name="notes"
              defaultValue={editingAsset?.notes || ''}
              rows={3}
              placeholder="Any additional information or context..."
              className="w-full px-4 py-3 min-h-[44px] rounded-xl bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-[15px] font-medium text-gray-900 dark:text-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 outline-none transition-all resize-none shadow-sm"
            />
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
                Saving...
              </>
            ) : (
              <>
                <Save size={18} strokeWidth={3} />
                {isEditing ? 'Save Changes' : 'Create Asset'}
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
