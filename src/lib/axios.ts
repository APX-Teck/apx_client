//hello
import apiClient from '@/lib/api/axios';
import { Ad } from '@/app/types/ad.types';
import { setAccessToken } from '@/lib/api/token-manager';
import { StatsOverview } from '@/app/types/analytics.types';
import { BlogPost, BlogComment } from '@/app/types/blog.types';
import { Faq } from '@/app/types/faq.types';
import { HeroBanner } from '@/app/types/home.types';
import { Portfolio } from '@/app/types/portfolio.types';
import { Service, ServiceField } from '@/app/types/service.types';
import { Testimonial } from '@/app/types/testimonial.types';
import { TeamMember } from '@/app/types/user.types';

export type MockApi = {
  fetchAds: (...args: any[]) => Promise<Ad[]>;
  fetchBlogComments: (...args: any[]) => Promise<BlogComment[]>;
  fetchBlogBySlug: (...args: any[]) => Promise<BlogPost | null>;
  fetchBlogs: (...args: any[]) => Promise<BlogPost[]>;
  fetchCategories: (...args: any[]) => Promise<any[]>;
  fetchFaqs: (...args: any[]) => Promise<Faq[]>;
  fetchHeroBanners: (...args: any[]) => Promise<HeroBanner[]>;
  fetchPortfolios: (...args: any[]) => Promise<Portfolio[]>;
  fetchPortfolioBySlug: (...args: any[]) => Promise<Portfolio | null>;
  fetchPricingSlots: (...args: any[]) => Promise<any[]>;
  fetchServiceFields: (...args: any[]) => Promise<ServiceField[]>;
  fetchServices: (...args: any[]) => Promise<Service[]>;
  fetchStats: (...args: any[]) => Promise<StatsOverview>;
  fetchSystemLogs: (...args: any[]) => Promise<any[]>;
  fetchTeamMembers: (...args: any[]) => Promise<TeamMember[]>;
  fetchTestimonials: (...args: any[]) => Promise<Testimonial[]>;
  getAllCommentsAdmin: (...args: any[]) => Promise<any>;
  deleteBlogComment: (...args: any[]) => Promise<any>;
  moderateComment: (id: number, status: 'APPROVED' | 'REJECTED') => Promise<any>;
  forgotPassword: (...args: any[]) => Promise<any>;
  getLikeStatus: (...args: any[]) => Promise<any>;
  incrementBlogView: (...args: any[]) => Promise<any>;
  likeBlogPost: (...args: any[]) => Promise<any>;
  login: (...args: any[]) => Promise<any>;
  logout: (...args: any[]) => Promise<any>;
  getCurrentUser: (...args: any[]) => Promise<any>;
  refreshToken: (...args: any[]) => Promise<any>;
  register: (...args: any[]) => Promise<any>;
  resendVerification: (...args: any[]) => Promise<any>;
  resetPassword: (data: { email: string; token: string; newPassword: string }) => Promise<any>;
  submitBlogComment: (...args: any[]) => Promise<any>;
  submitEnquiry: (data: any) => Promise<any>;
  submitServiceRequest: (serviceId: number, formData: FormData) => Promise<any>;
  getMyRequests: (...args: any[]) => Promise<any>;
  getMyRequestById: (...args: any[]) => Promise<any>;
  getMyPayments: (...args: any[]) => Promise<any>;
  updateMyRequest: (...args: any[]) => Promise<any>;
  cancelRequest: (...args: any[]) => Promise<any>;
  updateProfile: (...args: any[]) => Promise<any>;
  verifyEmail: (token: string, email: string) => Promise<any>;
} & typeof apiClient;

export const api = {
  ...apiClient,
  login: async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    if (response.data?.data?.accessToken) {
      setAccessToken(response.data.data.accessToken);
    }
    return {
      success: response.data.success,
      user: response.data.data?.user,
      message: response.data.message,
    };
  },
  register: async (data: any) => {
    const response = await apiClient.post('/auth/createUser', data);
    return {
      success: response.data.success,
      user: response.data.data, // assuming createUser returns user in data
      message: response.data.message,
    };
  },
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return {
      success: response.data.success,
      user: response.data.data?.user,
      message: response.data.message,
    };
  },
  // Keep the other mocked methods as empty arrays/objects to prevent crashes
  fetchAds: async (placement?: string) => {
    try {
      const url = placement
        ? `/advertisement/public?placement=${placement}`
        : '/advertisement/public';
      const response = await apiClient.get(url);
      return response.data?.data || [];
    } catch (error: any) {
      if (error?.response?.status !== 500 && error?.response?.status !== 404) {
        console.error('Failed to fetch ads:', error);
      }
      return [];
    }
  },
  fetchStats: async () => ({}) as unknown as StatsOverview,
  fetchBlogComments: async (slug: string) => {
    try {
      const response = await apiClient.get(`/blog/public/posts/${slug}`);
      return response.data?.data?.comments || [];
    } catch (error) {
      console.error('Failed to fetch blog comments:', error);
      return [];
    }
  },
  fetchBlogBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(`/blog/public/posts/${slug}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Failed to fetch blog by slug:', error);
      return null;
    }
  },
  fetchBlogs: async (params = { limit: 1000 }) => {
    try {
      const response = await apiClient.get('/blog/public/posts', { params });
      const resData = response.data;
      if (Array.isArray(resData)) return resData;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData?.data?.data)) return resData.data.data;
      return [];
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      return [];
    }
  },
  fetchCategories: async () => {
    try {
      const response = await apiClient.get('/blog/categories?limit=100');
      const resData = response.data;
      if (Array.isArray(resData?.data?.categories)) return resData.data.categories;
      if (Array.isArray(resData?.data)) return resData.data;
      if (Array.isArray(resData)) return resData;
      return [];
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      return [];
    }
  },
  fetchFaqs: async () => [],
  fetchHeroBanners: async () => {
    try {
      const response = await apiClient.get('/hero-banner/public');
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch hero banners:', error);
      return [];
    }
  },
  fetchPortfolios: async () => {
    try {
      const response = await apiClient.get('/portfolio/public');
      return response.data?.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch portfolios:', error);
      return [];
    }
  },
  fetchPortfolioBySlug: async (slug: string) => {
    try {
      const response = await apiClient.get(`/portfolio/public/${slug}`);
      return response.data?.data || null;
    } catch (error) {
      console.error('Failed to fetch portfolio by slug:', error);
      return null;
    }
  },
  fetchPricingSlots: async () => {
    try {
      const response = await apiClient.get('/advertisement/pricing-slots');
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch pricing slots:', error);
      return [];
    }
  },
  fetchServiceFields: async (serviceId: number) => {
    try {
      const response = await apiClient.get(`/service/field/getByServiceId/${serviceId}`);
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch service fields:', error);
      return [];
    }
  },  

  fetchServices: async () => {
    try {
      const response = await apiClient.get('/service/getAll');
      return response.data?.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      return [];
    }
  },
  fetchTeamMembers: async () => [],
  fetchTestimonials: async () => [],
  forgotPassword: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/forgot-password', { email });
      return { success: response.data.success, message: response.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },
  incrementBlogView: async (slug: string) => {
    try {
      const response = await apiClient.post(`/blog/public/posts/${slug}/view`);
      return response.data;
    } catch (error) {
      console.error('Failed to increment blog view:', error);
      return null;
    }
  },
  likeBlogPost: async (slug: string) => {
    try {
      const response = await apiClient.post(`/blog/public/posts/${slug}/like`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to like blog post:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  getLikeStatus: async (slug: string) => {
    try {
      const response = await apiClient.get(`/blog/public/posts/${slug}/like-status`);
      return response.data;
    } catch (error: any) {
      return { success: false, data: { hasLiked: false } };
    }
  },
  getAllCommentsAdmin: async (page = 1, limit = 20) => {
    try {
      const response = await apiClient.get(`/blog/comments/admin?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to fetch admin comments:', error);
      throw error;
    }
  },
  deleteBlogComment: async (id: number) => {
    try {
      const response = await apiClient.delete(`/blog/comments/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete comment:', error);
      throw error;
    }
  },
  moderateComment: async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await apiClient.patch(`/blog/comments/${id}/moderate`, { status });
      return response.data;
    } catch (error: any) {
      console.error('Failed to moderate comment:', error);
      throw error;
    }
  },
  refreshToken: async () => ({}),
  resendVerification: async (email: string) => {
    try {
      const response = await apiClient.post('/auth/resend-verification-email', { email });
      return { success: response.data?.success, message: response.data?.message };
    } catch (err: any) {
      return {
        success: false,
        message:
          err.response?.data?.message || err.message || 'Failed to resend verification email.',
      };
    }
  },
  resetPassword: async (data: { email: string; token: string; newPassword: string }) => {
    try {
      const response = await apiClient.post('/auth/reset-password', data);
      return { success: response.data.success, message: response.data.message };
    } catch (err: any) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  },
  submitBlogComment: async (slug: string, commentText: string) => {
    try {
      const response = await apiClient.post(`/blog/public/posts/${slug}/comments`, { commentText });
      return response.data;
    } catch (error: any) {
      console.error('Failed to submit comment:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  submitEnquiry: async (data: any) => {
    try {
      const response = await apiClient.post('/enquiry', data);
      return {
        success: response.data?.success,
        message: response.data?.message,
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('Failed to submit enquiry:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  submitServiceRequest: async (serviceId: number, formData: FormData) => {
    try {
      const response = await apiClient.post(`/service/request/create/${serviceId}`, formData);
      return {
        success: response.data?.success,
        message: response.data?.message,
        data: response.data?.data,
      };
    } catch (error: any) {
      console.error('Failed to submit service request:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  getMyRequests: async (params?: any) => {
    try {
      const response = await apiClient.get('/service/request/my', { params });
      return response.data?.data || { data: [], pagination: {} };
    } catch (error) {
      console.error('Failed to fetch my requests:', error);
      return { data: [], pagination: {} };
    }
  },
  getMyRequestById: async (id: number) => {
    try {
      const response = await apiClient.get(`/service/request/my/${id}`);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to fetch request details:', error);
      return null;
    }
  },
  cancelRequest: async (id: number) => {
    try {
      const response = await apiClient.patch(`/service/request/cancel/${id}`);
      return { success: response.data?.success, message: response.data?.message };
    } catch (error: any) {
      console.error('Failed to cancel request:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  updateMyRequest: async (id: number, formData: FormData) => {
    try {
      const response = await apiClient.patch(`/service/request/my/update/${id}`, formData);
      return { success: response.data?.success, message: response.data?.message };
    } catch (error: any) {
      console.error('Failed to update request:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  getMyPayments: async () => {
    try {
      const response = await apiClient.get('/payment/my');
      return { success: true, data: response.data.data };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        // Fallback: fetch all requests, then extract payments
        try {
          const requestsRes = await api.getMyRequests({ limit: 100 });
          const requests = requestsRes.data || [];
          let allPayments: any[] = [];
          
          await Promise.all(
            requests.map(async (req: any) => {
              const details = await api.getMyRequestById(req.id);
              if (details?.payments && details.payments.length > 0) {
                const paymentsWithService = details.payments.map((p: any) => ({
                  ...p,
                  service: details.service || { name: 'Service Request' },
                  serviceRequestId: req.id,
                }));
                allPayments = [...allPayments, ...paymentsWithService];
              }
            })
          );
          
          allPayments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          return { success: true, data: allPayments };
        } catch (fallbackError) {
          console.error('Fallback fetching payments failed', fallbackError);
          return { success: true, data: [] };
        }
      }
      console.error('Failed to fetch payments:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  updateProfile: async (data: any) => {
    try {
      const response = await apiClient.put('/auth/updateMyDetails', data);
      return { success: true, message: response.data.message };
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      return { success: false, message: error.response?.data?.message || error.message };
    }
  },
  verifyEmail: async (token: string, email: string) => {
    try {
      const response = await apiClient.get('/auth/verify-email', {
        params: { token, email },
      });
      return { success: response.data.success, message: response.data.message };
    } catch (err: any) {
      return {
        success: false,
        message: err.response?.data?.message || err.message || 'Verification failed.',
      };
    }
  },
} as unknown as MockApi;

export default apiClient;
