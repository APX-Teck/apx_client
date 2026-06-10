import apiClient from "@/lib/api/axios";
import { Ad } from "@/app/types/ad.types";

export interface PaginationParams {
  page?: number;
  limit?: number;
  adType?: string;
  placement?: string;
  isActive?: boolean;
  dateStatus?: "active" | "expired" | "scheduled";
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
      const response = await apiClient.get("/advertisement", { params });
      return response.data?.data || { data: [], pagination: {} };
    } catch (error) {
      console.error("Failed to fetch ads:", error);
      throw error;
    }
  },

  getAdById: async (id: number): Promise<Ad> => {
    try {
      const response = await apiClient.get(`/advertisement/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to fetch ad ${id}:`, error);
      throw error;
    }
  },

  createAd: async (formData: FormData): Promise<Ad> => {
    try {
      const response = await apiClient.post("/advertisement", formData);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to create ad:", error);
      throw error;
    }
  },

  updateAd: async (id: number, formData: FormData): Promise<Ad> => {
    try {
      const response = await apiClient.patch(`/advertisement/${id}`, formData);
      return response.data?.data;
    } catch (error) {
      console.error(`Failed to update ad ${id}:`, error);
      throw error;
    }
  },

  toggleAdActive: async (id: number): Promise<{ id: number; isActive: boolean }> => {
    try {
      const response = await apiClient.patch(`/advertisement/${id}/toggle-active`);
      return response.data?.data;
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
};
