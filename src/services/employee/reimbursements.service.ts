import apiClient from '@/lib/api/axios';

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
    }
  }
}

export const reimbursementService = {
  getMyReimbursements: async (params?: { page?: number; limit?: number; status?: string; category?: string }): Promise<ReimbursementResponse> => {
    const response = await apiClient.get('/reimbursement/my', { params });
    return response.data;
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
  }
};
