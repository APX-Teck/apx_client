import apiClient from '@/lib/api/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';
import { Faq } from '@/app/types/faq.types';

export const faqsService = {
  getFaqs: async (params?: { category?: string; isPublished?: boolean }): Promise<Faq[]> => {
    const response = await apiClient.get('/faq', { params });
    return extractDataArray<Faq>(response.data);
  },

  createFaq: async (data: {
    question: string;
    answer: string;
    category?: string;
    isPublished?: boolean;
    sortOrder?: number;
  }): Promise<Faq> => {
    const response = await apiClient.post('/faq', data);
    return extractDataObject<Faq>(response.data) || response.data;
  },

  updateFaq: async (
    id: number,
    data: Partial<{
      question: string;
      answer: string;
      category: string;
      isPublished: boolean;
      sortOrder: number;
    }>
  ): Promise<Faq> => {
    const response = await apiClient.patch(`/faq/${id}`, data);
    return extractDataObject<Faq>(response.data) || response.data;
  },

  deleteFaq: async (id: number) => {
    const response = await apiClient.delete(`/faq/${id}`);
    return response.data;
  },

  reorderFaqs: async (items: { id: number; sortOrder: number }[]) => {
    const response = await apiClient.patch('/faq/reorder', { items });
    return response.data;
  },

  toggleFaqActive: async (id: number, currentStatus: boolean): Promise<Faq> => {
    const response = await apiClient.patch(`/faq/${id}`, { isPublished: !currentStatus });
    return extractDataObject<Faq>(response.data) || response.data;
  },
};
