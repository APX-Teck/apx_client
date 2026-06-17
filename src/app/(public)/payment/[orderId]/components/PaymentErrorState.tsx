'use client';

import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export function PaymentErrorState() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-red-100 dark:border-red-900/30 relative z-10"
    >
      <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <AlertCircle className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Link Invalid or Expired</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        We couldn't find a valid payment request for this link. It might have been altered or expired.
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200"
      >
        Return to Home
      </button>
    </motion.div>
  );
}
