import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getAccessToken } from '@/lib/api/token-manager';
import { socketManager } from '@/lib/socket';
import { useNotificationStore } from '@/store/notification.store';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { addNotification, markReadLocal, markAllReadLocal, clearNotificationsLocal } = useNotificationStore();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!isAuthenticated) {
      socketManager.disconnect();
      return;
    }

    const token = getAccessToken();
    if (token) {
      socketManager.connect(token);
    }

    const handleNewNotification = (notification: any) => {
      addNotification(notification);
      toast.success(`${notification.title}: ${notification.message}`, {
        duration: 6000,
        position: 'bottom-right',
      });
    };

    const handleReadNotification = (payload: { id: number }) => {
      markReadLocal(payload.id);
    };

    const handleReadAllNotifications = () => {
      markAllReadLocal();
    };

    const handleClearAllNotifications = () => {
      clearNotificationsLocal();
    };

    socketManager.on('notification:new', handleNewNotification);
    socketManager.on('notification:read', handleReadNotification);
    socketManager.on('notification:read-all', handleReadAllNotifications);
    socketManager.on('notification:clear-all', handleClearAllNotifications);

    return () => {
      socketManager.off('notification:new', handleNewNotification);
      socketManager.off('notification:read', handleReadNotification);
      socketManager.off('notification:read-all', handleReadAllNotifications);
      socketManager.off('notification:clear-all', handleClearAllNotifications);
    };
  }, [user, isAuthenticated, addNotification, markReadLocal, markAllReadLocal, clearNotificationsLocal]);
};
export default useSocket;
