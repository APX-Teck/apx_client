"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Receipt, 
  Send, 
  CheckCircle2, 
  UploadCloud, 
  FileText, 
  Loader2, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { reimbursementService, Reimbursement } from "@/services/employee/reimbursements.service";

export default function EmployeeReimbursementsPage() {
  const [reimbursements, setReimbursements] = useState<Reimbursement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  
  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Travel");
  const [description, setDescription] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReimbursements = async (pageNum = 1) => {
    setIsLoading(true);
    try {
      const res = await reimbursementService.getMyReimbursements({ page: pageNum, limit: 10 });
      if (res.success) {
        setReimbursements(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setPage(res.data.pagination.page);
      }
    } catch (err: any) {
      console.error("Failed to fetch reimbursements", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReimbursements();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setReceiptFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    if (!title || !amount || !category) {
      setError("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("amount", amount);
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (receiptFile) formData.append("receipt", receiptFile);

      const res = await reimbursementService.createReimbursement(formData);
      if (res.success) {
        setSuccessMessage("Reimbursement claim submitted successfully!");
        setTitle("");
        setAmount("");
        setCategory("Travel");
        setDescription("");
        setReceiptFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        fetchReimbursements(1); // Refresh list
        setTimeout(() => setSuccessMessage(""), 4000);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to submit reimbursement claim.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this pending claim?")) return;
    try {
      await reimbursementService.deleteReimbursement(id);
      fetchReimbursements(page);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to delete claim.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20">Pending</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20">Rejected</span>;
      case 'PAID':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20">Paid</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-500 dark:text-gray-400 border border-gray-500/20">{status}</span>;
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div className="bg-white dark:bg-[#111] p-8 rounded-3xl border border-gray-100 dark:border-white/5 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none"></div>
        <div className="space-y-2 relative z-10">
          <div className="flex items-center gap-2 text-amber-500 font-semibold text-sm">
            <Receipt className="w-4 h-4 text-amber-500" />
            <span>Reimbursement Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Manage & Apply Claims
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xl leading-relaxed">
            Submit your business-related expenses for approval and track the status of your past reimbursement claims.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm sticky top-24">
            <div className="border-b border-gray-100 dark:border-white/10 pb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                New Claim Request
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Fill out the details to request a reimbursement.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title / Purpose *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Client Lunch Meeting"
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount (₹) *</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 1500"
                    step="0.01"
                    min="0.1"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-3 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium cursor-pointer text-gray-900 dark:text-white"
                  >
                    <option value="Travel">Travel</option>
                    <option value="Meals & Entertainment">Meals & Ent.</option>
                    <option value="Software/SaaS">Software/SaaS</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description (Optional)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide any additional context..."
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm font-medium text-gray-900 dark:text-white resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Receipt/Proof (Optional)</label>
                <div 
                  className="w-full relative border-2 border-dashed border-gray-200 dark:border-white/10 rounded-xl p-4 flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer overflow-hidden"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf"
                  />
                  {receiptFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="w-6 h-6 text-indigo-500" />
                      <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{receiptFile.name}</span>
                      <span className="text-[10px] text-gray-500 font-medium">Click to change</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <UploadCloud className="w-6 h-6 text-gray-400" />
                      <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Upload Receipt</span>
                      <span className="text-[10px] text-gray-400 font-medium">JPG, PNG, PDF up to 5MB</span>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 text-red-500 dark:text-red-400 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <AnimatePresence>
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-xl text-xs font-semibold flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(245,158,11,0.39)] active:scale-[0.98] transition-all disabled:opacity-75 disabled:active:scale-100 cursor-pointer mt-4"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                ) : (
                  <><Send className="w-4 h-4" /> Submit Claim</>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 p-6 sm:p-8 rounded-3xl shadow-sm overflow-hidden h-full">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Claim History</h3>
              <span className="text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full">
                {reimbursements.length} Records
              </span>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading your claims...</p>
              </div>
            ) : reimbursements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center">
                  <Receipt className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white">No Claims Found</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm">You haven't submitted any reimbursement requests yet. Submit a new claim from the form.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {reimbursements.map((rmb) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={rmb.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-amber-500/20 transition-all gap-4 group"
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between sm:justify-start gap-3">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate pr-2 max-w-[200px] sm:max-w-xs">{rmb.title}</p>
                        {getStatusBadge(rmb.status)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                        <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-mono font-bold tracking-tight">#{rmb.id}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">{rmb.category}</span>
                        <span>•</span>
                        <span>{new Date(rmb.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      {rmb.reviewNote && rmb.status !== 'PENDING' && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#222] p-2 rounded-lg mt-2 font-medium italic inline-block">
                          Note: {rmb.reviewNote}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                      <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight">₹{Number(rmb.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                      <div className="flex items-center gap-2">
                        {rmb.receiptUrl && (
                          <a 
                            href={rmb.receiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[11px] font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded-md"
                          >
                            <FileText className="w-3 h-3" />
                            View Proof
                          </a>
                        )}
                        {rmb.status === 'PENDING' && (
                          <button
                            onClick={() => handleDelete(rmb.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
                            title="Cancel Claim"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/10 mt-6">
                    <button 
                      disabled={page === 1}
                      onClick={() => fetchReimbursements(page - 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-xs font-semibold text-gray-500">Page {page} of {totalPages}</span>
                    <button 
                      disabled={page === totalPages}
                      onClick={() => fetchReimbursements(page + 1)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 disabled:opacity-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
