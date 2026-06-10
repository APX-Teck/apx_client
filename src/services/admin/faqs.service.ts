import apiClient from '@/lib/api/axios';
import { Faq } from '@/app/types/faq.types';

export const faqsService = {
  getFaqs: async (params?: { category?: string; isPublished?: boolean }) => {
    const response = await apiClient.get('/faq', { params });
    return response.data;
  },

  createFaq: async (data: { question: string; answer: string; category?: string; isPublished?: boolean; sortOrder?: number }) => {
    const response = await apiClient.post('/faq', data);
    return response.data;
  },

  updateFaq: async (id: number, data: Partial<{ question: string; answer: string; category: string; isPublished: boolean; sortOrder: number }>) => {
    const response = await apiClient.patch(`/faq/${id}`, data);
    return response.data;
  },

  deleteFaq: async (id: number) => {
    const response = await apiClient.delete(`/faq/${id}`);
    return response.data;
  },

  reorderFaqs: async (items: { id: number; sortOrder: number }[]) => {
    const response = await apiClient.patch('/faq/reorder', { items });
    return response.data;
  },

  toggleFaqActive: async (id: number, currentStatus: boolean) => {
    const response = await apiClient.patch(`/faq/${id}`, { isPublished: !currentStatus });
    return response.data;
  }
};
