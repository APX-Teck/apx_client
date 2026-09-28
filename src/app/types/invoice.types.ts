export type InvoiceStatus = 'ISSUED' | 'PAID' | 'CANCELLED';
export type SupplyType = 'INTRA_STATE' | 'INTER_STATE';

export interface InvoiceLineItemInput {
  description: string;
  details?: string;
  sac: string;
  quantity: number;
  rate: number;
  gstRate: number;
}

export interface InvoiceLineItem extends InvoiceLineItemInput {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface InvoicePayload {
  invoiceNumber?: string;
  invoiceDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  placeOfSupplyCode: string;
  reverseCharge: boolean;
  taxInclusive: boolean;
  clientName: string;
  clientGSTIN?: string;
  clientAddress: string;
  clientStateCode: string;
  lineItems: InvoiceLineItemInput[];
  paymentId?: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  financialYear: string;
  invoiceDate: string;
  dueDate: string;
  placeOfSupplyCode: string;
  supplyType: SupplyType;
  reverseCharge: boolean;
  taxInclusive: boolean;
  clientName: string;
  clientGSTIN: string | null;
  clientAddress: string;
  clientStateCode: string;
  lineItems: InvoiceLineItem[];
  subtotal: string;
  cgst: string;
  sgst: string;
  igst: string;
  totalAmount: string;
  invoiceUrl: string;
  invoiceFileId: string;
  status: InvoiceStatus;
  paymentId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTotals {
  supplyType: SupplyType;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  totalAmount: number;
}

export interface InvoicePreview {
  invoiceNumber: string;
  html: string;
  totals: InvoiceTotals & { amountInWords: string };
}

export interface GenerateInvoiceResult {
  invoiceUrl: string;
  invoice: Invoice;
}
