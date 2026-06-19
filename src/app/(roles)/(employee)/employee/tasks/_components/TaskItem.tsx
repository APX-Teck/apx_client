import React from 'react';
import { motion } from 'framer-motion';
import { PlayCircle, CheckCircle2, Clock, XCircle, Flag, Calendar } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';
import { Task } from '@/services/admin/tasks.service';

interface TaskItemProps {
  task: Task;
  handleUpdateStatus: (id: number, currentStatus: string) => void;
}

export function TaskItem({ task, handleUpdateStatus }: TaskItemProps) {
  const isDue = task.dueDate
    ? isPast(new Date(task.dueDate)) &&
      !isToday(new Date(task.dueDate)) &&
      task.status !== 'COMPLETED' &&
      task.status !== 'CANCELLED'
    : false;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20 flex items-center gap-1.5">
            <Clock size={12} /> Open
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
            <PlayCircle size={12} /> In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={12} /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 flex items-center gap-1.5">
            <XCircle size={12} /> Cancelled
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-500/10 text-gray-500 border border-gray-500/20">
            {status}
          </span>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-[#1a1a1a] hover:border-indigo-500/20 transition-all gap-4 group"
    >
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-0.5 rounded-md">
              TSK-{task.id}
            </span>
            <p className="font-bold text-sm text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {task.title}
            </p>
          </div>
          {getStatusBadge(task.status)}
        </div>

        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 max-w-2xl">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium pt-1">
          <span
            className={`px-2 py-1 font-bold rounded-md uppercase tracking-wider border inline-flex items-center gap-1 ${
              task.priority === 'HIGH'
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                : task.priority === 'MEDIUM'
                  ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                  : 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
            }`}
          >
            <Flag size={10} />
            {task.priority}
          </span>

          {task.dueDate && (
            <div
              className={`inline-flex items-center gap-1.5 font-bold px-2 py-1 rounded-md border ${
                isDue
                  ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                  : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-[#151515] dark:text-gray-400 dark:border-white/10'
              }`}
            >
              <Calendar size={12} />
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </div>
          )}

          <span className="text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <Clock size={12} /> Created {format(new Date(task.createdAt), 'MMM dd, yyyy')}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-end shrink-0">
        {task.status === 'OPEN' && (
          <button
            onClick={() => handleUpdateStatus(task.id, task.status)}
            className="px-4 py-2 min-h-[44px] bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-xl transition-colors border border-indigo-100 dark:border-indigo-500/20 flex items-center justify-center gap-1.5"
          >
            <PlayCircle size={14} /> Start Task
          </button>
        )}
        {task.status === 'IN_PROGRESS' && (
          <button
            onClick={() => handleUpdateStatus(task.id, task.status)}
            className="px-4 py-2 min-h-[44px] bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl transition-colors border border-emerald-100 dark:border-emerald-500/20 flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 size={14} /> Complete Task
          </button>
        )}
      </div>
    </motion.div>
  );
}
