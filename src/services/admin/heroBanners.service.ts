import apiClient from '@/lib/api/axios';
import { HeroBanner } from '@/app/types/home.types';

export const heroBannersService = {
  getBanners: async (params?: { isActive?: boolean; mediaType?: 'IMAGE' | 'VIDEO' }) => {
    const response = await apiClient.get('/hero-banner', { params });
    return response.data;
  },

  createBanner: async (data: FormData) => {
    const response = await apiClient.post('/hero-banner', data);
    return response.data;
  },

  updateBanner: async (id: number, data: FormData) => {
    const response = await apiClient.patch(`/hero-banner/${id}`, data);
    return response.data;
  },

  deleteBanner: async (id: number) => {
    const response = await apiClient.delete(`/hero-banner/${id}`);
    return response.data;
  },

  reorderBanners: async (items: { id: number; sortOrder: number }[]) => {
    const response = await apiClient.patch('/hero-banner/reorder', { items });
    return response.data;
  },

  toggleBannerActive: async (id: number) => {
    const response = await apiClient.patch(`/hero-banner/${id}/toggle-active`);
    return response.data;
  }
};
