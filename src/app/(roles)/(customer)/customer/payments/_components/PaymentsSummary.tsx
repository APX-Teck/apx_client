'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, Clock } from 'lucide-react';
import { Payment } from '../types';

interface PaymentsSummaryProps {
  isLoading: boolean;
  amountDue: number;
  lastPayment: Payment | null;
}

export function PaymentsSummary({ isLoading, amountDue, lastPayment }: PaymentsSummaryProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {isLoading ? (
        <>
          <div className="h-48 rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse border border-gray-100 dark:border-white/5"></div>
          <div className="h-48 rounded-3xl bg-gray-200 dark:bg-white/5 animate-pulse border border-gray-100 dark:border-white/5"></div>
        </>
      ) : (
        <>
          <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#111] dark:to-black p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-800 dark:border-white/5 relative overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <p className="text-gray-400 text-sm font-medium mb-1">Amount Due</p>
              <h3 className="text-3xl sm:text-4xl font-black text-white mb-4 sm:mb-6">₹{amountDue.toFixed(2)}</h3>
              <button
                disabled={amountDue === 0}
                className="flex items-center justify-center min-h-[48px] gap-2 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
              >
                <CreditCard className="w-5 h-5" />
                <span>{amountDue > 0 ? 'Pay Now' : 'No Pending Dues'}</span>
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col justify-between shadow-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">
                Last Payment
              </p>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {lastPayment
                  ? `₹${Number(lastPayment.amountPaid || lastPayment.negotiatedAmount).toFixed(2)}`
                  : '₹0.00'}
              </h3>
              {lastPayment ? (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Paid on{' '}
                  {new Date(lastPayment.paidAt || lastPayment.updatedAt).toLocaleDateString()}
                </p>
              ) : (
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 italic">
                  No past payments found
                </p>
              )}
            </div>
            <button
              disabled={!lastPayment}
              className="flex items-center justify-center min-h-[48px] gap-2 w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold px-5 py-3 rounded-xl transition-all border border-gray-200 dark:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              <span>Download Receipt</span>
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
}
