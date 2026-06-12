'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  ClipboardList,
  CheckSquare,
  CreditCard,
  MessageCircle,
  Receipt,
  UserPlus,
  MessageSquare,
  Bell,
} from 'lucide-react';
import { Notification, NotificationType } from '@/app/services/api/notification.api';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: number) => void;
  onClosePanel: () => void;
}

const iconMap: Record<
  NotificationType,
  {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    color: string;
    bg: string;
  }
> = {
  SERVICE_REQUEST: {
    icon: ClipboardList,
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30',
  },
  TASK_ASSIGNED: {
    icon: CheckSquare,
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/30',
  },
  PAYMENT: {
    icon: CreditCard,
    color: 'text-emerald-500 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/30',
  },
  ENQUIRY: {
    icon: MessageCircle,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30',
  },
  REIMBURSEMENT: {
    icon: Receipt,
    color: 'text-indigo-500 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30',
  },
  LEAD: {
    icon: UserPlus,
    color: 'text-cyan-500 dark:text-cyan-400',
    bg: 'bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-100 dark:border-cyan-900/30',
  },
  BLOG_COMMENT: {
    icon: MessageSquare,
    color: 'text-rose-500 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/30',
  },
  GENERAL: {
    icon: Bell,
    color: 'text-gray-500 dark:text-gray-400',
    bg: 'bg-gray-50 dark:bg-gray-900/30 border border-gray-100 dark:border-gray-800/30',
  },
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onClosePanel,
}) => {
  const router = useRouter();
  const { icon: Icon, color, bg } = iconMap[notification.type] || iconMap.GENERAL;

  const handleClick = () => {
    if (!notification.isRead) {
      onRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
    onClosePanel();
  };

  const timeAgo = (() => {
    try {
      return formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    } catch {
      return '';
    }
  })();

  return (
    <div
      onClick={handleClick}
      className={`flex gap-4 p-4 border-b border-gray-100/50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300 cursor-pointer group relative ${
        !notification.isRead
          ? 'bg-blue-50/20 dark:bg-blue-500/5'
          : ''
      }`}
    >
      {/* Unread indicator dot */}
      {!notification.isRead && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
      )}

      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${bg} ${color}`}>
        <Icon size={18} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <h4
            className={`text-sm tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors ${
              !notification.isRead ? 'font-bold' : 'font-semibold'
            }`}
          >
            {notification.title}
          </h4>
          <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap pt-0.5">
            {timeAgo}
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>
    </div>
  );
};
export default NotificationItem;
