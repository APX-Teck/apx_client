import apiClient from '@/lib/api/axios';

export interface Service {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  thumbnailId: string | null;
  price: number | null;
  timeline: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceField {
  id: number;
  serviceId: number;
  fieldLabel: string;
  fieldKey: string;
  fieldType: string;
  isRequired: boolean;
  placeholder: string | null;
  options: any | null;
  isActive: boolean;
  sortOrder: number;
}

export const servicesAdminService = {
  getServices: async (params?: { page?: number; limit?: number; search?: string; isActive?: boolean }): Promise<Service[]> => {
    try {
      const response = await apiClient.get('/service/getAll', { params });
      return response.data?.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch services", error);
      throw error;
    }
  },

  getServiceById: async (id: number | string): Promise<Service | null> => {
    try {
      const response = await apiClient.get(`/service/getById/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to fetch service details", error);
      throw error;
    }
  },

  createService: async (data: FormData | Partial<Service>): Promise<Service> => {
    try {
      const response = await apiClient.post('/service/create', data);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to create service", error);
      throw error;
    }
  },

  updateService: async (id: number | string, data: FormData | Partial<Service>): Promise<Service> => {
    try {
      const response = await apiClient.put(`/service/update/${id}`, data);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to update service", error);
      throw error;
    }
  },

  toggleServiceActive: async (id: number | string, isActive: boolean): Promise<Service> => {
    try {
      const response = await apiClient.put(`/service/update/${id}`, { isActive });
      return response.data?.data;
    } catch (error) {
      console.error("Failed to toggle service status", error);
      throw error;
    }
  },

  deleteService: async (id: number | string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/service/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete service", error);
      throw error;
    }
  },

  getServiceFields: async (serviceId: number | string): Promise<ServiceField[]> => {
    try {
      const response = await apiClient.get(`/service/field/admin/getByServiceId/${serviceId}`);
      return response.data?.data || [];
    } catch (error) {
      console.error("Failed to fetch service fields", error);
      throw error;
    }
  },

  createServiceField: async (serviceId: number | string, data: Partial<ServiceField>): Promise<ServiceField> => {
    try {
      const response = await apiClient.post(`/service/field/create/${serviceId}`, data);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to create service field", error);
      throw error;
    }
  },

  updateServiceField: async (id: number | string, data: Partial<ServiceField>): Promise<ServiceField> => {
    try {
      const response = await apiClient.patch(`/service/field/update/${id}`, data);
      return response.data?.data;
    } catch (error) {
      console.error("Failed to update service field", error);
      throw error;
    }
  },

  deleteServiceField: async (id: number | string): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/service/field/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete service field", error);
      throw error;
    }
  },

  reorderServiceFields: async (payload: { id: number; sortOrder: number }[]): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.patch('/service/field/reorder', { fields: payload });
      return response.data;
    } catch (error) {
      console.error("Failed to reorder service fields", error);
      throw error;
    }
  }
};

// Aliased export for compatibility with the new UI we built which used 'servicesService'
export const servicesService = servicesAdminService;
