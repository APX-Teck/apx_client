import apiClient from '@/lib/api/axios';

export const publicJobService = {
  createApplication: async (data: any): Promise<any> => {
    // The backend route is POST /job/applications/create
    const response = await apiClient.post('/job/applications/create', data);
    return response.data;
  },

  getPublicJobListings: async (params?: any): Promise<any> => {
    const response = await apiClient.get('/job/public/getAll', { params });
    return response.data;
  },
};
