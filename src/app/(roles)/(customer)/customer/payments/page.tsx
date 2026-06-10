'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Receipt, Download, Clock, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/axios';

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      const res = await api.getMyPayments();
      if (res.success && res.data) {
        setPayments(res.data);
      }
      setLoading(false);
    }
    loadPayments();
  }, []);

  const pendingPayments = payments.filter(p => p.status === 'PENDING' || p.status === 'SENT');
  const paidPayments = payments.filter(p => p.status === 'PAID');

  const amountDue = pendingPayments.reduce((sum, p) => sum + Number(p.negotiatedAmount || 0), 0);
  const lastPayment = paidPayments.length > 0 ? paidPayments[0] : null;

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading payment data...</p>
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices & Payments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">View billing history and manage pending payments.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
            <Receipt className="w-4 h-4" />
            <span>Statements</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-gray-900 to-black dark:from-[#111] dark:to-black p-8 rounded-3xl border border-gray-800 dark:border-white/5 relative overflow-hidden group shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <p className="text-gray-400 text-sm font-medium mb-1">Amount Due</p>
            <h3 className="text-4xl font-black text-white mb-6">${amountDue.toFixed(2)}</h3>
            <button 
              disabled={amountDue === 0}
              className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold px-5 py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_25px_rgba(245,158,11,0.4)]"
            >
              <CreditCard className="w-5 h-5" />
              <span>{amountDue > 0 ? 'Pay Now' : 'No Pending Dues'}</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 flex flex-col justify-between shadow-sm">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Last Payment</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {lastPayment ? `$${Number(lastPayment.amountPaid || lastPayment.negotiatedAmount).toFixed(2)}` : '$0.00'}
            </h3>
            {lastPayment ? (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Paid on {new Date(lastPayment.paidAt || lastPayment.updatedAt).toLocaleDateString()}
              </p>
            ) : (
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1 italic">
                No past payments found
              </p>
            )}
          </div>
          <button 
            disabled={!lastPayment}
            className="flex items-center justify-center gap-2 w-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold px-5 py-3 rounded-xl transition-all border border-gray-200 dark:border-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Download Receipt</span>
          </button>
        </div>
      </motion.div>

      {/* Invoice Table */}
      <motion.div variants={item} className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Invoices</h3>
        
        {payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 dark:bg-white/[0.02] rounded-2xl border border-gray-100 dark:border-white/5">
            <AlertCircle className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-gray-600 dark:text-gray-300 font-bold">No Invoices Found</p>
            <p className="text-sm text-gray-500 mt-1">You don't have any billing history or pending payments yet.</p>
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
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
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
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4 font-bold text-gray-900 dark:text-white">
                      ${Number(payment.negotiatedAmount).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      {payment.status === 'PAID' ? (
                        <span className="text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-500/20">Paid</span>
                      ) : payment.status === 'FAILED' ? (
                        <span className="text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-red-500/20">Failed</span>
                      ) : (
                        <span className="text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-500/20">Pending</span>
                      )}
                    </td>
                    <td className="py-4 pl-4 text-right">
                      {payment.status === 'PAID' ? (
                        <button className="text-gray-500 hover:text-cyan-500 transition-colors p-2 rounded-lg hover:bg-cyan-500/10 inline-flex">
                          <Download className="w-4 h-4" />
                        </button>
                      ) : (
                        <a 
                          href={payment.paymentLink || '#'} 
                          target={payment.paymentLink ? "_blank" : "_self"}
                          rel="noreferrer"
                          className="text-cyan-600 hover:text-cyan-500 font-bold px-3 py-1.5 rounded-lg hover:bg-cyan-500/10 transition-colors inline-block"
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
    </motion.div>
  );
}
