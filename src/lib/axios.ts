import apiClient from '@/lib/api/axios';
import { Ad } from '@/app/types/ad.types';
import { StatsOverview } from '@/app/types/analytics.types';
import { BlogPost, BlogComment } from '@/app/types/blog.types';
import { Faq } from '@/app/types/faq.types';
import { HeroBanner } from '@/app/types/home.types';
import { Portfolio } from '@/app/types/portfolio.types';
import { Service, ServiceField } from '@/app/types/service.types';
import { Testimonial } from '@/app/types/testimonial.types';
import { TeamMember } from '@/app/types/user.types';

export type MockApi = {
  fetchAds: (...args: any[]) => Promise<Ad | null>;
  fetchBlogComments: (...args: any[]) => Promise<BlogComment[]>;
  fetchBlogs: (...args: any[]) => Promise<BlogPost[]>;
  fetchFaqs: (...args: any[]) => Promise<Faq[]>;
  fetchHeroBanners: (...args: any[]) => Promise<HeroBanner[]>;
  fetchPortfolios: (...args: any[]) => Promise<Portfolio[]>;
  fetchServiceFields: (...args: any[]) => Promise<ServiceField[]>;
  fetchServices: (...args: any[]) => Promise<Service[]>;
  fetchStats: (...args: any[]) => Promise<StatsOverview>;
  fetchTeamMembers: (...args: any[]) => Promise<TeamMember[]>;
  fetchTestimonials: (...args: any[]) => Promise<Testimonial[]>;
  forgotPassword: (...args: any[]) => Promise<any>;
  likeBlogPost: (...args: any[]) => Promise<any>;
  login: (...args: any[]) => Promise<any>;
  logout: (...args: any[]) => Promise<any>;
  getCurrentUser: (...args: any[]) => Promise<any>;
  refreshToken: (...args: any[]) => Promise<any>;
  register: (...args: any[]) => Promise<any>;
  resendVerification: (...args: any[]) => Promise<any>;
  resetPassword: (...args: any[]) => Promise<any>;
  submitBlogComment: (...args: any[]) => Promise<any>;
  submitEnquiry: (...args: any[]) => Promise<any>;
  submitServiceRequest: (...args: any[]) => Promise<any>;
  verifyEmail: (...args: any[]) => Promise<any>;
} & typeof apiClient;

export const api = new Proxy(apiClient, {
  get(target, prop, receiver) {
    if (prop in target) {
      return Reflect.get(target, prop, receiver);
    }
    // Return empty arrays/objects to prevent runtime crashes during missing mocks
    return async () => {
      if (prop === 'fetchAds') return null;
      if (prop === 'fetchStats') return {} as unknown as StatsOverview;
      return [];
    };
  }
}) as MockApi;

export default apiClient;
