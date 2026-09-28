import React, { useMemo } from 'react';
import { format } from 'date-fns';
import { Ban, CheckCircle, ExternalLink, FileText, XCircle } from 'lucide-react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import { Invoice, InvoiceStatus } from '@/app/types/invoice.types';
import { formatINR } from '../_lib/invoice.constants';
import { InvoiceStatusFilter } from '../_hooks/useInvoicesLogic';

const STATUS_STYLES: Record<InvoiceStatus, { className: string; icon: React.ReactNode }> = {
  ISSUED: {
    className:
      'bg-blue-50/80 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    icon: <FileText size={14} />,
  },
  PAID: {
    className:
      'bg-emerald-50/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    icon: <CheckCircle size={14} />,
  },
  CANCELLED: {
    className:
      'bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
    icon: <XCircle size={14} />,
  },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm ${style.className}`}
    >
      {style.icon} {status}
    </span>
  );
}

const formatDate = (value: string) => format(new Date(value.slice(0, 10) + 'T00:00:00'), 'dd MMM yyyy');

const FILTER_OPTIONS = [
  { label: 'All statuses', value: 'ALL' },
  { label: 'Issued', value: 'ISSUED' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

interface Props {
  invoices: Invoice[];
  isLoading: boolean;
  setSearchTerm: (term: string) => void;
  statusFilter: InvoiceStatusFilter;
  setStatusFilter: (status: InvoiceStatusFilter) => void;
  updatingId: number | null;
  onUpdateStatus: (invoice: Invoice, status: InvoiceStatus) => void;
}

export function InvoicesTable({
  invoices,
  isLoading,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  updatingId,
  onUpdateStatus,
}: Props) {
  const columns: ColumnDef<Invoice>[] = useMemo(
    () => [
      {
        header: 'Invoice',
        cell: (invoice) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              {formatDate(invoice.invoiceDate)} · Due {formatDate(invoice.dueDate)}
            </p>
          </div>
        ),
      },
      {
        header: 'Client',
        cell: (invoice) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{invoice.clientName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{invoice.clientGSTIN ?? 'Unregistered'}</p>
          </div>
        ),
      },
      {
        header: 'Amount',
        cell: (invoice) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{formatINR(invoice.totalAmount)}</p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
              Tax {formatINR(Number(invoice.cgst) + Number(invoice.sgst) + Number(invoice.igst))}
            </p>
          </div>
        ),
      },
      {
        header: 'Status',
        cell: (invoice) => <InvoiceStatusBadge status={invoice.status} />,
      },
      {
        header: 'Actions',
        cell: (invoice) => <InvoiceActions invoice={invoice} updatingId={updatingId} onUpdateStatus={onUpdateStatus} />,
      },
    ],
    [updatingId, onUpdateStatus]
  );

  return (
    <>
      <div className="hidden sm:block">
        <DataTable
          data={invoices}
          columns={columns}
          searchPlaceholder="Search by invoice no., client or GSTIN..."
          onSearch={setSearchTerm}
          isLoading={isLoading}
          filterOptions={FILTER_OPTIONS}
          currentFilter={statusFilter}
          onFilterChange={(value) => setStatusFilter(value as InvoiceStatusFilter)}
        />
      </div>

      <div className="sm:hidden space-y-4">
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4 flex gap-2">
          <input
            type="text"
            className="flex-1 min-w-0 px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
            placeholder="Search invoices..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatusFilter)}
            className="px-3 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm text-gray-900 dark:text-white"
          >
            {FILTER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
        ) : invoices.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold bg-white/80 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
            No invoices found.
          </div>
        ) : (
          invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl rounded-2xl border border-gray-100/80 dark:border-white/10 p-4 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{invoice.invoiceNumber}</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">{formatDate(invoice.invoiceDate)}</p>
                </div>
                <InvoiceStatusBadge status={invoice.status} />
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-xl flex justify-between items-center gap-2">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{invoice.clientName}</p>
                <p className="font-extrabold text-indigo-600 dark:text-indigo-400 shrink-0">
                  {formatINR(invoice.totalAmount)}
                </p>
              </div>
              <InvoiceActions invoice={invoice} updatingId={updatingId} onUpdateStatus={onUpdateStatus} />
            </div>
          ))
        )}
      </div>
    </>
  );
}

interface ActionsProps {
  invoice: Invoice;
  updatingId: number | null;
  onUpdateStatus: (invoice: Invoice, status: InvoiceStatus) => void;
}

function InvoiceActions({ invoice, updatingId, onUpdateStatus }: ActionsProps) {
  const isUpdating = updatingId === invoice.id;
  return (
    <div className="flex items-center gap-2">
      <a
        href={invoice.invoiceUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="p-2 rounded-xl text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30"
        title="Open PDF"
      >
        <ExternalLink size={18} strokeWidth={2.5} />
      </a>
      {invoice.status === 'ISSUED' && (
        <>
          <button
            type="button"
            disabled={isUpdating}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(invoice, 'PAID');
            }}
            className="p-2 rounded-xl text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30 disabled:opacity-50"
            title="Mark as Paid"
          >
            <CheckCircle size={18} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            disabled={isUpdating}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateStatus(invoice, 'CANCELLED');
            }}
            className="p-2 rounded-xl text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-500/10 dark:hover:bg-red-500/20 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/30 disabled:opacity-50"
            title="Cancel Invoice"
          >
            <Ban size={18} strokeWidth={2.5} />
          </button>
        </>
      )}
    </div>
  );
}
