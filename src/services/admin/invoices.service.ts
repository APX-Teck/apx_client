import apiClient from '@/lib/api/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';
import {
  GenerateInvoiceResult,
  Invoice,
  InvoicePayload,
  InvoicePreview,
  InvoiceStatus,
} from '@/app/types/invoice.types';

const BASE = '/admin/invoices';

export interface FetchInvoicesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: InvoiceStatus;
}

export const invoicesService = {
  getInvoices: async (params?: FetchInvoicesParams): Promise<Invoice[]> => {
    try {
      const response = await apiClient.get(BASE, { params });
      return extractDataArray<Invoice>(response.data);
    } catch (error) {
      console.error('Failed to fetch invoices', error);
      return [];
    }
  },

  getNextNumber: async (invoiceDate: string): Promise<string | null> => {
    try {
      const response = await apiClient.get(`${BASE}/next-number`, { params: { invoiceDate } });
      return response.data?.data?.invoiceNumber ?? null;
    } catch (error) {
      console.error('Failed to fetch next invoice number', error);
      return null;
    }
  },

  preview: async (payload: InvoicePayload): Promise<InvoicePreview> => {
    const response = await apiClient.post(`${BASE}/preview`, payload);
    return extractDataObject<InvoicePreview>(response.data) as InvoicePreview;
  },

  generate: async (payload: InvoicePayload): Promise<GenerateInvoiceResult> => {
    const response = await apiClient.post(`${BASE}/generate`, payload);
    return extractDataObject<GenerateInvoiceResult>(response.data) as GenerateInvoiceResult;
  },

  updateStatus: async (id: number, status: InvoiceStatus): Promise<Invoice> => {
    const response = await apiClient.patch(`${BASE}/${id}/status`, { status });
    return extractDataObject<Invoice>(response.data) as Invoice;
  },
};
