'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, UploadCloud, AlertCircle, CheckCircle2, Send, Loader2 } from 'lucide-react';

interface ReimbursementFormProps {
  title: string;
  setTitle: (val: string) => void;
  amount: string;
  setAmount: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  receiptFile: File | null;
  fileInputRef: any;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error: string;
  successMessage: string;
}

export function ReimbursementForm({
  title,
  setTitle,
  amount,
  setAmount,
  category,
  setCategory,
  description,
  setDescription,
  receiptFile,
  fileInputRef,
  handleFileChange,
  handleSubmit,
  isSubmitting,
  error,
  successMessage,
}: ReimbursementFormProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-6 shadow-sm sticky top-24">
        <div className="border-b border-gray-100 dark:border-white/10 pb-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            New Claim Request
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Fill out the details to request a reimbursement.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Title / Purpose *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Client Lunch Meeting"
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 min-h-[48px] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Amount (₹) *
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 1500"
                step="0.01"
                min="0.1"
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 min-h-[48px] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-3 min-h-[48px] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium cursor-pointer text-gray-900 dark:text-white"
              >
                <option value="Travel">Travel</option>
                <option value="Meals & Entertainment">Meals & Ent.</option>
                <option value="Software/SaaS">Software/SaaS</option>
                <option value="Hardware">Hardware</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any additional context..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 min-h-[48px] outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Receipt/Proof (Optional)
            </label>
            <div
              className="w-full relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf"
              />
              {receiptFile ? (
                <div className="flex flex-col items-center gap-2">
                  <FileText className="w-6 h-6 text-indigo-500" />
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                    {receiptFile.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">Click to change</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <UploadCloud className="w-6 h-6 text-gray-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Upload Receipt
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">
                    JPG, PNG, PDF up to 5MB
                  </span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 text-red-500 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] active:scale-[0.98] transition-all disabled:opacity-75 disabled:active:scale-100 cursor-pointer mt-4"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> Submit Claim
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
