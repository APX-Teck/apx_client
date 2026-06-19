import React from 'react';
import {
  Edit3,
  Eye,
  Trash2,
  CheckCircle2,
  FileText,
  XCircle,
  Clock,
  Sparkles,
  Heart,
  MessageSquare,
  Calendar,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BlogPostStatus, AdminBlogPost as BlogPost } from '@/app/types/admin-blog.types';
import UserAvatar from '@/components/ui/admin/UserAvatar';

interface BlogCardProps {
  post: BlogPost;
  onDeleteClick: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: BlogPostStatus) => void;
}

const getStatusConfig = (status: BlogPostStatus) => {
  switch (status) {
    case 'PUBLISHED':
      return {
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-100 dark:border-emerald-500/20',
        icon: CheckCircle2,
      };
    case 'UPDATED':
      return {
        color: 'text-blue-600 dark:text-blue-400',
        bg: 'bg-blue-50 dark:bg-blue-500/10',
        border: 'border-blue-100 dark:border-blue-500/20',
        icon: CheckCircle2,
      };
    case 'DRAFT':
      return {
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-100 dark:bg-white/5',
        border: 'border-gray-200 dark:border-white/10',
        icon: FileText,
      };
    case 'REVIEWED':
      return {
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-100 dark:border-amber-500/20',
        icon: Clock,
      };
    case 'REJECTED':
      return {
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-500/10',
        border: 'border-red-100 dark:border-red-500/20',
        icon: XCircle,
      };
    default:
      return {
        color: 'text-gray-600',
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        icon: FileText,
      };
  }
};

export function BlogCard({ post, onDeleteClick, onUpdateStatus }: BlogCardProps) {
  const router = useRouter();
  const config = getStatusConfig(post.status);
  const StatusIcon = config.icon;

  return (
    <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-5 rounded-[2rem] border border-gray-200/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col group relative">
      {/* Top Right Status Control */}
      <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-1">
        <select
          value={post.status}
          onChange={(e) => onUpdateStatus(String(post.id), e.target.value as BlogPostStatus)}
          className={`appearance-none cursor-pointer pl-8 pr-4 py-1.5 min-h-[48px] text-[11px] font-bold rounded-xl border uppercase tracking-wider transition-colors outline-none ${config.bg} ${config.color} ${config.border} hover:opacity-80`}
        >
          <option value="DRAFT">DRAFT</option>
          <option value="REVIEWED">REVIEWED</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="REJECTED">REJECTED</option>
          <option value="UPDATED">UPDATED</option>
        </select>
        <StatusIcon
          size={14}
          className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${config.color}`}
          pointerEvents="none"
        />
      </div>

      <div className="flex gap-4 items-start mb-4 pr-10 sm:pr-40">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
          {post.isAiGenerated ? <Sparkles size={24} /> : <FileText size={24} />}
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className="font-bold text-gray-900 dark:text-white text-lg tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2"
            title={post.title}
          >
            {post.title}
          </h3>
          <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 bg-gray-100 dark:bg-[#222] px-2 py-0.5 rounded inline-block truncate max-w-full">
            /{post.slug}
          </p>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
            Author
          </p>
          <div className="font-bold text-gray-900 dark:text-white flex items-center text-xs gap-2 truncate">
            <UserAvatar name={post.authorName} src={post.authorProfilePhoto} size="sm" />
            <span className="truncate">{post.authorName}</span>
          </div>
        </div>
        <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1">
            Category
          </p>
          <p className="font-bold text-gray-900 dark:text-white text-xs truncate">
            {post.category?.name || post.category || 'Uncategorized'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1.5">
            Created
          </p>
          <p className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
            <Calendar size={12} className="text-indigo-500" />
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'N/A'}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-[#151515] p-3 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-center">
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mb-1 flex items-center gap-1.5">
            Updated
          </p>
          <p className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1.5">
            <Clock size={12} className="text-indigo-500" />
            {post.updatedAt
              ? new Date(post.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : post.createdAt
                ? new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                : 'N/A'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-5 text-xs font-bold text-gray-500 dark:text-gray-400 mb-6 px-2">
        <div className="flex items-center gap-1.5" title="Views">
          <Eye size={14} className="text-gray-400" />
          {post.views || 0}
        </div>
        <div className="flex items-center gap-1.5" title="Likes">
          <Heart size={14} className="text-gray-400" />
          {post._count?.likes || 0}
        </div>
        <div className="flex items-center gap-1.5" title="Comments">
          <MessageSquare size={14} className="text-gray-400" />
          {post._count?.comments || 0}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-gray-100 dark:border-white/5">
        <button
          onClick={() => router.push(`/admin/blog/${post.id}`)}
          className="flex-1 min-h-[48px] bg-white dark:bg-[#151515] border border-gray-200 dark:border-white/10 hover:border-indigo-500 hover:text-indigo-600 dark:hover:border-indigo-400 dark:hover:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2"
        >
          <Edit3 size={14} /> Full Editor
        </button>
        {post.status === 'PUBLISHED' && (
          <button
            className="min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20"
            title="View Live"
          >
            <Eye size={18} />
          </button>
        )}
        <button
          onClick={() => onDeleteClick(String(post.id))}
          className="min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
          title="Delete Post"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
