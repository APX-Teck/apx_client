'use client';

interface PaymentInvoiceProps {
  payment: any; // Type as needed based on your backend response
  isPaid: boolean;
  isCancelled: boolean;
}

export function PaymentInvoice({ payment, isPaid, isCancelled }: PaymentInvoiceProps) {
  return (
    <>
      <div className="mb-6 space-y-1 text-center sm:text-left">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Hello {payment.customer?.fullName?.split(' ')[0]},
        </h2>
        {!isPaid && !isCancelled && (
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Congratulations on taking the next step with APX! We are thrilled to be working with you on <strong className="text-gray-800 dark:text-gray-200">{payment.service?.name}</strong>. Please review the details below.
          </p>
        )}
        {isPaid && (
          <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
            Thank you for your payment! We have successfully received it and our team is already on it.
          </p>
        )}
      </div>

      {/* Invoice Details Card */}
      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-4 mb-6 relative group hover:border-indigo-100 dark:hover:border-indigo-900/30 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800 border-dashed">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Service</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">{payment.service?.name}</span>
        </div>
        
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800 border-dashed">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Request ID</span>
          <span className="text-sm font-mono font-medium text-gray-900 dark:text-white bg-gray-200/50 dark:bg-gray-800 px-2 py-0.5 rounded">#{payment.serviceRequestId}</span>
        </div>

        {isPaid && payment.transactionId && (
          <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-800 border-dashed">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</span>
            <span className="text-sm font-mono font-medium text-green-600 dark:text-green-400">{payment.transactionId}</span>
          </div>
        )}

        <div className="flex justify-between items-end pt-2">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{isPaid ? 'Amount Paid' : 'Amount Payable'}</span>
          <div className="text-right">
            {payment.suggestedAmount && payment.suggestedAmount > payment.negotiatedAmount && !isPaid && (
              <span className="text-sm text-gray-400 line-through mr-2">
                ₹{payment.suggestedAmount}
              </span>
            )}
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
              ₹{payment.negotiatedAmount}
            </span>
          </div>
        </div>
      </div>

      {/* Note Section */}
      {payment.invoiceNote && !isPaid && (
        <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl p-4 mb-8">
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Note from APX</p>
          <p className="text-sm text-gray-700 dark:text-gray-300 italic">"{payment.invoiceNote}"</p>
        </div>
      )}
    </>
  );
}
