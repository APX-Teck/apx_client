'use client';

import { motion } from 'framer-motion';
import { usePaymentCheckoutLogic } from './hooks/usePaymentCheckoutLogic';
import { PaymentHeader } from './components/PaymentHeader';
import { PaymentInvoice } from './components/PaymentInvoice';
import { PaymentActions } from './components/PaymentActions';
import { PaymentLoadingState } from './components/PaymentLoadingState';
import { PaymentErrorState } from './components/PaymentErrorState';

interface PaymentClientProps {
  orderId: string;
}

export function PaymentClient({ orderId }: PaymentClientProps) {
  const {
    payment,
    isLoading,
    isError,
    isProcessing,
    justPaid,
    isPaid,
    isCancelled,
    handlePayment,
  } = usePaymentCheckoutLogic(orderId);

  if (isLoading) {
    return <PaymentLoadingState />;
  }

  if (isError || !payment) {
    return <PaymentErrorState />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-[520px] relative z-10"
    >
      <div className="bg-white dark:bg-[#12121a] rounded-[2rem] shadow-2xl dark:shadow-indigo-900/10 border border-gray-100 dark:border-gray-800/60 overflow-hidden backdrop-blur-xl">
        
        <PaymentHeader isPaid={isPaid} isCancelled={isCancelled} />

        <div className="p-8">
          <PaymentInvoice payment={payment} isPaid={isPaid} isCancelled={isCancelled} />
          
          <PaymentActions 
            payment={payment}
            isPaid={isPaid}
            isCancelled={isCancelled}
            justPaid={justPaid}
            isProcessing={isProcessing}
            handlePayment={handlePayment}
          />
        </div>
        
        <div className="bg-gray-50 dark:bg-[#15151e] p-4 text-center border-t border-gray-100 dark:border-gray-800/60">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            &copy; {new Date().getFullYear()} APX Teck. All rights reserved.<br/>
            If you have any questions, please <a href="mailto:support@apxteck.com" className="text-indigo-500 hover:underline">contact our support team</a>.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
