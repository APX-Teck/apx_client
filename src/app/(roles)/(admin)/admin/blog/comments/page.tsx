'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { GlassCard } from '@/components/ui/GlassCard';
import { Trash2, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogCommentsAdminPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchComments = async (p: number) => {
    setLoading(true);
    try {
      const res = await api.getAllCommentsAdmin(p, 20);
      if (res.success) {
        setComments(res.data?.data || []);
        setTotalPages(res.data?.pagination?.totalPages || 1);
        setPage(p);
      } else {
        setError(res.message || 'Failed to fetch comments');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(1);
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    setDeletingId(id);
    try {
      const res = await api.deleteBlogComment(id);
      if (res.success) {
        setComments(prev => prev.filter(c => c.id !== id));
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-accent" />
            Blog Comments
          </h1>
          <p className="text-gray-400 mt-2">Manage user comments across all blog posts.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </div>
      )}

      <GlassCard className="p-0 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : comments.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No comments found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs uppercase bg-white/5 text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold">User</th>
                  <th className="px-6 py-4 font-semibold">Blog Post</th>
                  <th className="px-6 py-4 font-semibold">Comment</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {comments.map((comment) => (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={comment.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{comment.user?.fullName}</div>
                      <div className="text-xs text-gray-500">{comment.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate" title={comment.post?.title}>
                      <a href={`/insights-news/${comment.post?.slug}`} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                        {comment.post?.title}
                      </a>
                    </td>
                    <td className="px-6 py-4 max-w-[300px]">
                      <p className="line-clamp-2" title={comment.commentText}>{comment.commentText}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(comment.id)}
                        disabled={deletingId === comment.id}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete Comment"
                      >
                        {deletingId === comment.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex justify-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => fetchComments(page - 1)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg transition-colors text-sm"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-400">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => fetchComments(page + 1)}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 rounded-lg transition-colors text-sm"
            >
              Next
            </button>
          </div>
        )}
      </GlassCard>
    </div>
  );
}
