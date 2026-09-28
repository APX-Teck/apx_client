import React from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { InvoiceTotals } from '@/app/types/invoice.types';
import { formatINR } from '../_lib/invoice.constants';

interface Props {
  totals: InvoiceTotals;
  onPreview: () => void;
  isPreviewing: boolean;
}

export function InvoiceSummaryCard({ totals, onPreview, isPreviewing }: Props) {
  const intraState = totals.supplyType === 'INTRA_STATE';
  const rows = [
    { label: 'Sub Total (Taxable)', value: totals.subtotal },
    ...(intraState
      ? [
          { label: 'CGST', value: totals.cgst },
          { label: 'SGST', value: totals.sgst },
        ]
      : [{ label: 'IGST', value: totals.igst }]),
  ];

  return (
    <aside className="xl:sticky xl:top-6 bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-[2rem] border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-indigo-400" />
      <div className="p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">Summary</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {intraState ? 'Intra-State supply (CGST + SGST)' : 'Inter-State supply (IGST)'}
          </p>
        </div>

        <dl className="space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-sm">
              <dt className="font-semibold text-gray-500 dark:text-gray-400">{row.label}</dt>
              <dd className="font-bold text-gray-900 dark:text-white">{formatINR(row.value)}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10">
            <dt className="text-sm font-extrabold uppercase tracking-wider text-gray-900 dark:text-white">Total</dt>
            <dd className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {formatINR(totals.totalAmount)}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onPreview}
          disabled={isPreviewing}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-6 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          {isPreviewing ? <Loader2 size={18} className="animate-spin" /> : <Eye size={18} strokeWidth={2.5} />}
          {isPreviewing ? 'Rendering preview...' : 'Preview Invoice'}
        </button>
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          Nothing is saved until you confirm in the preview.
        </p>
      </div>
    </aside>
  );
}
