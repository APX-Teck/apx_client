import apiClient from '@/lib/api/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';

import {
  BlogPostStatus,
  BlogCategory,
  AdminBlogPost as BlogPost,
  AdminBlogPostDetail as BlogPostDetail,
} from '@/app/types/admin-blog.types';

export type { BlogPostStatus, BlogCategory, BlogPost, BlogPostDetail };

export const blogService = {
  getPosts: async (params?: any): Promise<BlogPost[]> => {
    try {
      const response = await apiClient.get('/blog/posts/admin', { params });
      const posts = extractDataArray<any>(response.data);
      return posts.map((post: any) => ({
        ...post,
        authorName: post.author?.fullName || 'Unknown',
        authorProfilePhoto: post.author?.profile?.profilePhotoUrl || null,
        isAiGenerated: post.tags?.includes('__ai_generated') || false,
      }));
    } catch (error) {
      console.error('Failed to fetch posts', error);
      return [];
    }
  },

  getPostDetail: async (id: string | number): Promise<BlogPostDetail | null> => {
    try {
      const response = await apiClient.get(`/blog/posts/admin/${id}`);
      const post = extractDataObject<any>(response.data);
      if (!post) return null;
      return {
        ...post,
        authorName: post.author?.fullName || 'Unknown',
        authorProfilePhoto: post.author?.profile?.profilePhotoUrl || null,
        isAiGenerated: post.tags?.includes('__ai_generated') || false,
      };
    } catch (error) {
      console.error('Failed to fetch post detail', error);
      return null;
    }
  },

  createPost: async (formData: FormData): Promise<BlogPost> => {
    try {
      const response = await apiClient.post('/blog/posts', formData);
      return extractDataObject<BlogPost>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to create post', error);
      throw error;
    }
  },

  updatePost: async (id: string, formData: FormData): Promise<BlogPostDetail> => {
    try {
      const response = await apiClient.patch(`/blog/posts/${id}`, formData);
      return extractDataObject<BlogPostDetail>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to update post', error);
      throw error;
    }
  },

  updatePostStatus: async (id: string | number, status: BlogPostStatus): Promise<BlogPost> => {
    if (status === 'PUBLISHED' || status === 'DRAFT') {
      const response = await apiClient.patch(`/blog/posts/${id}/publish`, {
        publish: status === 'PUBLISHED',
      });
      return extractDataObject<BlogPost>(response.data) || response.data;
    }
    // Note: Backend doesn't support changing to other statuses explicitly.
    // For now, return what we have.
    const response = await apiClient.get(`/blog/posts/admin/${id}`);
    return extractDataObject<BlogPost>(response.data) || response.data;
  },

  deletePost: async (id: string | number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/blog/posts/${id}`);
    return { success: response.data?.success || true };
  },

  getCategories: async (params?: any): Promise<BlogCategory[]> => {
    try {
      const response = await apiClient.get('/blog/categories', { params });
      return extractDataArray<BlogCategory>(response.data);
    } catch (error) {
      console.error('Failed to fetch categories', error);
      return [];
    }
  },

  createCategory: async (data: { name: string }): Promise<BlogCategory> => {
    try {
      const response = await apiClient.post('/blog/categories', data);
      return extractDataObject<BlogCategory>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to create category', error);
      throw error;
    }
  },

  updateCategory: async (id: string | number, data: { name: string; slug?: string }): Promise<BlogCategory> => {
    try {
      const response = await apiClient.patch(`/blog/categories/${id}`, data);
      return extractDataObject<BlogCategory>(response.data) || response.data;
    } catch (error) {
      console.error('Failed to update category', error);
      throw error;
    }
  },

  deleteCategory: async (id: string | number): Promise<{ success: boolean }> => {
    try {
      const response = await apiClient.delete(`/blog/categories/${id}`);
      return { success: response.data?.success || true };
    } catch (error) {
      console.error('Failed to delete category', error);
      throw error;
    }
  },
};
