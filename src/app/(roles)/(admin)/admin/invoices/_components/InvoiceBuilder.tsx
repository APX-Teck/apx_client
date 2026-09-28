'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useInvoiceFormLogic } from '../_hooks/useInvoiceFormLogic';
import { InvoiceDetailsSection } from './InvoiceDetailsSection';
import { ClientSection } from './ClientSection';
import { LineItemsEditor } from './LineItemsEditor';
import { InvoiceSummaryCard } from './InvoiceSummaryCard';
import { InvoicePreviewModal } from './InvoicePreviewModal';

export function InvoiceBuilder() {
  const logic = useInvoiceFormLogic();

  return (
    <div className="space-y-6">
      <div className="mt-6 mb-8">
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-3"
        >
          <ArrowLeft size={16} /> Back to invoices
        </Link>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-300 dark:to-white">
            New Tax Invoice
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-3 font-medium text-base ml-1">
          Fill in the details, preview the exact PDF, then confirm to generate.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          logic.onPreview();
        }}
        className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"
        noValidate
      >
        <div className="xl:col-span-2 space-y-6">
          <InvoiceDetailsSection register={logic.register} errors={logic.errors} nextNumber={logic.nextNumber} />
          <ClientSection register={logic.register} errors={logic.errors} />
          <LineItemsEditor
            register={logic.register}
            errors={logic.errors}
            fields={logic.lineItemFields}
            onAdd={logic.addLineItem}
            totals={logic.totals}
          />
        </div>
        <InvoiceSummaryCard totals={logic.totals} onPreview={logic.onPreview} isPreviewing={logic.isPreviewing} />
      </form>

      <InvoicePreviewModal
        preview={logic.preview}
        generated={logic.generated}
        isGenerating={logic.isGenerating}
        onClose={logic.closePreview}
        onConfirm={logic.confirmGenerate}
      />
    </div>
  );
}
