import React from 'react';
import { Check, Clock, X, Trash2, Loader2 } from 'lucide-react';

interface CommentRowProps {
  comment: any;
  isSelected: boolean;
  toggleSelect: (id: number) => void;
  handleModerate: (id: number, status: 'APPROVED' | 'REJECTED') => void;
  handleDelete: (id: number) => void;
  deletingId: number | null;
  moderatingId: number | null;
  isBulkProcessing: boolean;
}

export function CommentRow({
  comment,
  isSelected,
  toggleSelect,
  handleModerate,
  handleDelete,
  deletingId,
  moderatingId,
  isBulkProcessing,
}: CommentRowProps) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(comment.id)}
          className="w-5 h-5 min-w-[20px] min-h-[20px] rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#222] cursor-pointer"
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {comment.user?.fullName || 'Unknown User'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{comment.user?.email || 'No Email'}</span>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
            {new Date(comment.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-normal min-w-[300px]">
        <div className="flex flex-col gap-1.5">
          <a
            href={`/insights-news/${comment.post?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-block truncate max-w-[400px]"
          >
            On: {comment.post?.title}
          </a>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed bg-gray-50 dark:bg-[#151515] p-3 rounded-xl border border-gray-100 dark:border-white/5">
            "{comment.commentText}"
          </p>
        </div>
      </td>
      <td className="px-6 py-4">
        {comment.status === 'APPROVED' && (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> Approved
          </span>
        )}
        {comment.status === 'PENDING' && (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20 inline-flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        )}
        {comment.status === 'REJECTED' && (
          <span className="px-3 py-1.5 text-xs font-bold rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 inline-flex items-center gap-1.5">
            <X className="w-3.5 h-3.5" /> Rejected
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex justify-end items-center gap-2">
          {comment.status === 'PENDING' && (
            <>
              <button
                onClick={() => handleModerate(comment.id, 'APPROVED')}
                disabled={deletingId !== null || moderatingId !== null || isBulkProcessing}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:text-emerald-400 dark:hover:bg-emerald-500/10 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-emerald-200 dark:hover:border-emerald-500/20"
                title="Approve Comment"
              >
                {moderatingId === comment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleModerate(comment.id, 'REJECTED')}
                disabled={deletingId !== null || moderatingId !== null || isBulkProcessing}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:text-amber-400 dark:hover:bg-amber-500/10 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-amber-200 dark:hover:border-amber-500/20"
                title="Reject Comment"
              >
                {moderatingId === comment.id ? (
                  <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                ) : (
                  <X className="w-4 h-4" />
                )}
              </button>
            </>
          )}
          <button
            onClick={() => handleDelete(comment.id)}
            disabled={deletingId === comment.id || moderatingId === comment.id || isBulkProcessing}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 rounded-xl transition-colors disabled:opacity-50 border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
            title="Delete Comment"
          >
            {deletingId === comment.id ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-500" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
}
