import apiClient from '@/lib/api/axios';

export type NotificationType =
  | 'SERVICE_REQUEST'
  | 'TASK_ASSIGNED'
  | 'PAYMENT'
  | 'ENQUIRY'
  | 'REIMBURSEMENT'
  | 'LEAD'
  | 'BLOG_COMMENT'
  | 'GENERAL';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export const fetchNotifications = async (
  page = 1,
  limit = 20
): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> => {
  const response = await apiClient.get('/notifications', {
    params: { page, limit },
  });
  const data = response.data?.data || [];
  const meta = response.data?.meta || { page, limit, total: 0, unreadCount: 0 };

  return {
    notifications: data,
    total: meta.total,
    unreadCount: meta.unreadCount,
  };
};

export const markNotificationRead = async (id: number): Promise<void> => {
  await apiClient.patch(`/notifications/${id}/read`);
};

export const markAllNotificationsRead = async (): Promise<void> => {
  await apiClient.patch('/notifications/read-all');
};

export const clearAllNotifications = async (): Promise<void> => {
  await apiClient.delete('/notifications');
};
