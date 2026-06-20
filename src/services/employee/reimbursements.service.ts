import apiClient from '@/lib/api/axios';
import { extractDataArray, extractPagination } from '@/lib/api/responseParser';

export interface Reimbursement {
  id: number;
  userId: number;
  title: string;
  description?: string;
  amount: string;
  category: string;
  receiptUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
  reviewNote?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReimbursementResponse {
  success: boolean;
  message: string;
  data: {
    data: Reimbursement[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export const reimbursementService = {
  getMyReimbursements: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
  }): Promise<ReimbursementResponse> => {
    try {
      const response = await apiClient.get('/reimbursement/my', { params });
      const pagination = extractPagination(response.data, 0);
      return {
        success: response.data?.success ?? true,
        message: response.data?.message || '',
        data: {
          data: extractDataArray(response.data),
          pagination: {
            total: pagination.total,
            page: pagination.page,
            limit: params?.limit || 10,
            totalPages: pagination.totalPages,
            hasNextPage: pagination.page < pagination.totalPages,
            hasPrevPage: pagination.page > 1,
          },
        },
      };
    } catch (error) {
      console.error('Failed to fetch my reimbursements', error);
      return {
        success: false,
        message: 'Failed to fetch',
        data: { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 1, hasNextPage: false, hasPrevPage: false } },
      };
    }
  },

  getMyReimbursementById: async (id: string | number) => {
    const response = await apiClient.get(`/reimbursement/my/${id}`);
    return response.data;
  },

  createReimbursement: async (formData: FormData) => {
    const response = await apiClient.post('/reimbursement/create', formData);
    return response.data;
  },

  deleteReimbursement: async (id: string | number) => {
    const response = await apiClient.delete(`/reimbursement/delete/${id}`);
    return response.data;
  },
};
