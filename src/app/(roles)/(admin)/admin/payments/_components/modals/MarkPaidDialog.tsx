import React from 'react';
import { Payment } from '@/services/admin/payments.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, Hash, User, DollarSign, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  isOpen: boolean;
  payment: Payment | null;
  amountPaidInput: string;
  transactionIdInput: string;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  setAmountPaidInput: (val: string) => void;
  setTransactionIdInput: (val: string) => void;
}

export function MarkPaidDialog({
  isOpen,
  payment,
  amountPaidInput,
  transactionIdInput,
  isPending,
  onClose,
  onConfirm,
  setAmountPaidInput,
  setTransactionIdInput,
}: Props) {
  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
      Number(amount)
    );
  };

  return (
    <AnimatePresence>
      {isOpen && payment && (
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
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-100/80 dark:border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-100/50 dark:border-emerald-500/20">
                    <CheckCircle size={24} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Confirm Payment</h2>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">Mark invoice as completely paid</p>
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
                
                {/* Financial Dashboard Summary */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-[#151515] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1.5">
                      <User size={14} />
                      <p className="text-xs font-bold uppercase tracking-wider">Customer</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                      {payment.customer.fullName}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-[#151515] p-4 rounded-2xl border border-gray-200/50 dark:border-white/5 shadow-sm">
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1.5">
                      <DollarSign size={14} />
                      <p className="text-xs font-bold uppercase tracking-wider">Amount Due</p>
                    </div>
                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">
                      {formatCurrency(payment.negotiatedAmount)}
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <DollarSign size={14} strokeWidth={3} /> Amount Paid (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-500 font-bold">₹</span>
                      </div>
                      <input
                        type="number"
                        value={amountPaidInput}
                        onChange={(e) => setAmountPaidInput(e.target.value)}
                        placeholder="0.00"
                        className={cn(
                          "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 pl-9 pr-4 text-[15px] font-bold text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm",
                          "focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 dark:focus:ring-emerald-500/20 dark:focus:border-emerald-500/50",
                          "hover:border-gray-300 dark:hover:border-white/20"
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                      <Hash size={14} strokeWidth={3} /> Transaction ID <span className="text-gray-400 font-medium normal-case tracking-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={transactionIdInput}
                      onChange={(e) => setTransactionIdInput(e.target.value)}
                      placeholder="e.g. TXN_123456789"
                      className={cn(
                        "w-full bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-xl py-3.5 px-4 text-[15px] font-medium text-gray-900 dark:text-white outline-none transition-all duration-300 shadow-sm",
                        "focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500/50 dark:focus:ring-emerald-500/20 dark:focus:border-emerald-500/50",
                        "hover:border-gray-300 dark:hover:border-white/20"
                      )}
                    />
                  </div>
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
                  disabled={isPending || !amountPaidInput}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3.5 sm:py-3 rounded-xl font-bold text-[14px] transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2 hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto"
                >
                  {isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CheckCircle size={18} strokeWidth={2.5} />
                  )}
                  {isPending ? 'Confirming...' : 'Confirm Paid'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
