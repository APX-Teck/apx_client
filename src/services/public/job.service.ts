import apiClient from '@/lib/api/axios';

export const publicJobService = {
  createApplication: async (data: any): Promise<any> => {
    // The backend route is POST /job/applications/create
    const response = await apiClient.post('/job/applications/create', data);
    return response.data;
  },
};
