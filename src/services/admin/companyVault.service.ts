import apiClient from '@/lib/api/axios';
import { extractDataArray, extractPagination, extractDataObject } from '@/lib/api/responseParser';

export interface CompanyVaultDocument {
  id: number;
  key: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  fileId?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FetchVaultParams {
  page?: number;
  limit?: number;
  search?: string;
  fileType?: string;
}

export const companyVaultService = {
  getAllCompanyVault: async (
    params?: FetchVaultParams
  ): Promise<{ data: CompanyVaultDocument[]; total: number; totalPages: number }> => {
    try {
      const response = await apiClient.get('/company-vault/getAll', { params });
      const data = extractDataArray<CompanyVaultDocument>(response.data);
      const pag = extractPagination(response.data, data.length);
      return {
        data,
        total: pag.total,
        totalPages: pag.totalPages,
      };
    } catch (error) {
      console.error('Failed to fetch company vault documents', error);
      return { data: [], total: 0, totalPages: 1 };
    }
  },

  getCompanyVaultById: async (id: number): Promise<CompanyVaultDocument | null> => {
    try {
      const response = await apiClient.get(`/company-vault/${id}`);
      return extractDataObject<CompanyVaultDocument>(response.data);
    } catch (error) {
      console.error('Failed to fetch company vault document', error);
      return null;
    }
  },

  createCompanyVault: async (formData: FormData): Promise<CompanyVaultDocument> => {
    const response = await apiClient.post('/company-vault/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractDataObject<CompanyVaultDocument>(response.data) || response.data;
  },

  updateCompanyVault: async (id: number, formData: FormData): Promise<CompanyVaultDocument> => {
    const response = await apiClient.patch(`/company-vault/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return extractDataObject<CompanyVaultDocument>(response.data) || response.data;
  },

  deleteCompanyVault: async (id: number): Promise<void> => {
    await apiClient.delete(`/company-vault/${id}`);
  },
};
