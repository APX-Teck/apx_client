'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Receipt } from 'lucide-react';

export function PaymentsHeader() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoices & Payments</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          View billing history and manage pending payments.
        </p>
      </div>
      <div className="flex gap-3">
        <button className="flex items-center justify-center min-h-[48px] gap-2 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-300 font-bold px-5 py-2.5 rounded-xl transition-all shadow-sm">
          <Receipt className="w-4 h-4" />
          <span>Statements</span>
        </button>
      </div>
    </motion.div>
  );
}
