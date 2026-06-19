'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle } from 'lucide-react';
import { Payment } from '../types';

interface PaymentsTableProps {
  isLoading: boolean;
  payments: Payment[];
}

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === 'PAID') {
    return (
      <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">
        Paid
      </span>
    );
  }
  if (status === 'FAILED') {
    return (
      <span className="text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/20">
        Failed
      </span>
    );
  }
  return (
    <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-500/20">
      Pending
    </span>
  );
}

export function PaymentsTable({ isLoading, payments }: PaymentsTableProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4 sm:space-y-6"
    >
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Recent Invoices</h3>

      {!isLoading && payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-base sm:text-lg text-gray-900 dark:text-white font-bold mb-2">No Invoices Found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
            You don't have any billing history or pending payments yet. When you request services,
            your invoices will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Mobile Card Layout */}
          <div className="sm:hidden space-y-3">
            {isLoading
              ? [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 animate-pulse space-y-3"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
                      <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
                      <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16"></div>
                    </div>
                  </div>
                ))
              : payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm text-cyan-600 dark:text-cyan-400 font-bold">
                        INV-{payment.id.toString().padStart(5, '0')}
                      </span>
                      <PaymentStatusBadge status={payment.status} />
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {payment.service?.name || 'Custom Service'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        ₹{Number(payment.negotiatedAmount).toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(payment.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-100 dark:border-white/5">
                      {payment.status === 'PAID' ? (
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-sm font-semibold text-gray-500 hover:text-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-colors">
                          <Download className="w-4 h-4" />
                          <span>Download Receipt</span>
                        </button>
                      ) : (
                        <a
                          href={payment.paymentLink || '#'}
                          target={payment.paymentLink ? '_blank' : '_self'}
                          rel="noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2.5 min-h-[44px] text-sm font-bold text-cyan-600 hover:text-cyan-500 rounded-lg hover:bg-cyan-500/10 transition-colors"
                        >
                          Pay Now
                        </a>
                      )}
                    </div>
                  </div>
                ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 pr-4">Invoice ID</th>
                  <th className="py-4 px-4">Service</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Amount</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 pl-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium text-gray-800 dark:text-gray-200">
                {isLoading
                  ? [1, 2, 3, 4].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 pr-4">
                          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-32"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-24"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-16"></div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="h-6 bg-gray-200 dark:bg-white/10 rounded w-20"></div>
                        </td>
                        <td className="py-4 pl-4">
                          <div className="h-8 bg-gray-200 dark:bg-white/10 rounded w-16 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  : payments.map((payment) => (
                      <tr
                        key={payment.id}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="py-4 pr-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          INV-{payment.id.toString().padStart(5, '0')}
                        </td>
                        <td className="py-4 px-4 font-semibold text-gray-700 dark:text-gray-300">
                          {payment.service?.name || 'Custom Service'}
                        </td>
                        <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                          {new Date(payment.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                          ₹{Number(payment.negotiatedAmount).toFixed(2)}
                        </td>
                        <td className="py-4 px-4">
                          <PaymentStatusBadge status={payment.status} />
                        </td>
                        <td className="py-4 pl-4 text-right">
                          {payment.status === 'PAID' ? (
                            <button className="text-gray-500 hover:text-cyan-500 transition-colors p-2 min-w-[44px] min-h-[48px] items-center justify-center rounded-lg hover:bg-cyan-500/10 inline-flex">
                              <Download className="w-4 h-4" />
                            </button>
                          ) : (
                            <a
                              href={payment.paymentLink || '#'}
                              target={payment.paymentLink ? '_blank' : '_self'}
                              rel="noreferrer"
                              className="text-cyan-600 hover:text-cyan-500 font-bold px-3 py-1.5 min-h-[48px] inline-flex items-center justify-center rounded-lg hover:bg-cyan-500/10 transition-colors"
                            >
                              Pay
                            </a>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </motion.div>
  );
}
