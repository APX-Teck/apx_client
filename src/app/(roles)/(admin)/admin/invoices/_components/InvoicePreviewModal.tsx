import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ExternalLink, FileCheck2, Loader2, X } from 'lucide-react';
import { GenerateInvoiceResult } from '@/app/types/invoice.types';
import { formatINR } from '../_lib/invoice.constants';

interface Props {
  preview: { html: string; invoiceNumber: string; isAutoNumber: boolean } | null;
  generated: GenerateInvoiceResult | null;
  isGenerating: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function InvoicePreviewModal({ preview, generated, isGenerating, onClose, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {preview && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/95 dark:bg-[#111111]/95 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-3xl w-full max-w-4xl max-h-[95dvh] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-indigo-400" />

            <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100/80 dark:border-white/5">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-11 h-11 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-100/50 dark:border-indigo-500/20">
                  <FileCheck2 size={22} strokeWidth={2.5} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                    {generated ? 'Invoice Generated' : 'Invoice Preview'}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {generated
                      ? generated.invoice.invoiceNumber
                      : preview.isAutoNumber
                        ? `${preview.invoiceNumber} — final number is assigned on generation`
                        : preview.invoiceNumber}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isGenerating}
                className="p-2.5 rounded-full text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors disabled:opacity-40"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {generated ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-3">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                  <CheckCircle size={32} />
                </div>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                  {generated.invoice.invoiceNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {generated.invoice.clientName} · {formatINR(generated.invoice.totalAmount)}
                </p>
                <a
                  href={generated.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30"
                >
                  <ExternalLink size={16} /> Open PDF
                </a>
              </div>
            ) : (
              <div className="flex-1 overflow-hidden bg-gray-100 dark:bg-black/30 p-3 sm:p-4">
                {/* Server-rendered HTML — the same markup the PDF is printed from. Sandboxed, no scripts. */}
                <iframe
                  title="Invoice preview"
                  srcDoc={preview.html}
                  sandbox=""
                  className="w-full h-[65dvh] rounded-xl bg-white shadow-sm border border-gray-200 dark:border-white/10"
                />
              </div>
            )}

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 p-5 sm:p-6 border-t border-gray-100/80 dark:border-white/5">
              {generated ? (
                <button
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl font-bold text-sm transition-all w-full sm:w-auto"
                >
                  Done
                </button>
              ) : (
                <>
                  <button
                    onClick={onClose}
                    disabled={isGenerating}
                    className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 w-full sm:w-auto"
                  >
                    Back to Edit
                  </button>
                  <button
                    onClick={onConfirm}
                    disabled={isGenerating}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 w-full sm:w-auto"
                  >
                    {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} strokeWidth={2.5} />}
                    {isGenerating ? 'Generating...' : 'Confirm & Generate'}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
