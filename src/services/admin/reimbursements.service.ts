import apiClient from '@/lib/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';

export type ReimbursementStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';

export interface Reimbursement {
  id: number;
  userId: number;
  user?: { fullName: string; email?: string };
  title: string;
  description: string | null;
  amount: number;
  category: string;
  receiptUrl: string | null;
  status: ReimbursementStatus;
  reviewedById: number | null;
  reviewedBy?: { fullName: string };
  reviewNote: string | null;
  reviewedAt: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export const reimbursementsService = {
  getReimbursements: async (): Promise<Reimbursement[]> => {
    try {
      const response = await apiClient.get('/reimbursement/all');
      return extractDataArray<Reimbursement>(response.data);
    } catch (error) {
      console.error('Failed to fetch reimbursements', error);
      return [];
    }
  },

  getReimbursementById: async (id: number): Promise<Reimbursement | null> => {
    try {
      const response = await apiClient.get(`/reimbursement/admin/${id}`);
      return extractDataObject<Reimbursement>(response.data);
    } catch (error) {
      console.error('Failed to fetch reimbursement', error);
      return null;
    }
  },

  updateReimbursementStatus: async (
    id: number,
    status: ReimbursementStatus,
    reviewNote?: string
  ): Promise<Reimbursement> => {
    if (status === 'PAID') {
      const response = await apiClient.patch(`/reimbursement/paid/${id}`);
      return extractDataObject<Reimbursement>(response.data) || response.data;
    } else {
      const response = await apiClient.patch(`/reimbursement/review/${id}`, { status, reviewNote });
      return extractDataObject<Reimbursement>(response.data) || response.data;
    }
  },
};
