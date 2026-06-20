'use client';
import React from 'react';
import { FileText, X, Download, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { Payment } from '../../types';

interface InvoiceModalProps {
  payment: Payment;
  user: any;
  onClose: () => void;
}

export function InvoiceModal({ payment, user, onClose }: InvoiceModalProps) {
  if (!payment) return null;

  return (
    <>
      <style type="text/css" media="print">
        {`
          @page { size: auto; margin: 0; }
          body { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body * { visibility: hidden; }
          #invoice-modal-container, #invoice-modal-container * { visibility: visible; }
          #invoice-modal-container { 
            position: absolute; 
            left: 0; 
            top: 0; 
            width: 100%; 
            margin: 0; 
            padding: 0; 
            background: white; 
            min-height: 100vh;
          }
        `}
      </style>
      <div
        id="invoice-modal-container"
        className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm print:bg-white print:backdrop-blur-none print:block"
      >
        <div className="flex min-h-full items-start justify-center p-4 sm:p-6 print:p-0 print:m-0">
          <div className="my-8 sm:my-12 bg-white print:border-none rounded-2xl w-full max-w-3xl shadow-2xl relative flex flex-col animate-in fade-in zoom-in-95 duration-200 ring-1 ring-gray-200 print:ring-0 print:shadow-none print:m-0 print:w-full print:max-w-none print:rounded-none">
            {/* Header Actions (Hidden on Print) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-4 border-b border-gray-100 print:hidden bg-gray-50/90 backdrop-blur-md sticky top-0 z-20 rounded-t-2xl gap-4 sm:gap-0">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="flex items-center gap-3">
                  <div className="bg-cyan-100/50 p-2 rounded-xl">
                    <FileText className="w-5 h-5 text-cyan-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                      Invoice{' '}
                      <span className="text-gray-400 font-medium">#INV-{payment.id}</span>
                    </h2>
                  </div>
                </div>
                {/* Close button for mobile */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors sm:hidden"
                  title="Close"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="flex-1 sm:flex-none justify-center px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg transition-all shadow-sm flex items-center gap-2"
                >
                  <Download size={16} />
                  <span>Download PDF</span>
                </button>
                <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block"></div>
                {/* Close button for desktop */}
                <button
                  onClick={onClose}
                  className="hidden sm:block p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  title="Close"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Content */}
            <div
              className="p-5 sm:p-8 md:p-12 print:p-8 bg-white text-gray-900 rounded-b-2xl relative overflow-hidden print:w-[210mm] print:min-h-[297mm] mx-auto shadow-sm"
              id="invoice-content"
            >
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] grayscale select-none">
                <img
                  src="/APX%20Teck%20-%20Final%20Logo%20-01.png"
                  alt="Watermark"
                  className="w-2/3 object-contain"
                />
              </div>

              {/* Foreground Content Wrapper */}
              <div className="relative z-10 flex flex-col h-full print:h-full">
                {/* Invoice Header */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 sm:gap-6 mb-8 sm:mb-12">
                  <div className="flex flex-col justify-between">
                    <img
                      src="/APX%20Teck%20-%20Final%20Logo%20-01.png"
                      alt="APX Teck Logo"
                      className="h-20 w-auto object-contain object-left mb-6"
                    />
                    <div className="mt-auto">
                      <p className="text-gray-500 text-sm flex items-center gap-2 font-medium pl-1">
                        <Mail size={16} className="text-emerald-600" />
                        info@apxteck.com
                      </p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right w-full sm:w-auto flex flex-col justify-between">
                    <div>
                      <div className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
                        Paid Receipt
                      </div>
                      <h2 className="text-4xl sm:text-5xl font-black text-gray-200 tracking-tighter mb-4 uppercase">
                        Invoice
                      </h2>
                    </div>
                    <div className="space-y-1.5 mt-auto sm:text-right">
                      <p className="text-sm font-semibold text-gray-900 flex justify-between sm:justify-end gap-4">
                        <span>Invoice Number:</span>{' '}
                        <span className="text-gray-500 font-medium">INV-{payment.id}</span>
                      </p>
                      <p className="text-sm font-semibold text-gray-900 flex justify-between sm:justify-end gap-4">
                        <span>Date Issued:</span>{' '}
                        <span className="text-gray-500 font-medium">
                          {payment.paidAt
                            ? format(new Date(payment.paidAt), 'MMM dd, yyyy')
                            : format(new Date(payment.createdAt), 'MMM dd, yyyy')}
                        </span>
                      </p>
                      <p className="text-sm font-semibold text-gray-900 flex justify-between sm:justify-end gap-4">
                        <span>Transaction ID:</span>{' '}
                        <span className="text-gray-500 font-medium">
                          {payment.transactionId || 'N/A'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Billing Info Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12 bg-gray-50/80 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Billed To
                    </p>
                    <p className="text-xl font-bold text-gray-900 mb-1">
                      {user?.fullName || 'Customer'}
                    </p>
                    <p className="text-sm font-medium text-gray-500">{user?.email}</p>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                      Payment Details
                    </p>
                    <div className="flex items-center sm:justify-end gap-2 mb-3">
                      <span className="text-sm font-semibold text-gray-900">Status:</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100/80 border border-emerald-200 px-3 py-1 rounded-md text-xs tracking-wider">
                        PAID
                      </span>
                    </div>
                    <div className="flex flex-col sm:items-end">
                      <span className="text-sm font-semibold text-gray-900 mb-1">
                        Transaction ID:
                      </span>
                      <span className="font-mono text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 inline-block break-all max-w-full font-medium">
                        {payment.transactionId || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="border border-gray-200 rounded-3xl overflow-hidden mb-8 shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-200">
                      <tr>
                        <th className="py-4 sm:py-5 px-4 sm:px-8 font-bold text-xs text-gray-500 uppercase tracking-widest w-full">
                          Service Description
                        </th>
                        <th className="py-4 sm:py-5 px-4 sm:px-8 font-bold text-xs text-gray-500 uppercase tracking-widest text-right whitespace-nowrap">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      <tr className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 sm:py-6 px-4 sm:px-8">
                          <p className="text-lg font-bold text-gray-900">{payment.service?.name}</p>
                          <p className="text-sm font-medium text-gray-500 mt-1">
                            Service Request #{payment.serviceRequestId}
                          </p>
                          {payment.invoiceNote && (
                            <div className="mt-5 bg-emerald-50 border border-emerald-100/50 text-emerald-800 text-sm p-4 rounded-2xl flex items-start gap-3">
                              <AlertCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-emerald-900 block mb-1">
                                  Payment Note:
                                </span>
                                <span className="text-emerald-700/90 leading-relaxed">
                                  {payment.invoiceNote}
                                </span>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 sm:py-6 px-4 sm:px-8 text-right align-top">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{payment.amountPaid || payment.negotiatedAmount}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals Section */}
                <div className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-8 sm:mb-12 mt-6">
                  <div className="w-full sm:w-1/2 hidden sm:block"></div>
                  <div className="w-full sm:w-[380px] bg-gray-50 p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="flex justify-between items-center py-2.5 text-sm text-gray-600">
                      <span className="font-medium text-base">Subtotal</span>
                      <span className="font-semibold text-gray-900 text-base">
                        ₹{payment.amountPaid || payment.negotiatedAmount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2.5 text-sm text-gray-600 border-b border-gray-200 mb-5 pb-5">
                      <span className="font-medium text-base">Tax (0%)</span>
                      <span className="font-semibold text-gray-900 text-base">₹0.00</span>
                    </div>
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <span className="text-lg font-bold text-gray-900">Total Paid</span>
                      <span className="text-3xl font-black text-emerald-600 tracking-tight">
                        ₹{payment.amountPaid || payment.negotiatedAmount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto pt-10 border-t border-gray-100">
                  <div className="flex flex-col items-center justify-center">
                    <div className="inline-flex items-center justify-center gap-2 mb-4 bg-emerald-50 text-emerald-700 px-5 py-2.5 rounded-full font-bold shadow-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Payment Confirmed Successfully</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600 max-w-lg mx-auto text-center leading-relaxed">
                      Thank you for your business! If you have any questions, please contact our
                      billing team at{' '}
                      <a
                        href="mailto:info@apxteck.com"
                        className="text-emerald-600 hover:text-emerald-700 font-bold hover:underline transition-colors"
                      >
                        info@apxteck.com
                      </a>
                      .
                    </p>
                    <p className="mt-8 text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase text-center">
                      This is a computer-generated receipt and does not require a physical
                      signature.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
