'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Download, AlertCircle } from 'lucide-react';
import { Payment } from '../types';

interface PaymentsTableProps {
  isLoading: boolean;
  payments: Payment[];
}

export function PaymentsTable({ isLoading, payments }: PaymentsTableProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6"
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Invoices</h3>

      {!isLoading && payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
          <p className="text-lg text-gray-900 dark:text-white font-bold mb-2">No Invoices Found</p>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            You don't have any billing history or pending payments yet. When you request services,
            your invoices will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
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
                        {payment.status === 'PAID' ? (
                          <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">
                            Paid
                          </span>
                        ) : payment.status === 'FAILED' ? (
                          <span className="text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/20">
                            Failed
                          </span>
                        ) : (
                          <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-500/20">
                            Pending
                          </span>
                        )}
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
      )}
    </motion.div>
  );
}
