import { create } from 'zustand';
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  Notification,
} from '@/app/services/api/notification.api';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  isLoading: boolean;
  hasMore: boolean;

  loadNotifications: (page?: number) => Promise<void>;
  loadMore: () => Promise<void>;
  addNotification: (n: Notification) => void;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  total: 0,
  page: 1,
  isLoading: false,
  hasMore: false,

  loadNotifications: async (page = 1) => {
    set({ isLoading: true });
    try {
      const limit = 20;
      const { notifications: newNotifs, total, unreadCount } = await fetchNotifications(page, limit);

      set((state) => {
        const mergedNotifications =
          page === 1
            ? newNotifs
            : [
                ...state.notifications,
                ...newNotifs.filter(
                  (newN) => !state.notifications.some((existingN) => existingN.id === newN.id)
                ),
              ];

        return {
          notifications: mergedNotifications,
          unreadCount,
          total,
          page,
          hasMore: mergedNotifications.length < total,
          isLoading: false,
        };
      });
    } catch (error) {
      console.error('Failed to load notifications:', error);
      set({ isLoading: false });
    }
  },

  loadMore: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().loadNotifications(page + 1);
  },

  addNotification: (n: Notification) => {
    set((state) => {
      const exists = state.notifications.some((existing) => existing.id === n.id);
      if (exists) return {};

      return {
        notifications: [n, ...state.notifications],
        unreadCount: state.unreadCount + (n.isRead ? 0 : 1),
        total: state.total + 1,
      };
    });
  },

  markRead: async (id: number) => {
    let wasUnread = false;

    set((state) => {
      const updatedNotifs = state.notifications.map((n) => {
        if (n.id === id) {
          if (!n.isRead) wasUnread = true;
          return { ...n, isRead: true };
        }
        return n;
      });

      return {
        notifications: updatedNotifs,
        unreadCount: Math.max(0, state.unreadCount - (wasUnread ? 1 : 0)),
      };
    });

    try {
      await markNotificationRead(id);
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read:`, error);
      if (wasUnread) {
        set((state) => {
          const revertedNotifs = state.notifications.map((n) => {
            if (n.id === id) return { ...n, isRead: false };
            return n;
          });
          return {
            notifications: revertedNotifs,
            unreadCount: state.unreadCount + 1,
          };
        });
      }
    }
  },

  markAllRead: async () => {
    const previousNotifications = get().notifications;
    const previousUnreadCount = get().unreadCount;

    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));

    try {
      await markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      set({
        notifications: previousNotifications,
        unreadCount: previousUnreadCount,
      });
    }
  },
}));
