import apiClient  from '@/lib/api/axios';
import { setAccessToken, clearAccessToken } from '@/lib/api/token-manager';

export const authApi = {
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken } = response.data?.data || {};
    if (accessToken) {
      setAccessToken(accessToken);
    }
    return response.data;
  },
  
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response.data;
    } finally {
      clearAccessToken();
    }
  },

  refreshToken: async () => {
    const response = await apiClient.post('/auth/refresh');
    const { accessToken } = response.data?.data || {};
    if (accessToken) {
      setAccessToken(accessToken);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};
