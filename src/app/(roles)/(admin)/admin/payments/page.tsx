"use client";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { paymentsService, Payment } from "@/services/admin/payments.service";
import { format } from "date-fns";
import { CreditCard, CheckCircle, Clock, XCircle, AlertCircle, Search, PlayCircle } from "lucide-react";

/* ─── tiny inline toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "loading"; onClose: () => void }) {
  useEffect(() => {
    if (type === "loading") return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose, type]);

  const bg = type === "success" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20" : type === "error" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:border-red-500/20" : "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20";
  return (
    <div className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-lg flex items-center gap-3 animate-in slide-in-from-bottom-5 ${bg}`}>
      {type === "success" && <CheckCircle size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = () => {
    setIsLoading(true);
    paymentsService.getPayments()
      .then(data => {
        setPayments(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setToast({ message: "Failed to load payments", type: "error" });
        setIsLoading(false);
      });
  };

  const handleUpdateStatus = async (id: number, status: Payment["status"]) => {
    try {
      setToast({ message: "Updating status...", type: "loading" });
      await paymentsService.updatePaymentStatus(id, status);
      setToast({ message: `Invoice #${id} marked as ${status}`, type: "success" });
      fetchPayments(); // refresh data
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update status", type: "error" });
    }
  };

  const handleResendLink = async (id: number) => {
    try {
      setToast({ message: "Sending email...", type: "loading" });
      await paymentsService.resendInvoiceLink(id);
      setToast({ message: `Payment link sent for Invoice #${id}`, type: "success" });
      fetchPayments(); // refresh data
    } catch (err: any) {
      setToast({ message: err.message || "Failed to send link", type: "error" });
    }
  };

  const filteredPayments = payments.filter(pay => 
    pay.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pay.id.toString().includes(searchTerm) ||
    pay.serviceName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);
  };

  const columns: ColumnDef<Payment>[] = [
    {
      header: "Invoice ID",
      cell: (pay) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">INV-{pay.id}</p>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-0.5">{format(new Date(pay.createdAt), "MMM dd, yyyy")}</p>
        </div>
      )
    },
    {
      header: "Customer",
      cell: (pay) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{pay.customerName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{pay.customerEmail}</p>
        </div>
      )
    },
    {
      header: "Service",
      accessorKey: "serviceName",
      cell: (pay) => (
        <div>
          <span className="font-medium text-gray-700 dark:text-gray-300">{pay.serviceName}</span>
          {pay.serviceRequestId && (
            <p className="text-xs text-indigo-500 dark:text-indigo-400 font-medium">Req #{pay.serviceRequestId}</p>
          )}
        </div>
      )
    },
    {
      header: "Amount",
      cell: (pay) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(pay.negotiatedAmount)}</p>
          {pay.amountPaid && pay.amountPaid < pay.negotiatedAmount ? (
            <p className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-500/10 inline-block px-1.5 py-0.5 rounded mt-1">
              PAID: {formatCurrency(pay.amountPaid)}
            </p>
          ) : pay.amountPaid === pay.negotiatedAmount ? (
             <p className="text-[10px] font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 inline-block px-1.5 py-0.5 rounded mt-1">
              FULLY PAID
            </p>
          ) : null}
        </div>
      )
    },
    {
      header: "Status",
      cell: (pay) => {
        const statusConfig = {
          PENDING: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: Clock },
          PARTIAL: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: PlayCircle },
          COMPLETED: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle },
          FAILED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle },
          REFUNDED: { color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-100 dark:bg-gray-500/10", border: "border-gray-200 dark:border-gray-500/20", icon: AlertCircle },
        };
        const config = statusConfig[pay.status];
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-lg border ${config.bg} ${config.color} ${config.border}`}>
            <Icon size={14} />
            {pay.status}
          </div>
        );
      }
    },
    {
      header: "Actions",
      cell: (pay) => (
        <div className="flex items-center gap-2 relative group">
           <button 
             onClick={() => handleResendLink(pay.id)}
             disabled={pay.status === 'COMPLETED'}
             title="Resend Payment Link"
             className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-500"
           >
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13"></path><path d="M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
           </button>
           
           {pay.status !== 'COMPLETED' && (
             <button 
               onClick={() => handleUpdateStatus(pay.id, "COMPLETED")}
               title="Mark as Paid"
               className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
             >
               <CheckCircle size={18} />
             </button>
           )}

           {pay.paymentProofUrl && (
             <a 
               href={pay.paymentProofUrl} 
               target="_blank" 
               rel="noreferrer"
               title="View Proof"
               className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
             >
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
             </a>
           )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <CreditCard size={24} />
            </div>
            Payments & Invoices
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Manage customer invoices, manually mark as paid, and track statuses.
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50 dark:bg-[#1a1a1a]/50">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by ID, customer name, or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-indigo-100 dark:border-indigo-500/20 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading invoices...</p>
              </div>
            </div>
          ) : filteredPayments.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredPayments} 
            />
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Search className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No invoices found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any payments matching "{searchTerm}". Try adjusting your search.
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
