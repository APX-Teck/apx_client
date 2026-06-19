import apiClient from '@/lib/api/axios';
import { extractDataArray, extractPagination, extractDataObject } from '@/lib/api/responseParser';
import { Ad, AdPricingSlot } from '@/app/types/ad.types';

export interface PaginationParams {
  page?: number;
  limit?: number;
  adType?: string;
  placement?: string;
  isActive?: boolean;
  dateStatus?: 'active' | 'expired' | 'scheduled';
}

export interface PaginatedAds {
  data: Ad[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const adsService = {
  getAds: async (params?: PaginationParams): Promise<PaginatedAds> => {
    try {
      const response = await apiClient.get('/advertisement', { params });
      const data = extractDataArray<Ad>(response.data);
      const pag = extractPagination(response.data, data.length);
      return { 
        data, 
        pagination: {
          total: pag.total,
          page: pag.page,
          limit: params?.limit || 10,
          totalPages: pag.totalPages,
          hasNextPage: pag.page < pag.totalPages,
          hasPrevPage: pag.page > 1
        }
      };
    } catch (error) {
      console.error('Failed to fetch ads:', error);
      throw error;
    }
  },

  getAdById: async (id: number): Promise<Ad> => {
    try {
      const response = await apiClient.get(`/advertisement/${id}`);
      return extractDataObject<Ad>(response.data) as Ad;
    } catch (error) {
      console.error(`Failed to fetch ad ${id}:`, error);
      throw error;
    }
  },

  createAd: async (formData: FormData): Promise<Ad> => {
    try {
      const response = await apiClient.post('/advertisement', formData);
      return extractDataObject<Ad>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to create ad:', error);
      throw error;
    }
  },

  updateAd: async (id: number, formData: FormData): Promise<Ad> => {
    try {
      const response = await apiClient.patch(`/advertisement/${id}`, formData);
      return extractDataObject<Ad>(response.data) || response.data;
    } catch (error) {
      console.error(`Failed to update ad ${id}:`, error);
      throw error;
    }
  },

  toggleAdActive: async (id: number): Promise<{ id: number; isActive: boolean }> => {
    try {
      const response = await apiClient.patch(`/advertisement/${id}/toggle-active`);
      return extractDataObject<any>(response.data) || response.data;
    } catch (error) {
      console.error(`Failed to toggle ad status ${id}:`, error);
      throw error;
    }
  },

  deleteAd: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/advertisement/${id}`);
    } catch (error) {
      console.error(`Failed to delete ad ${id}:`, error);
      throw error;
    }
  },

  getPricingSlots: async (): Promise<AdPricingSlot[]> => {
    try {
      const response = await apiClient.get('/advertisement/pricing-slots');
      return extractDataArray<AdPricingSlot>(response.data);
    } catch (error) {
      console.error('Failed to fetch pricing slots:', error);
      throw error;
    }
  },

  createPricingSlot: async (data: Partial<AdPricingSlot>): Promise<AdPricingSlot> => {
    try {
      const response = await apiClient.post('/advertisement/createPricingSlot', data);
      return extractDataObject<AdPricingSlot>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to create pricing slot:', error);
      throw error;
    }
  },

  updatePricingSlot: async (id: number, data: Partial<AdPricingSlot>): Promise<AdPricingSlot> => {
    try {
      const response = await apiClient.patch(`/advertisement/pricing-slots/${id}`, data);
      return extractDataObject<AdPricingSlot>(response.data) || response.data;
    } catch (error) {
      console.error(`Failed to update pricing slot ${id}:`, error);
      throw error;
    }
  },

  deletePricingSlot: async (id: number): Promise<void> => {
    try {
      await apiClient.delete(`/advertisement/deletePricingSlot/${id}`);
    } catch (error) {
      console.error(`Failed to delete pricing slot ${id}:`, error);
      throw error;
    }
  },
};
