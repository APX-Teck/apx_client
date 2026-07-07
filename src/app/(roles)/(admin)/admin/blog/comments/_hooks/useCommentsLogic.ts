import { useState, useMemo, useEffect, useCallback } from 'react';
import { api } from '@/lib/axios';

export function useCommentsLogic(initialComments: any[] = []) {
  const [comments, setComments] = useState<any[]>(initialComments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getAllCommentsAdmin(1, 1000);
      let data = res.data || res;
      if (data?.data && Array.isArray(data.data)) {
        data = data.data;
      } else if (data?.content && Array.isArray(data.content)) {
        data = data.content;
      } else if (!Array.isArray(data)) {
        data = [];
      }
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Advanced State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [moderatingId, setModeratingId] = useState<number | null>(null);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

  useEffect(() => {
    if (initialComments && initialComments.length > 0) {
      setComments(initialComments);
    } else {
      fetchComments();
    }
  }, [initialComments, fetchComments]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setDeletingId(id);
    try {
      const res = await api.deleteBlogComment(id);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c.id !== id));
        setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      } else {
        alert(res.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting comment');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModerate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    setModeratingId(id);
    try {
      const res = await api.moderateComment(id, status);
      if (res.success) {
        setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
      } else {
        alert(res.message || `Failed to ${status.toLowerCase()} comment`);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || `Error moderating comment`);
    } finally {
      setModeratingId(null);
    }
  };

  const handleBulkAction = async (action: 'APPROVED' | 'REJECTED' | 'DELETE') => {
    if (selectedIds.length === 0) return;
    if (
      !window.confirm(
        `Are you sure you want to ${action.toLowerCase()} ${selectedIds.length} comments?`
      )
    )
      return;

    setIsBulkProcessing(true);
    for (const id of selectedIds) {
      if (action === 'DELETE') {
        try {
          await api.deleteBlogComment(id);
          setComments((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {}
      } else {
        try {
          await api.moderateComment(id, action);
          setComments((prev) => prev.map((c) => (c.id === id ? { ...c, status: action } : c)));
        } catch (e) {}
      }
    }
    setSelectedIds([]);
    setIsBulkProcessing(false);
  };

  const filteredComments = useMemo(() => {
    return comments.filter((comment) => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = !search ||
        (comment.user?.fullName?.toLowerCase().includes(search) ?? false) ||
        (comment.user?.email?.toLowerCase().includes(search) ?? false) ||
        (comment.commentText?.toLowerCase().includes(search) ?? false) ||
        (comment.post?.title?.toLowerCase().includes(search) ?? false);

      const matchesStatus = statusFilter === 'ALL' || comment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [comments, searchTerm, statusFilter]);

  const totalFilteredPosts = filteredComments.length;
  const totalPages = Math.max(1, Math.ceil(totalFilteredPosts / itemsPerPage));
  const paginatedComments = filteredComments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
    setSelectedIds([]);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.length === paginatedComments.length && paginatedComments.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedComments.map((c) => c.id));
    }
  }, [selectedIds, paginatedComments]);

  const toggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  }, []);

  return {
    loading,
    error,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    selectedIds,
    setSelectedIds,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    deletingId,
    moderatingId,
    isBulkProcessing,
    handleDelete,
    handleModerate,
    handleBulkAction,
    filteredComments,
    paginatedComments,
    totalFilteredPosts,
    totalPages,
    toggleSelectAll,
    toggleSelect,
  };
}
