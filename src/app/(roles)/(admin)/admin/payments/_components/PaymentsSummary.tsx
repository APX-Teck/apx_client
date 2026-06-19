import React from 'react';
import { Payment } from '@/services/admin/payments.service';

interface Props {
  payments: Payment[];
}

export function PaymentsSummary({ payments }: Props) {
  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
      Number(amount)
    );
  };

  const totalRevenue = payments
    .filter((p) => p.status === 'PAID')
    .reduce(
      (acc, curr) => acc + (Number(curr.amountPaid) || Number(curr.negotiatedAmount) || 0),
      0
    );

  const pendingAmount = payments
    .filter((p) => ['PENDING', 'SENT'].includes(p.status))
    .reduce((acc, curr) => acc + (Number(curr.negotiatedAmount) || 0), 0);

  const paidCount = payments.filter((p) => p.status === 'PAID').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wide uppercase mb-2">Total Payments</div>
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{payments.length}</div>
      </div>
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wide uppercase mb-2">Total Revenue</div>
        <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalRevenue)}</div>
      </div>
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wide uppercase mb-2">Pending Amount</div>
        <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">{formatCurrency(pendingAmount)}</div>
      </div>
      <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm border border-gray-200/80 dark:border-white/10 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="text-gray-500 dark:text-gray-400 text-sm font-bold tracking-wide uppercase mb-2">Paid Invoices</div>
        <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
          {paidCount} <span className="text-lg text-gray-400 font-medium">/ {payments.length}</span>
        </div>
      </div>
    </div>
  );
}
