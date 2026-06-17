'use client';

import { Loader2, CreditCard, ChevronRight, ShieldCheck, CheckCircle } from 'lucide-react';

interface PaymentActionsProps {
  payment: any; // Using any or a defined type
  isPaid: boolean;
  isCancelled: boolean;
  justPaid: boolean;
  isProcessing: boolean;
  handlePayment: () => void;
}

export function PaymentActions({
  payment,
  isPaid,
  isCancelled,
  justPaid,
  isProcessing,
  handlePayment,
}: PaymentActionsProps) {
  return (
    <div className="mt-8">
      {!isPaid && !isCancelled ? (
        <div className="space-y-4">
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="group relative w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-medium py-4 px-6 rounded-2xl transition-all duration-200 shadow-xl shadow-gray-900/10 dark:shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay Securely Now</span>
                <ChevronRight className="w-5 h-5 absolute right-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
          <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            Payments are secure and encrypted
          </p>
        </div>
      ) : justPaid ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-2xl p-8 text-center mt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Payment Successful!</h3>
          <p className="text-green-700 dark:text-green-400 font-medium text-sm">
            Thank you! We have successfully received your payment. Our team will start working on it shortly.
          </p>
        </div>
      ) : isPaid ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-2xl p-8 text-center mt-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-2">Payment Already Completed!</h3>
          <p className="text-green-700 dark:text-green-400 font-medium text-sm">
            This request was successfully paid on {new Date(payment.paidAt!).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
          </p>
        </div>
      ) : (
        <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl p-4 text-center">
          <p className="text-red-700 dark:text-red-400 font-medium text-sm">
            This payment link has been cancelled. Please contact support if you need assistance.
          </p>
        </div>
      )}
    </div>
  );
}
