"use client";

import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreditCard, Search, Clock, Send, XCircle, AlertCircle, CheckCircle, Paperclip, LayoutGrid, List, Plus } from "lucide-react";
import { paymentsService, Payment } from "@/services/admin/payments.service";
import { requestsService } from "@/services/admin/requests.service";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";

export default function PaymentsPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Mark as Paid Dialog state
  const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [amountPaidInput, setAmountPaidInput] = useState("");
  const [transactionIdInput, setTransactionIdInput] = useState("");

  // Create Payment Link Dialog state
  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [createNegotiatedAmount, setCreateNegotiatedAmount] = useState("");
  const [createSuggestedAmount, setCreateSuggestedAmount] = useState("");
  const [createInvoiceNote, setCreateInvoiceNote] = useState("");

  const { data: paymentsData, isLoading, isError } = useQuery({
    queryKey: ["payments"],
    queryFn: () => paymentsService.getPayments(),
  });

  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ["serviceRequests"],
    queryFn: () => requestsService.getRequests(),
  });

  const resendMutation = useMutation({
    mutationFn: (id: number) => paymentsService.resendInvoiceLink(id),
    onSuccess: () => {
      toast.success("Payment link resent");
    },
    onError: () => {
      toast.error("Failed to resend payment link");
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: ({ id, amountPaid, transactionId }: { id: number; amountPaid: number; transactionId?: string }) =>
      paymentsService.markAsPaid(id, { amountPaid, transactionId }),
    onMutate: async ({ id, amountPaid, transactionId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["payments"] });
      const previousPayments = queryClient.getQueryData<{ payments: Payment[]; total: number; page: number }>(["payments"]);

      if (previousPayments) {
        queryClient.setQueryData(["payments"], {
          ...previousPayments,
          payments: previousPayments.payments.map((p) =>
            p.id === id ? { ...p, status: "PAID", amountPaid: amountPaid.toString(), transactionId: transactionId || null } : p
          ),
        });
      }
      return { previousPayments };
    },
    onSuccess: () => {
      toast.success("Payment marked as paid");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      closeMarkPaidDialog();
    },
    onError: (err, newTodo, context) => {
      if (context?.previousPayments) {
        queryClient.setQueryData(["payments"], context.previousPayments);
      }
      toast.error("Failed to mark as paid");
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (payload: { customerId: number; serviceRequestId: number; suggestedAmount?: number; negotiatedAmount: number; invoiceNote?: string }) =>
      paymentsService.createPaymentLink(payload),
    onSuccess: () => {
      toast.success("Payment link created successfully");
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      setIsCreateLinkOpen(false);
      // Reset form
      setSelectedRequestId("");
      setCreateNegotiatedAmount("");
      setCreateSuggestedAmount("");
      setCreateInvoiceNote("");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create payment link");
    },
  });

  const payments = paymentsData?.payments || [];

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const lowerTerm = searchTerm.toLowerCase();
    return payments.filter(
      (p) =>
        p.id.toString().includes(lowerTerm) ||
        p.customer.fullName.toLowerCase().includes(lowerTerm) ||
        p.service.name.toLowerCase().includes(lowerTerm)
    );
  }, [payments, searchTerm]);

  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "—";
    return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(Number(amount));
  };

  const getStatusBadge = (status: Payment["status"]) => {
    switch (status) {
      case "PENDING":
      case "SENT":
        return (
          <span className="inline-flex items-center gap-1 bg-[#1d4ed8] text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
            {status === "PENDING" ? <Clock size={12} /> : <Send size={12} />} {status}
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 bg-[#dc2626] text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
            <XCircle size={12} /> {status}
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1 bg-[#d97706] text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
            <AlertCircle size={12} /> {status}
          </span>
        );
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 bg-[#16a34a] text-white px-2.5 py-1 rounded-full text-xs font-semibold uppercase">
            <CheckCircle size={12} /> PAID
          </span>
        );
      default:
        return null;
    }
  };

  const openMarkPaidDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setAmountPaidInput(payment.negotiatedAmount);
    setTransactionIdInput("");
    setIsMarkPaidOpen(true);
  };

  const closeMarkPaidDialog = () => {
    setIsMarkPaidOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmMarkPaid = () => {
    if (!selectedPayment) return;
    markPaidMutation.mutate({
      id: selectedPayment.id,
      amountPaid: Number(amountPaidInput),
      transactionId: transactionIdInput || undefined,
    });
  };

  const handleCreatePaymentLink = () => {
    if (!selectedRequestId || !createNegotiatedAmount) {
      toast.error("Service Request and Negotiated Amount are required");
      return;
    }

    const request = requestsData?.find(r => r.id.toString() === selectedRequestId);
    if (!request || !request.customerId) {
      toast.error("Could not determine customer for this request");
      return;
    }

    createPaymentMutation.mutate({
      customerId: request.customerId,
      serviceRequestId: Number(selectedRequestId),
      suggestedAmount: createSuggestedAmount ? Number(createSuggestedAmount) : undefined,
      negotiatedAmount: Number(createNegotiatedAmount),
      invoiceNote: createInvoiceNote || undefined,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto text-white">
      <Toaster position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="text-blue-500 w-8 h-8" />
          <h1 className="text-2xl font-bold">Payments & Invoices</h1>
        </div>
        <p className="text-gray-400">Manage customer invoices, manually mark as paid, and track statuses.</p>
      </div>

      {/* Actions: Search, Create Link & Toggle View */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by ID, customer name, or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#161b22] border border-gray-800 rounded-md py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateLinkOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors text-sm font-medium"
          >
            <Plus size={16} />
            Create Link
          </button>
          <div className="flex items-center bg-[#161b22] border border-gray-800 rounded-md p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === "table" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-sm transition-colors ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"}`}
              title="Card View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#0d1117] border border-gray-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-gray-400">Loading payments...</div>
        ) : isError ? (
          <div className="p-8 text-center text-red-500">Failed to load payments.</div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No payments found.</div>
        ) : viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#161b22] text-gray-400 border-b border-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium">INVOICE ID</th>
                  <th className="px-4 py-3 font-medium">CUSTOMER</th>
                  <th className="px-4 py-3 font-medium">SERVICE</th>
                  <th className="px-4 py-3 font-medium">AMOUNT</th>
                  <th className="px-4 py-3 font-medium">STATUS</th>
                  <th className="px-4 py-3 font-medium text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((pay) => (
                  <tr key={pay.id} className="border-b border-gray-800/50 hover:bg-[#161b22]/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">INV-{pay.id}</div>
                      <div className="text-xs text-muted-foreground mt-0.5 text-gray-400">
                        {format(new Date(pay.createdAt), "MMM dd, yyyy")}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-bold text-white">{pay.customer.fullName}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{pay.customer.email}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{pay.service.name}</div>
                      {pay.serviceRequestId && (
                        <div className="text-xs text-blue-400 mt-0.5 hover:underline cursor-pointer">
                          Req #{pay.serviceRequestId}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white">{formatCurrency(pay.negotiatedAmount)}</div>
                      {(pay.status === "PARTIAL" || pay.status === "PAID") && (
                        <div className="text-[10px] font-bold text-[#16a34a] mt-0.5">
                          {pay.status === "PAID" ? "FULLY PAID" : `PAID: ${formatCurrency(pay.amountPaid)}`}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(pay.status)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Send Action */}
                        {["PENDING", "SENT", "FAILED"].includes(pay.status) && (
                          <button
                            onClick={() => resendMutation.mutate(pay.id)}
                            disabled={resendMutation.isPending}
                            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                            title="Resend Payment Link"
                          >
                            {resendMutation.isPending && resendMutation.variables === pay.id ? (
                              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            ) : (
                              <Send size={16} />
                            )}
                          </button>
                        )}
                        {/* Mark Paid Action */}
                        {["PENDING", "SENT", "PARTIAL", "FAILED"].includes(pay.status) && (
                          <button
                            onClick={() => openMarkPaidDialog(pay)}
                            className="p-1.5 text-gray-400 hover:text-green-500 hover:bg-green-500/10 rounded-md transition-colors"
                            title="Mark as Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        {/* Receipt Action */}
                        <button
                          disabled={pay.status !== "PAID"}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                          title="View Receipt"
                        >
                          <Paperclip size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredPayments.map((pay) => (
              <div key={pay.id} className="bg-[#161b22] border border-gray-800 rounded-lg p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-white">INV-{pay.id}</div>
                    <div className="text-xs text-gray-400">{format(new Date(pay.createdAt), "MMM dd, yyyy")}</div>
                  </div>
                  {getStatusBadge(pay.status)}
                </div>
                <div className="mb-3">
                  <div className="font-bold text-white">{pay.customer.fullName}</div>
                  <div className="text-xs text-gray-400">{pay.customer.email}</div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-white">{pay.service.name}</div>
                </div>
                <div className="mt-auto flex items-end justify-between pt-4 border-t border-gray-800/50">
                  <div>
                    <div className="text-sm font-bold text-white">{formatCurrency(pay.negotiatedAmount)}</div>
                    {(pay.status === "PARTIAL" || pay.status === "PAID") && (
                      <div className="text-[10px] font-bold text-[#16a34a]">
                        {pay.status === "PAID" ? "FULLY PAID" : `PAID: ${formatCurrency(pay.amountPaid)}`}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {["PENDING", "SENT", "FAILED"].includes(pay.status) && (
                      <button
                        onClick={() => resendMutation.mutate(pay.id)}
                        className="p-1.5 text-gray-400 hover:text-white rounded-md"
                      >
                        <Send size={16} />
                      </button>
                    )}
                    {["PENDING", "SENT", "PARTIAL", "FAILED"].includes(pay.status) && (
                      <button
                        onClick={() => openMarkPaidDialog(pay)}
                        className="p-1.5 text-gray-400 hover:text-green-500 rounded-md"
                      >
                        <CheckCircle size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mark as Paid Dialog */}
      {isMarkPaidOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Mark Payment as Paid</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Customer</p>
                <p className="font-medium text-white">{selectedPayment.customer.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Amount Due</p>
                <p className="font-medium text-white">{formatCurrency(selectedPayment.negotiatedAmount)}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount Paid (₹)</label>
                <input
                  type="number"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Transaction ID (optional)</label>
                <input
                  type="text"
                  value={transactionIdInput}
                  onChange={(e) => setTransactionIdInput(e.target.value)}
                  placeholder="e.g. TXN_123456789"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={closeMarkPaidDialog}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                disabled={markPaidMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmMarkPaid}
                disabled={markPaidMutation.isPending}
                className="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                {markPaidMutation.isPending && (
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                )}
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Payment Link Dialog */}
      {isCreateLinkOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#161b22] border border-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-4">Create Payment Link</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Service Request *</label>
                <select
                  value={selectedRequestId}
                  onChange={(e) => setSelectedRequestId(e.target.value)}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="">-- Select a Request --</option>
                  {requestsData?.map((r) => (
                    <option key={r.id} value={r.id}>
                      Req #{r.id} - {r.customerName} ({r.serviceType})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Negotiated Amount (₹) *</label>
                <input
                  type="number"
                  value={createNegotiatedAmount}
                  onChange={(e) => setCreateNegotiatedAmount(e.target.value)}
                  placeholder="Final amount to charge"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Suggested Amount (₹) (Optional)</label>
                <input
                  type="number"
                  value={createSuggestedAmount}
                  onChange={(e) => setCreateSuggestedAmount(e.target.value)}
                  placeholder="Original suggested amount"
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Invoice Note (Optional)</label>
                <textarea
                  value={createInvoiceNote}
                  onChange={(e) => setCreateInvoiceNote(e.target.value)}
                  placeholder="Add a note to the invoice..."
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md py-2 px-3 text-white focus:outline-none focus:border-blue-500 resize-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => setIsCreateLinkOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                disabled={createPaymentMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePaymentLink}
                disabled={createPaymentMutation.isPending || !selectedRequestId || !createNegotiatedAmount}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createPaymentMutation.isPending && (
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                )}
                Generate & Send Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
