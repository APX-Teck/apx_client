import apiClient from '@/lib/api/axios';

export interface Portfolio {
  id: number;
  title: string;
  slug: string;
  clientName: string;
  clientLogoUrl: string | null;
  serviceType: string;
  problem: string | null;
  solution: string | null;
  results: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  liveUrl: string | null;
  isPublished: boolean;
  sortOrder: number;
  completedAt: string | null;
  createdAt: string;
}

export const portfolioService = {
  getAllPortfoliosAdmin: async (params?: { page?: number; limit?: number; search?: string; serviceType?: string; isPublished?: boolean }) => {
    try {
      const response = await apiClient.get('/portfolio', { params });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to fetch portfolios", error);
      throw error;
    }
  },

  getPortfolioByIdAdmin: async (id: number) => {
    try {
      const response = await apiClient.get(`/portfolio/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to fetch portfolio", error);
      throw error;
    }
  },

  createPortfolio: async (formData: FormData) => {
    try {
      const response = await apiClient.post('/portfolio', formData);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to create portfolio", error);
      throw error;
    }
  },

  updatePortfolio: async (id: number, formData: FormData, galleryMode: 'append' | 'replace' = 'replace') => {
    try {
      const response = await apiClient.patch(`/portfolio/${id}?galleryMode=${galleryMode}`, formData);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to update portfolio", error);
      throw error;
    }
  },

  deletePortfolio: async (id: number) => {
    try {
      const response = await apiClient.delete(`/portfolio/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete portfolio", error);
      throw error;
    }
  },

  togglePublish: async (id: number) => {
    try {
      const response = await apiClient.patch(`/portfolio/${id}/toggle-publish`);
      return response.data;
    } catch (error) {
      console.error("Failed to toggle publish", error);
      throw error;
    }
  },
};
