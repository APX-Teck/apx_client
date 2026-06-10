export type PaymentStatus = "PENDING" | "PARTIAL" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface Payment {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  serviceId: number;
  serviceName: string;
  serviceRequestId?: number;
  
  suggestedAmount: number | null;
  negotiatedAmount: number;
  amountPaid: number | null;

  status: PaymentStatus;
  paymentLink?: string;
  invoiceNote?: string;
  paymentProofUrl?: string;
  transactionId?: string;

  emailSentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Initial Mock Data mimicking backend DB
let mockPayments: Payment[] = [
  {
    id: 1001,
    customerId: 5,
    customerName: "Ganesh Patil",
    customerEmail: "ganesh@example.com",
    serviceId: 2,
    serviceName: "E-Commerce Development",
    serviceRequestId: 101,
    suggestedAmount: 50000,
    negotiatedAmount: 45000,
    amountPaid: null,
    status: "PENDING",
    paymentLink: "https://pay.apxteck.com/inv_1001",
    invoiceNote: "Advance payment for E-commerce project initiation.",
    emailSentAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 1002,
    customerId: 12,
    customerName: "Neha Sharma",
    customerEmail: "neha.s@startup.in",
    serviceId: 4,
    serviceName: "SEO Optimization",
    serviceRequestId: 104,
    suggestedAmount: 15000,
    negotiatedAmount: 15000,
    amountPaid: 15000,
    status: "COMPLETED",
    paymentLink: "https://pay.apxteck.com/inv_1002",
    transactionId: "TXN_9876543210",
    paymentProofUrl: "https://apxteck.s3.ap-south-1.amazonaws.com/proofs/txn_1002.pdf",
    paidAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: 1003,
    customerId: 8,
    customerName: "Rahul Verma",
    customerEmail: "rahul.v@techcorp.com",
    serviceId: 1,
    serviceName: "Custom Web App",
    serviceRequestId: null,
    suggestedAmount: 120000,
    negotiatedAmount: 100000,
    amountPaid: 50000,
    status: "PARTIAL",
    paymentLink: "https://pay.apxteck.com/inv_1003",
    invoiceNote: "First milestone payment (50%).",
    transactionId: "TXN_5544332211",
    paidAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 1004,
    customerId: 21,
    customerName: "Priya Desai",
    customerEmail: "priya.design@studio.com",
    serviceId: 5,
    serviceName: "UI/UX Design",
    serviceRequestId: 110,
    suggestedAmount: 30000,
    negotiatedAmount: 25000,
    amountPaid: null,
    status: "FAILED",
    paymentLink: "https://pay.apxteck.com/inv_1004",
    invoiceNote: "Full payment for UI/UX redesign.",
    emailSentAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  }
];

// Helper to simulate network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const paymentsService = {
  getPayments: async (): Promise<Payment[]> => {
    // Simulating API call
    await delay(800);
    return [...mockPayments].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  getPaymentById: async (id: number): Promise<Payment | null> => {
    await delay(500);
    const payment = mockPayments.find((p) => p.id === id);
    return payment || null;
  },

  updatePaymentStatus: async (id: number, status: PaymentStatus): Promise<Payment> => {
    await delay(600);
    const index = mockPayments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Payment not found");

    const updatedPayment = { 
      ...mockPayments[index], 
      status, 
      updatedAt: new Date().toISOString() 
    };

    if (status === "COMPLETED" && !updatedPayment.paidAt) {
      updatedPayment.paidAt = new Date().toISOString();
      updatedPayment.amountPaid = updatedPayment.negotiatedAmount;
      if (!updatedPayment.transactionId) {
        updatedPayment.transactionId = `TXN_MANUAL_${Math.floor(Math.random() * 1000000)}`;
      }
    }

    mockPayments[index] = updatedPayment;
    return updatedPayment;
  },

  resendInvoiceLink: async (id: number): Promise<{ success: boolean; message: string }> => {
    await delay(1000);
    const index = mockPayments.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Payment not found");

    mockPayments[index] = {
      ...mockPayments[index],
      emailSentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return { success: true, message: "Invoice link sent successfully to customer email." };
  }
};
