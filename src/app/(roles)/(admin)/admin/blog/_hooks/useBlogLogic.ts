import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { blogService } from '@/services/admin/blog.service';
import { BlogPostStatus } from '@/app/types/admin-blog.types';
import { AdminBlogPost as BlogPost } from '@/app/types/admin-blog.types';

import { BlogCategory } from '@/app/types/admin-blog.types';

export function useBlogLogic(initialPosts: BlogPost[] = []) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset to first page when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await blogService.getPosts();
      setPosts(data || []);
    } catch (error) {
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const data = await blogService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Failed to fetch categories');
    }
  }, []);

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
    } else {
      fetchPosts();
    }
    fetchCategories();
  }, [initialPosts, fetchPosts, fetchCategories]);

  const handleDeleteClick = (id: string) => {
    setPostToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePost = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      await blogService.deletePost(postToDelete);
      toast.success('Post deleted successfully');
      setIsDeleteModalOpen(false);
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
      setPostToDelete(null);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: BlogPostStatus) => {
    const toastId = toast.loading('Updating status...');
    try {
      await blogService.updatePostStatus(id, newStatus);
      toast.success(`Post is now ${newStatus}`, { id: toastId });
      fetchPosts();
    } catch (error) {
      toast.error('Failed to update post status', { id: toastId });
    }
  };

  const filteredPosts = posts.filter(
    (post) => {
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.slug.toLowerCase().includes(searchTerm.toLowerCase());
      
      let matchesCategory = true;
      if (selectedCategory) {
        const selectedCatObj = categories.find(c => c.id.toString() === selectedCategory);
        const postCategoryId = (post as any).categoryId?.toString() || post.category?.id?.toString();
        const postCategoryName = typeof post.category === 'string' ? post.category : post.category?.name;
        
        matchesCategory = postCategoryId === selectedCategory || (selectedCatObj ? postCategoryName === selectedCatObj.name : false);
      }

      return matchesSearch && matchesCategory;
    }
  );

  const sortedAndFilteredPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'views_high':
        return (b.views || 0) - (a.views || 0);
      case 'views_low':
        return (a.views || 0) - (b.views || 0);
      case 'likes_high':
        return (b._count?.likes || 0) - (a._count?.likes || 0);
      case 'likes_low':
        return (a._count?.likes || 0) - (b._count?.likes || 0);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const totalPages = Math.ceil(sortedAndFilteredPosts.length / itemsPerPage);
  const paginatedPosts = sortedAndFilteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    posts,
    filteredPosts: paginatedPosts,
    totalFilteredPosts: filteredPosts.length,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    fetchPosts,
    handleDeleteClick,
    confirmDeletePost,
    handleUpdateStatus,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  };
}
