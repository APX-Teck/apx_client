import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { blogService } from '@/services/admin/blog.service';
import { BlogPostStatus } from '@/app/types/admin-blog.types';
import { AdminBlogPost as BlogPost } from '@/app/types/admin-blog.types';

export function useBlogLogic(initialPosts: BlogPost[] = []) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');



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

  useEffect(() => {
    if (initialPosts && initialPosts.length > 0) {
      setPosts(initialPosts);
    } else {
      fetchPosts();
    }
  }, [initialPosts, fetchPosts]);

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
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
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
  };
}
