import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Link as LinkIcon, DollarSign, FileText, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  requestsData: any[];
  selectedRequestId: string;
  createNegotiatedAmount: string;
  createSuggestedAmount: string;
  createInvoiceNote: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setSelectedRequestId: (val: string) => void;
  setCreateNegotiatedAmount: (val: string) => void;
  setCreateSuggestedAmount: (val: string) => void;
  setCreateInvoiceNote: (val: string) => void;
}

export function CreatePaymentLinkDialog({
  isOpen,
  requestsData,
  selectedRequestId,
  createNegotiatedAmount,
  createSuggestedAmount,
  createInvoiceNote,
  isPending,
  onClose,
  onConfirm,
  setSelectedRequestId,
  setCreateNegotiatedAmount,
  setCreateSuggestedAmount,
  setCreateInvoiceNote,
}: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-3xl sm:rounded-[2rem] w-full max-w-lg max-h-[95dvh] sm:max-h-[90dvh] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
              
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100/80 dark:border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
                    <LinkIcon size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Create Payment Link</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Generate a secure payment invoice</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors active:scale-95 border border-transparent hover:border-gray-200 dark:hover:border-white/10"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar relative z-10 bg-gray-50/30 dark:bg-black/10">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Service Request <span className="text-red-500">*</span>
                  </label>
                  <div className="relative group">
                    <select
                      value={selectedRequestId}
                      onChange={(e) => setSelectedRequestId(e.target.value)}
                      className={cn(
                        "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-4 pr-10 text-[15px] font-medium text-gray-900 dark:text-white outline-none transition-all duration-300 appearance-none cursor-pointer shadow-sm",
                        "focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500/50",
                        "hover:border-gray-300 dark:hover:border-white/20"
                      )}
                    >
                      <option value="">-- Select a Request --</option>
                      {requestsData?.map((r) => (
                        <option key={r.id} value={r.id}>
                          Req #{r.id} - {r.customerName} ({r.serviceType})
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <DollarSign size={14} strokeWidth={3} /> Negotiated (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-bold">₹</span>
                      </div>
                      <input
                        type="number"
                        value={createNegotiatedAmount}
                        onChange={(e) => setCreateNegotiatedAmount(e.target.value)}
                        placeholder="0.00"
                        className={cn(
                          "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm",
                          "focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500/50",
                          "hover:border-gray-300 dark:hover:border-white/20"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <DollarSign size={14} strokeWidth={3} /> Suggested (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-bold">₹</span>
                      </div>
                      <input
                        type="number"
                        value={createSuggestedAmount}
                        onChange={(e) => setCreateSuggestedAmount(e.target.value)}
                        placeholder="Optional"
                        className={cn(
                          "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm",
                          "focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500/50",
                          "hover:border-gray-300 dark:hover:border-white/20"
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <FileText size={14} strokeWidth={3} /> Invoice Note
                  </label>
                  <textarea
                    value={createInvoiceNote}
                    onChange={(e) => setCreateInvoiceNote(e.target.value)}
                    placeholder="Add an optional note to display on the invoice..."
                    className={cn(
                      "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 text-[15px] font-medium text-gray-900 dark:text-white outline-none transition-all duration-300 resize-none h-24 shadow-sm",
                      "focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-500/50",
                      "hover:border-gray-300 dark:hover:border-white/20"
                    )}
                  />
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-6 sm:p-8 border-t border-gray-100/80 dark:border-white/5 relative z-10 bg-white dark:bg-[#111111]">
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="px-6 py-3.5 sm:py-3 text-[14px] font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isPending || !selectedRequestId || !createNegotiatedAmount}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 sm:py-3 rounded-xl font-bold text-[14px] transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <LinkIcon size={18} strokeWidth={2.5} />
                  )}
                  {isPending ? 'Generating...' : 'Generate Link'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
