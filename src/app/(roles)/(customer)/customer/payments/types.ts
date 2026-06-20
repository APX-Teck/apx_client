export interface Payment {
  id: number;
  status: 'PENDING' | 'SENT' | 'PAID' | 'FAILED';
  negotiatedAmount: number;
  amountPaid?: number;
  createdAt: string;
  paidAt?: string;
  updatedAt: string;
  paymentLink?: string;
  transactionId?: string;
  invoiceNote?: string;
  serviceRequestId?: number;
  service?: {
    name: string;
  };
}
