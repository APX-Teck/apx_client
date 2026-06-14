"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { reimbursementsService, Reimbursement } from "@/services/admin/reimbursements.service";
import { format } from "date-fns";
import { 
  ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, 
  IndianRupee, Calendar, User as UserIcon, Paperclip, FileText,
  Mail, MessageSquare, ExternalLink
} from "lucide-react";
import { Toast } from "../_components/Toast";

export default function ReimbursementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [reimbursement, setReimbursement] = useState<Reimbursement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewNote, setReviewNote] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "loading" } | null>(null);

  useEffect(() => {
    fetchReimbursement();
  }, [params]);

  const fetchReimbursement = () => {
    if (params?.id) {
      setIsLoading(true);
      reimbursementsService.getReimbursementById(Number(params.id)).then(data => {
        setReimbursement(data);
        if (data?.reviewNote) {
          setReviewNote(data.reviewNote);
        }
        setIsLoading(false);
      }).catch(err => {
        setToast({ message: "Failed to fetch reimbursement details", type: "error" });
        setIsLoading(false);
      });
    }
  };

  const handleUpdateStatus = async (status: Reimbursement["status"]) => {
    if (!reimbursement) return;
    try {
      setToast({ message: `Updating status to ${status.toLowerCase()}...`, type: "loading" });
      await reimbursementsService.updateReimbursementStatus(reimbursement.id, status, reviewNote);
      setToast({ message: `Status updated to ${status.replace("_", " ")}`, type: "success" });
      fetchReimbursement();
    } catch (error: any) {
      setToast({ message: error.message || "Failed to update status", type: "error" });
    }
  };

  if (isLoading || !reimbursement) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5"><Clock size={12} /> Pending</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5"><CheckCircle2 size={12} /> Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5"><XCircle size={12} /> Rejected</span>;
      case 'PAID':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5"><CheckCircle2 size={12} /> Paid</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-500 border border-gray-500/20">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Visualizer */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/admin/reimbursements')}
              className="p-2 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                {reimbursement.title}
                {getStatusBadge(reimbursement.status)}
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                Submitted by {reimbursement.user?.fullName} • {format(new Date(reimbursement.createdAt), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            {reimbursement.status === "PENDING" && (
              <>
                <button 
                  onClick={() => handleUpdateStatus("REJECTED")}
                  className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors border border-red-100 dark:border-red-500/20"
                >
                  Reject Claim
                </button>
                <button 
                  onClick={() => handleUpdateStatus("APPROVED")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Approve Claim
                </button>
              </>
            )}

            {reimbursement.status === "APPROVED" && (
              <button 
                onClick={() => handleUpdateStatus("PAID")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Mark as Paid
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Details & Receipt */}
        <div className="xl:col-span-2 space-y-6">
          {/* Claim Summary */}
          <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
            <div className="text-center p-6 bg-gray-50 dark:bg-[#1a1a1a] rounded-3xl border border-gray-100 dark:border-white/5">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Requested Amount</p>
              <p className="text-4xl font-black text-gray-900 dark:text-white flex items-center justify-center gap-1">
                <IndianRupee size={32} className="text-gray-400" />
                {Number(reimbursement.amount).toFixed(2)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={16} /> Description & Category
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-medium">Category</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white mt-1">{reimbursement.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Claim ID</p>
                  <p className="text-sm font-bold text-indigo-500 mt-1">RMB-{reimbursement.id}</p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 dark:bg-[#151515] p-5 rounded-2xl border border-gray-100 dark:border-white/5">
                <p className="text-gray-800 dark:text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {reimbursement.description || "No description provided for this reimbursement claim."}
                </p>
              </div>
            </div>
            
            {reimbursement.receiptUrl && (
              <div className="border-t border-gray-100 dark:border-white/5 pt-6">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Paperclip size={16} /> Attached Receipt
                </h3>
                <div className="rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden bg-gray-50 dark:bg-[#151515]">
                  {reimbursement.receiptUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) ? (
                    <div className="relative w-full overflow-hidden flex flex-col items-center p-4">
                      <img src={reimbursement.receiptUrl} alt="Receipt" className="max-h-96 object-contain rounded-lg shadow-sm" />
                      <a 
                        href={reimbursement.receiptUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="mt-4 bg-white dark:bg-[#222] text-xs font-bold text-gray-700 dark:text-gray-300 px-4 py-2 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 shadow-sm flex items-center gap-2 transition-colors"
                      >
                        <ExternalLink size={14} /> Open Full Resolution Image
                      </a>
                    </div>
                  ) : (
                    <a 
                      href={reimbursement.receiptUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex items-center justify-between p-5 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                          <FileText size={20} />
                        </div>
                        <span className="font-bold text-sm group-hover:underline">View Receipt Document (PDF/File)</span>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-indigo-500" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Submitter & Review Details */}
        <div className="space-y-6">
          {/* Submitter Details */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <UserIcon size={16} /> Employee Details
            </h2>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-lg">
                {reimbursement.user?.fullName ? reimbursement.user.fullName.charAt(0).toUpperCase() : '?'}
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{reimbursement.user?.fullName}</p>
                <p className="text-xs text-gray-500">APX Staff Member</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-400 animate-pulse" />
                <span className="font-medium text-gray-700 dark:text-gray-300">{reimbursement.user?.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Admin Action Notes */}
          <div className="bg-white dark:bg-[#111111] rounded-3xl p-6 border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <MessageSquare size={16} /> Admin Review Note
            </h2>
            
            {reimbursement.status === "PENDING" ? (
              <>
                <textarea 
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  placeholder="Explain approval decision or rejection reason (optional)..."
                  className="w-full bg-gray-50 dark:bg-[#151515] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm font-medium rounded-xl p-4 min-h-[120px] focus:ring-2 focus:ring-indigo-500 resize-none outline-none"
                />
                <p className="text-xs text-gray-500">This note will be included in the email notification sent to the employee.</p>
              </>
            ) : (
              <div className="bg-gray-50 dark:bg-[#151515] p-4 rounded-xl border border-gray-100 dark:border-white/5 text-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Saved Note</p>
                <p className="text-gray-700 dark:text-gray-300 font-medium italic">
                  {reimbursement.reviewNote || "No review note provided."}
                </p>
                {reimbursement.reviewedBy && (
                  <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-white/5 text-[11px] font-medium text-gray-500">
                    Reviewed by {reimbursement.reviewedBy.fullName} 
                    {reimbursement.reviewedAt && ` on ${format(new Date(reimbursement.reviewedAt), "MMM dd, yyyy")}`}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
