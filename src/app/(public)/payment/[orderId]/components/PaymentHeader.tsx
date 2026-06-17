'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentHeaderProps {
  isPaid: boolean;
  isCancelled: boolean;
}

export function PaymentHeader({ isPaid, isCancelled }: PaymentHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-center overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
      
      <AnimatePresence mode="wait">
        {isPaid ? (
          <motion.div 
            key="paid-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 ring-2 ring-white/50">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Successful</h1>
          </motion.div>
        ) : isCancelled ? (
          <motion.div 
            key="cancelled-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-4 ring-2 ring-white/50">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Payment Cancelled</h1>
          </motion.div>
        ) : (
          <motion.div 
            key="pending-header"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10"
          >
            <h1 className="text-2xl font-bold text-white tracking-tight">Complete Your Payment</h1>
            <p className="text-indigo-100 mt-2 font-medium">Secure Checkout via Razorpay</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
