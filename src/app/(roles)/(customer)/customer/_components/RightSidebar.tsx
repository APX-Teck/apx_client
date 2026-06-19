'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, ExternalLink, CreditCard, Clock } from 'lucide-react';
import Link from 'next/link';

export function RightSidebar() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={item} className="space-y-6">
      {/* Support Panel */}
      <div className="bg-gradient-to-br from-cyan-600 to-indigo-700 p-5 md:p-8 rounded-2xl md:rounded-3xl text-white shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
          <Zap className="w-24 h-24" />
        </div>

        <div className="relative z-10 space-y-4">
          <h4 className="text-xl font-bold flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-cyan-200" />
            <span>Dedicated Support</span>
          </h4>
          <p className="text-sm text-cyan-100/80 leading-relaxed font-medium">
            Need custom configurations, layout changes, or urgent deployments? Chat with our team or
            raise high-priority tickets directly.
          </p>
          <Link
            href="/contact"
            className="w-full py-3 min-h-[48px] rounded-xl bg-white text-cyan-700 hover:bg-cyan-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Contact Account Manager</span>
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-[#151515] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/customer/payments"
            className="flex flex-col items-center justify-center gap-2 p-4 min-h-[48px] rounded-2xl bg-gray-50 dark:bg-[#151515] hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all text-center group"
          >
            <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-cyan-500 transition-colors" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
              Pay Invoice
            </span>
          </Link>
          <Link
            href="/customer/requests"
            className="flex flex-col items-center justify-center gap-2 p-4 min-h-[48px] rounded-2xl bg-gray-50 dark:bg-[#151515] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all text-center group"
          >
            <Clock className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              History
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
