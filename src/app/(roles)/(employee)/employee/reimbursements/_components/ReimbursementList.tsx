'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, ExternalLink, FileText, Trash2, Loader2 } from 'lucide-react';
import { Reimbursement } from '@/services/employee/reimbursements.service';

interface ReimbursementListProps {
  reimbursements: Reimbursement[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  handleDelete: (id: number) => void;
  fetchReimbursements: (page: number) => void;
}

export function ReimbursementList({
  reimbursements,
  isLoading,
  page,
  totalPages,
  handleDelete,
  fetchReimbursements,
}: ReimbursementListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">
            Rejected
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">
            Paid
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden h-full">
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Claim History</h3>
          <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
            {reimbursements.length} Records
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Loading your claims...
            </p>
          </div>
        ) : reimbursements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
              <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">No Claims Found</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
                You haven't submitted any reimbursement requests yet. Submit a new claim from the
                form.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {reimbursements.map((rmb) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={rmb.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-amber-500/20 transition-all gap-4 group"
              >
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between sm:justify-start gap-3">
                    <p className="font-bold text-sm text-gray-900 dark:text-white truncate pr-2 max-w-[200px] sm:max-w-xs">
                      {rmb.title}
                    </p>
                    {getStatusBadge(rmb.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-bold tracking-tight">
                      RMB-{rmb.id}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">{rmb.category}</span>
                    <span>•</span>
                    <span>
                      {new Date(rmb.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  {rmb.reviewNote && rmb.status !== 'PENDING' && (
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222] p-2 rounded-lg mt-2 font-medium italic inline-block">
                      Note: {rmb.reviewNote}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                  <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
                    ₹{Number(rmb.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                    {rmb.receiptUrl && (
                      <div className="flex-1">
                        {rmb.receiptUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) ? (
                          <a
                            href={rmb.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative block w-full h-16 rounded-lg overflow-hidden group/img border border-gray-200 dark:border-white/10"
                          >
                            <img
                              src={rmb.receiptUrl}
                              alt="Receipt Preview"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/30 transition-colors flex items-center justify-center">
                              <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover/img:opacity-100 transition-opacity" />
                            </div>
                          </a>
                        ) : (
                          <a
                            href={rmb.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-16 text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 flex flex-col items-center justify-center gap-1 bg-indigo-500/5 rounded-lg border border-indigo-100 dark:border-indigo-500/20 transition-colors px-4"
                          >
                            <FileText className="w-4 h-4" />
                            View Doc
                          </a>
                        )}
                      </div>
                    )}
                    {rmb.status === 'PENDING' && (
                      <button
                        onClick={() => handleDelete(rmb.id)}
                        className="min-w-[48px] min-h-[48px] flex items-center justify-center p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                        title="Cancel Claim"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-6">
                <button
                  disabled={page === 1}
                  onClick={() => fetchReimbursements(page - 1)}
                  className="min-h-[48px] flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => fetchReimbursements(page + 1)}
                  className="min-h-[48px] flex items-center justify-center px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
