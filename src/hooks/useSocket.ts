import { useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { getAccessToken } from '@/lib/api/token-manager';
import { socketManager } from '@/lib/socket';
import { useNotificationStore } from '@/store/notification.store';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const addNotification = useNotificationStore((state) => state.addNotification);

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

    socketManager.on('notification:new', handleNewNotification);

    return () => {
      socketManager.off('notification:new', handleNewNotification);
    };
  }, [user, isAuthenticated, addNotification]);
};
export default useSocket;
