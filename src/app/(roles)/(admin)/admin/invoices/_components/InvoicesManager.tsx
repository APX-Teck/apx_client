'use client';

import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Invoice } from '@/app/types/invoice.types';
import { useInvoicesLogic } from '../_hooks/useInvoicesLogic';
import { InvoicesTable } from './InvoicesTable';

interface Props {
  initialInvoices: Invoice[];
}

export function InvoicesManager({ initialInvoices }: Props) {
  const logic = useInvoicesLogic(initialInvoices);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-6">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
              Tax Invoices
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-base ml-1">
            GST-compliant invoices generated as PDF and stored on the CDN.
          </p>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 active:scale-[0.98]"
        >
          <Plus size={18} strokeWidth={2.5} /> New Invoice
        </Link>
      </div>

      <InvoicesTable
        invoices={logic.filteredInvoices}
        isLoading={logic.isLoading}
        setSearchTerm={logic.setSearchTerm}
        statusFilter={logic.statusFilter}
        setStatusFilter={logic.setStatusFilter}
        updatingId={logic.updatingId}
        onUpdateStatus={logic.updateStatus}
      />
    </div>
  );
}
