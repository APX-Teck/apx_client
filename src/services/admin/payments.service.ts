import apiClient from "@/lib/api/axios";

export type PaymentStatus = "PENDING" | "SENT" | "PAID" | "FAILED" | "PARTIAL";

export interface Payment {
  id: number;
  customerId: number;
  customer: { fullName: string; email: string };
  service: { name: string };
  serviceRequestId: number | null;
  
  suggestedAmount: string | null;
  negotiatedAmount: string;
  amountPaid: string | null;

  status: PaymentStatus;
  paymentLink: string | null;
  invoiceNote: string | null;
  transactionId: string | null;

  emailSentAt: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface GetPaymentsResponse {
  success: boolean;
  data: {
    payments: Payment[];
    total: number;
    page: number;
  };
}

export const paymentsService = {
  getPayments: async (params?: { search?: string; status?: string; page?: number; limit?: number }): Promise<GetPaymentsResponse["data"]> => {
    const { data } = await apiClient.get<GetPaymentsResponse>('/payment', { params });
    return data.data;
  },

  markAsPaid: async (id: number, payload: { amountPaid: number; transactionId?: string }): Promise<Payment> => {
    const { data } = await apiClient.patch<{ success: boolean; data: Payment }>(
      `/payment/${id}/mark-paid`,
      payload
    );
    return data.data;
  },

  resendInvoiceLink: async (id: number): Promise<{ success: boolean; message: string }> => {
    // Note: Since backend currently only exposes a creation route, resend might not work 
    // unless backend adds a specific resend route. Preserving as requested.
    const { data } = await apiClient.post(
      `/payment/send-link`,
      { paymentId: id }
    );
    return data;
  },

  createPaymentLink: async (payload: { customerId: number; serviceRequestId: number; suggestedAmount?: number; negotiatedAmount: number; invoiceNote?: string }): Promise<{ success: boolean; message: string; data: Payment }> => {
    const { data } = await apiClient.post(
      `/payment/send-link`,
      payload
    );
    return data;
  }
};
