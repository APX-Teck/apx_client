import apiClient from '@/lib/api/axios';
import { setAccessToken, clearAccessToken } from '@/lib/api/token-manager';

export const login = async (credentials: any) => {
  try {
    const response = await apiClient.post('/auth/login', credentials);
    const { accessToken } = response.data?.data || {};
    if (accessToken) {
      setAccessToken(accessToken);
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } finally {
    clearAccessToken();
  }
};

export const refreshToken = async () => {
  try {
    const response = await apiClient.post('/auth/refresh');
    const { accessToken } = response.data?.data || {};
    if (accessToken) {
      setAccessToken(accessToken);
    }
    return response.data;
  } catch (error: any) {
    console.error("REFRESH ERROR RESPONSE:", error.response?.data);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};
