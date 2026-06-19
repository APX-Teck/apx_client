import React, { useMemo } from 'react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import { Payment } from '@/services/admin/payments.service';
import { format } from 'date-fns';
import { Send, CheckCircle, Paperclip, Clock, XCircle, AlertCircle } from 'lucide-react';

interface Props {
  payments: Payment[];
  resendPending: boolean;
  resendVariables: number | null;
  onResend: (id: number) => void;
  onMarkPaid: (payment: Payment) => void;
  onOpenInvoice: (payment: Payment) => void;
  setSearchTerm: (term: string) => void;
  isLoading?: boolean;
}

export function PaymentsTable({
  payments,
  resendPending,
  resendVariables,
  onResend,
  onMarkPaid,
  onOpenInvoice,
  setSearchTerm,
  isLoading,
}: Props) {
  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(
      Number(amount)
    );
  };

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'PENDING':
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm bg-blue-50/80 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20">
            {status === 'PENDING' ? <Clock size={14} /> : <Send size={14} />} {status}
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm bg-red-50/80 text-red-700 border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
            <XCircle size={14} /> {status}
          </span>
        );
      case 'PARTIAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm bg-amber-50/80 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20">
            <AlertCircle size={14} /> {status}
          </span>
        );
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold rounded-lg uppercase tracking-wider border shadow-sm backdrop-blur-sm bg-emerald-50/80 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
            <CheckCircle size={14} /> PAID
          </span>
        );
      default:
        return null;
    }
  };

  const columns: ColumnDef<Payment>[] = useMemo(
    () => [
      {
        header: 'Invoice ID',
        cell: (pay) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">INV-{pay.id}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">
              {format(new Date(pay.createdAt), 'MMM dd, yyyy')}
            </p>
            {pay.transactionId && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 tracking-wider uppercase">
                TXN: {pay.transactionId}
              </p>
            )}
          </div>
        ),
      },
      {
        header: 'Customer',
        cell: (pay) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{pay.customer.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{pay.customer.email}</p>
          </div>
        ),
      },
      {
        header: 'Service',
        cell: (pay) => (
          <div>
            <span className="font-extrabold text-[12px] uppercase tracking-wider bg-gray-100/80 dark:bg-white/5 px-3.5 py-1.5 rounded-lg text-gray-800 dark:text-gray-200 border border-gray-200/50 dark:border-white/10 shadow-sm backdrop-blur-sm">
              {pay.service.name}
            </span>
            {pay.serviceRequestId && (
              <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-semibold">
                Req #{pay.serviceRequestId}
              </p>
            )}
          </div>
        ),
      },
      {
        header: 'Amount',
        cell: (pay) => (
          <div>
            <p className="font-bold text-gray-900 dark:text-white">
              {formatCurrency(pay.negotiatedAmount)}
            </p>
            {(pay.status === 'PARTIAL' || pay.status === 'PAID') && (
              <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500 mt-1 uppercase tracking-wider">
                {pay.status === 'PAID'
                  ? 'FULLY PAID'
                  : `PAID: ${formatCurrency(pay.amountPaid)}`}
              </p>
            )}
          </div>
        ),
      },
      {
        header: 'Status',
        cell: (pay) => getStatusBadge(pay.status),
      },
      {
        header: 'Actions',
        cell: (pay) => (
          <div className="flex items-center gap-2">
            {['PENDING', 'SENT', 'FAILED'].includes(pay.status) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onResend(pay.id);
                }}
                disabled={resendPending}
                className="p-2 rounded-xl text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 transition-all border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 disabled:opacity-50"
                title="Resend Payment Link"
              >
                {resendPending && resendVariables === pay.id ? (
                  <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-600 rounded-full animate-spin" />
                ) : (
                  <Send size={18} strokeWidth={2.5} />
                )}
              </button>
            )}
            {['PENDING', 'SENT', 'PARTIAL', 'FAILED'].includes(pay.status) && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkPaid(pay);
                }}
                className="p-2 rounded-xl text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/30"
                title="Mark as Paid"
              >
                <CheckCircle size={18} strokeWidth={2.5} />
              </button>
            )}
            <button
              disabled={pay.status !== 'PAID'}
              onClick={(e) => {
                e.stopPropagation();
                onOpenInvoice(pay);
              }}
              className="p-2 rounded-xl text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-white/5 dark:hover:bg-white/10 transition-all border border-transparent hover:border-gray-200 dark:hover:border-white/10 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-transparent"
              title="View Receipt / Invoice"
            >
              <Paperclip size={18} strokeWidth={2.5} />
            </button>
          </div>
        ),
      },
    ],
    [resendPending, resendVariables, onResend, onMarkPaid, onOpenInvoice]
  );

  return (
    <DataTable
      data={payments}
      columns={columns}
      searchPlaceholder="Search by ID, customer, or service..."
      onSearch={setSearchTerm}
      isLoading={isLoading}
    />
  );
}
