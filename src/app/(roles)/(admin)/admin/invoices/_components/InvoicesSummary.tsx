import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Calendar, IndianRupee, Clock, Receipt } from 'lucide-react';
import { Invoice } from '@/app/types/invoice.types';
import { formatINR } from '../_lib/invoice.constants';

interface Props {
  invoices: Invoice[];
  isLoading?: boolean;
}

export function InvoicesSummary({ invoices, isLoading }: Props) {
  const currentMonthName = useMemo(() => format(new Date(), 'MMM yyyy'), []);

  const stats = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-indexed (1-12)

    let currentMonthCollection = 0;
    let currentMonthPaidCount = 0;
    let currentMonthPending = 0;
    let currentMonthIssuedCount = 0;

    let totalCollection = 0;
    let totalPaidCount = 0;

    let pendingAmount = 0;
    let pendingCount = 0;

    let totalInvoiced = 0;
    let activeCount = 0;

    for (const inv of invoices) {
      const amount = Number(inv.totalAmount) || 0;
      const isPaid = inv.status === 'PAID';
      const isIssued = inv.status === 'ISSUED';
      const isCancelled = inv.status === 'CANCELLED';

      if (!isCancelled) {
        totalInvoiced += amount;
        activeCount++;
      }

      if (isPaid) {
        totalCollection += amount;
        totalPaidCount++;
      } else if (isIssued) {
        pendingAmount += amount;
        pendingCount++;
      }

      // Check if invoice belongs to current month by invoiceDate
      if (inv.invoiceDate && typeof inv.invoiceDate === 'string') {
        const datePart = inv.invoiceDate.slice(0, 10);
        const [yearStr, monthStr] = datePart.split('-');
        const y = Number(yearStr);
        const m = Number(monthStr);

        if (y === currentYear && m === currentMonth) {
          if (isPaid) {
            currentMonthCollection += amount;
            currentMonthPaidCount++;
          } else if (isIssued) {
            currentMonthPending += amount;
            currentMonthIssuedCount++;
          }
        }
      }
    }

    return {
      currentMonthCollection,
      currentMonthPaidCount,
      currentMonthPending,
      currentMonthIssuedCount,
      totalCollection,
      totalPaidCount,
      pendingAmount,
      pendingCount,
      totalInvoiced,
      activeCount,
      totalCount: invoices.length,
    };
  }, [invoices]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-100/80 dark:border-white/10 rounded-2xl p-6 shadow-sm animate-pulse space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-white/10" />
              <div className="w-16 h-5 rounded-md bg-gray-200 dark:bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="w-24 h-4 rounded bg-gray-200 dark:bg-white/10" />
              <div className="w-36 h-8 rounded bg-gray-300 dark:bg-white/20" />
            </div>
            <div className="w-28 h-3 rounded bg-gray-200 dark:bg-white/10" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Current Month Collection */}
      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-100/80 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-125" />
        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <Calendar size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
            {currentMonthName}
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Current Month Collection
          </p>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {formatINR(stats.currentMonthCollection)}
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
            {stats.currentMonthPaidCount} paid {stats.currentMonthPaidCount === 1 ? 'invoice' : 'invoices'}
            {stats.currentMonthPending > 0 ? ` · ${formatINR(stats.currentMonthPending)} pending` : ''}
          </p>
        </div>
      </div>

      {/* Total Collection */}
      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-100/80 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-125" />
        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <IndianRupee size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-500/20">
            Lifetime
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Total Collection
          </p>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
            {formatINR(stats.totalCollection)}
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
            {stats.totalPaidCount} of {stats.totalCount} invoices paid
          </p>
        </div>
      </div>

      {/* Pending Amount */}
      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-100/80 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-125" />
        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200/50 dark:border-amber-500/20">
            Pending
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Pending Amount
          </p>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
            {formatINR(stats.pendingAmount)}
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
            {stats.pendingCount} unpaid {stats.pendingCount === 1 ? 'invoice' : 'invoices'}
          </p>
        </div>
      </div>

      {/* Total Invoiced */}
      <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-100/80 dark:border-white/10 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 group">
        <div className="absolute top-0 right-0 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl -mr-6 -mt-6 transition-transform duration-500 group-hover:scale-125" />
        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Receipt size={20} strokeWidth={2.5} />
          </div>
          <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20">
            {stats.activeCount} Invoiced
          </span>
        </div>
        <div className="relative z-10">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
            Total Invoiced
          </p>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {formatINR(stats.totalInvoiced)}
          </div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-2 truncate">
            {stats.totalCount} total generated
          </p>
        </div>
      </div>
    </div>
  );
}

