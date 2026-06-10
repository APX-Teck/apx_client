"use client";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { reimbursementsService, Reimbursement } from "@/services/admin/reimbursements.service";
import { format } from "date-fns";
import { 
  Banknote, CheckCircle2, Clock, XCircle, AlertCircle, 
  Search, FileText, IndianRupee, ShieldCheck
} from "lucide-react";

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
      {type === "success" && <CheckCircle2 size={18} />}
      {type === "error" && <AlertCircle size={18} />}
      {type === "loading" && <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>}
      <p className="text-sm font-bold">{message}</p>
      {type !== "loading" && (
        <button onClick={onClose} className="ml-2 hover:opacity-70"><XCircle size={16} /></button>
      )}
    </div>
  );
}

export default function ReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  // Review Modal State
  const [selectedRequest, setSelectedRequest] = useState<Reimbursement | null>(null);
  const [reviewNote, setReviewNote] = useState("");

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const fetchReimbursements = () => {
    setIsLoading(true);
    reimbursementsService.getReimbursements()
      .then(data => {
        setReimbursements(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setToast({ message: "Failed to load reimbursements", type: "error" });
        setIsLoading(false);
      });
  };

  const handleUpdateStatus = async (id: number, status: Reimbursement["status"], note?: string) => {
    try {
      setToast({ message: `Marking as ${status}...`, type: "loading" });
      await reimbursementsService.updateReimbursementStatus(id, status, note);
      setToast({ message: `Reimbursement ${status}`, type: "success" });
      setSelectedRequest(null);
      setReviewNote("");
      fetchReimbursements();
    } catch (err: any) {
      setToast({ message: err.message || "Failed to update status", type: "error" });
    }
  };

  const filteredData = reimbursements.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.userName && r.userName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: ColumnDef<Reimbursement>[] = [
    {
      header: "Employee & Request",
      cell: (r) => (
        <div>
          <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {r.userName}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 font-medium mt-1 truncate max-w-xs">{r.title}</p>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-0.5">{r.category}</p>
        </div>
      )
    },
    {
      header: "Amount",
      cell: (r) => (
        <span className="font-black text-gray-900 dark:text-white tracking-tight flex items-center text-base">
          <IndianRupee size={14} className="mr-0.5" />
          {r.amount.toFixed(2)}
        </span>
      )
    },
    {
      header: "Date",
      cell: (r) => (
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {format(new Date(r.createdAt), "MMM dd, yyyy")}
        </span>
      )
    },
    {
      header: "Status",
      cell: (r) => {
        const config = {
          PENDING: { color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10", border: "border-amber-100 dark:border-amber-500/20", icon: Clock },
          APPROVED: { color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20", icon: ShieldCheck },
          REJECTED: { color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-500/10", border: "border-red-100 dark:border-red-500/20", icon: XCircle },
          PAID: { color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20", icon: CheckCircle2 }
        }[r.status];
        const Icon = config.icon;

        return (
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-lg border tracking-wide uppercase ${config.bg} ${config.color} ${config.border}`}>
            <Icon size={12} />
            {r.status}
          </div>
        );
      }
    },
    {
      header: "Actions",
      cell: (r) => (
        <button 
          onClick={() => setSelectedRequest(r)}
          className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-colors"
        >
          Review
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Banknote size={24} />
            </div>
            Reimbursements
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Review and approve employee expense claims.
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
              placeholder="Search by employee, title, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-emerald-100 dark:border-emerald-500/20 border-t-emerald-600 dark:border-t-emerald-400 rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading requests...</p>
              </div>
            </div>
          ) : filteredData.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={filteredData} 
            />
          ) : (
            <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4 border border-gray-100 dark:border-white/5">
                <Search className="text-gray-400 dark:text-gray-500" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No requests found</h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 max-w-md">
                We couldn't find any reimbursement requests matching your search.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-[#111] h-full shadow-2xl animate-in slide-in-from-right flex flex-col">
            
            {/* Header */}
            <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                Review Request
              </h2>
              <button 
                onClick={() => { setSelectedRequest(null); setReviewNote(""); }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                <XCircle size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              <div className="text-center p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Requested Amount</p>
                <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-1">
                  <IndianRupee size={32} className="text-gray-400" />
                  {selectedRequest.amount.toFixed(2)}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Request Details</p>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-sm font-medium text-gray-500">Employee</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedRequest.userName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-sm font-medium text-gray-500">Category</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedRequest.category}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-sm font-medium text-gray-500">Title</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white text-right max-w-[200px] truncate">{selectedRequest.title}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Description</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                  {selectedRequest.description || "No description provided."}
                </p>
              </div>

              {selectedRequest.receiptUrl && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Attachments</p>
                  <a href={selectedRequest.receiptUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 transition-colors group">
                    <FileText size={20} />
                    <span className="font-bold text-sm group-hover:underline">View Receipt Document</span>
                  </a>
                </div>
              )}

              {/* Review Note */}
              {selectedRequest.status === "PENDING" && (
                <div className="pt-4">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Admin Note (Optional)</label>
                  <textarea 
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Enter reason for rejection or approval note..."
                    className="w-full p-4 bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-h-[100px]"
                  />
                </div>
              )}
              
              {/* Existing Note */}
              {selectedRequest.reviewNote && selectedRequest.status !== "PENDING" && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Admin Note</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 p-4 rounded-2xl">
                    {selectedRequest.reviewNote}
                  </p>
                </div>
              )}

            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-[#151515]">
              {selectedRequest.status === "PENDING" ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleUpdateStatus(selectedRequest.id, "REJECTED", reviewNote)}
                    className="flex-1 px-4 py-3 bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 rounded-xl font-bold text-sm transition-colors text-gray-700 dark:text-gray-300"
                  >
                    Reject
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedRequest.id, "APPROVED", reviewNote)}
                    className="flex-1 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm"
                  >
                    Approve
                  </button>
                </div>
              ) : selectedRequest.status === "APPROVED" ? (
                <button 
                  onClick={() => handleUpdateStatus(selectedRequest.id, "PAID")}
                  className="w-full px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> Mark as Paid
                </button>
              ) : (
                <button 
                  onClick={() => setSelectedRequest(null)}
                  className="w-full px-4 py-3 bg-gray-200 dark:bg-white/10 hover:bg-gray-300 dark:hover:bg-white/20 text-gray-800 dark:text-white rounded-xl font-bold text-sm transition-colors"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
