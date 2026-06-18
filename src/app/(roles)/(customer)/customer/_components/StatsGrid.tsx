'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CreditCard, CheckCircle2 } from 'lucide-react';

interface StatsGridProps {
  activeCount: number;
  unpaidInvoices: number;
  completedCount: number;
}

export function StatsGrid({ activeCount, unpaidInvoices, completedCount }: StatsGridProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-white dark:bg-[#111] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all group flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            Active Requests
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">{activeCount}</h3>
            <span className="text-sm font-medium text-cyan-500">In Progress</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/5 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
          <ClipboardList className="w-7 h-7" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all group flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            Unpaid Invoices
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">{unpaidInvoices}</h3>
            <span className="text-sm font-medium text-amber-500">Pending</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
          <CreditCard className="w-7 h-7" />
        </div>
      </div>

      <div className="bg-white dark:bg-[#111] p-5 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">
            Projects Completed
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white">{completedCount}</h3>
            <span className="text-sm font-medium text-emerald-500">Total</span>
          </div>
        </div>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
          <CheckCircle2 className="w-7 h-7" />
        </div>
      </div>
    </motion.div>
  );
}
