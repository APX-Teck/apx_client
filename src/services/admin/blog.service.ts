import apiClient from '@/lib/api/axios';

export type BlogPostStatus = "DRAFT" | "REVIEWED" | "PUBLISHED" | "REJECTED" | "UPDATED" | "REVIWED";

export interface BlogCategory {
  id: string | number;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  status: BlogPostStatus;
  category: any;
  authorName: string;
  author?: any;
  isAiGenerated: boolean;
  publishedAt?: string;
  createdAt: string;
}

export interface BlogPostDetail extends BlogPost {
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  categoryId?: number;
  aiMetadata?: {
    source: string;
    origin: string;
    runDate: string;
  };
}

export const blogService = {
  getPosts: async (params?: any): Promise<BlogPost[]> => {
    try {
      const response = await apiClient.get('/blog/posts/admin', { params });
      return (response.data?.data?.data || []).map((post: any) => ({
        ...post,
        authorName: post.author?.fullName || 'Unknown',
      }));
    } catch (error) {
      console.error('Failed to fetch posts', error);
      return [];
    }
  },

  getPostDetail: async (id: string | number): Promise<BlogPostDetail | null> => {
    try {
      const response = await apiClient.get(`/blog/posts/admin/${id}`);
      const post = response.data?.data;
      if (!post) return null;
      return {
        ...post,
        authorName: post.author?.fullName || 'Unknown',
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
      return response.data?.data;
    } catch (error) {
      console.error('Failed to create post', error);
      throw error;
    }
  },

  updatePost: async (id: string, formData: FormData): Promise<BlogPostDetail> => {
    try {
      const response = await apiClient.patch(`/blog/posts/${id}`, formData);
      return response.data?.data;
    } catch (error) {
      console.error('Failed to update post', error);
      throw error;
    }
  },

  updatePostStatus: async (id: string | number, status: BlogPostStatus): Promise<BlogPost> => {
    if (status === 'PUBLISHED' || status === 'DRAFT') {
      const response = await apiClient.patch(`/blog/posts/${id}/publish`, {
        publish: status === 'PUBLISHED'
      });
      return response.data?.data;
    }
    // Note: Backend doesn't support changing to other statuses explicitly.
    // For now, return what we have.
    const response = await apiClient.get(`/blog/posts/admin/${id}`);
    return response.data?.data;
  },

  deletePost: async (id: string | number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/blog/posts/${id}`);
    return { success: response.data?.success || true };
  },

  getCategories: async (): Promise<BlogCategory[]> => {
    try {
      const response = await apiClient.get('/blog/categories');
      return response.data?.data || [];
    } catch (error) {
      console.error('Failed to fetch categories', error);
      return [];
    }
  }
};
