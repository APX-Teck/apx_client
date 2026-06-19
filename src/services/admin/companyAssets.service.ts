import apiClient from '@/lib/api/axios';
import { extractDataArray, extractPagination, extractDataObject } from '@/lib/api/responseParser';

export interface CompanyAsset {
  id: number;
  type: string;
  title: string;
  referenceNumber?: string;
  provider?: string;
  issuedDate?: string;
  expiryDate?: string;
  renewalCost?: number;
  autoRenew: boolean;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'MAINTENANCE';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchAssetsParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  status?: string;
}

export const companyAssetsService = {
  getAllCompanyAssets: async (
    params?: FetchAssetsParams
  ): Promise<{ data: CompanyAsset[]; total: number; totalPages: number }> => {
    try {
      const response = await apiClient.get('/company-asset/getAll', { params });
      const data = extractDataArray<CompanyAsset>(response.data);
      const pag = extractPagination(response.data, data.length);
      return {
        data,
        total: pag.total,
        totalPages: pag.totalPages,
      };
    } catch (error) {
      console.error('Failed to fetch company assets', error);
      return { data: [], total: 0, totalPages: 1 };
    }
  },

  getCompanyAssetById: async (id: number): Promise<CompanyAsset | null> => {
    try {
      const response = await apiClient.get(`/company-asset/${id}`);
      return extractDataObject<CompanyAsset>(response.data);
    } catch (error) {
      console.error('Failed to fetch company asset details', error);
      return null;
    }
  },

  createCompanyAsset: async (data: Partial<CompanyAsset>): Promise<CompanyAsset> => {
    const response = await apiClient.post('/company-asset/create', data);
    return extractDataObject<CompanyAsset>(response.data) || response.data;
  },

  updateCompanyAsset: async (id: number, data: Partial<CompanyAsset>): Promise<CompanyAsset> => {
    const response = await apiClient.patch(`/company-asset/${id}`, data);
    return extractDataObject<CompanyAsset>(response.data) || response.data;
  },

  deleteCompanyAsset: async (id: number): Promise<void> => {
    await apiClient.delete(`/company-asset/${id}`);
  },
};
