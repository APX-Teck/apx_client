import React from 'react';
import { ReimbursementItem } from '../_hooks/useDashboardLogic';

interface DashboardReimbursementsTableProps {
  reimbursements: ReimbursementItem[];
}

export function DashboardReimbursementsTable({
  reimbursements,
}: DashboardReimbursementsTableProps) {
  const getStatusBadge = (status: ReimbursementItem['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded bg-amber-500/10 text-amber-400">
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded bg-blue-500/10 text-blue-400">
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500/10 text-red-400">
            Rejected
          </span>
        );
      case 'PAID':
        return (
          <span className="px-2 py-0.5 text-xs font-bold rounded bg-emerald-500/10 text-emerald-400">
            Paid
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-6 shadow-sm overflow-hidden">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">Reimbursement History</h3>
      <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
        {/* Mobile Card Layout */}
        <div className="sm:hidden space-y-3 mt-4">
          {reimbursements.map((rmb) => (
            <div
              key={rmb.id}
              className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-sm text-indigo-500 dark:text-indigo-400 font-bold">
                  RMB-{rmb.id}
                </span>
                {getStatusBadge(rmb.status)}
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {rmb.title}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                  ₹{rmb.amount.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {rmb.category}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-white/5 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Created:</span>
                <span className="font-mono">{new Date(rmb.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {reimbursements.length === 0 && (
            <div className="py-8 text-center text-gray-500 text-sm">
              No reimbursement history available.
            </div>
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden sm:block">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium">
              {reimbursements.map((rmb) => (
                <tr
                  key={rmb.id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1a1a1a] transition-colors group"
                >
                  <td className="py-4 px-4 font-mono text-indigo-500 dark:text-indigo-400 font-bold">
                    RMB-{rmb.id}
                  </td>
                  <td className="py-4 px-4 text-gray-900 dark:text-gray-200">{rmb.title}</td>
                  <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                    ₹{rmb.amount.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{rmb.category}</td>
                  <td className="py-4 px-4">{getStatusBadge(rmb.status)}</td>
                  <td className="py-4 px-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                    {new Date(rmb.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {reimbursements.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No reimbursement history available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
