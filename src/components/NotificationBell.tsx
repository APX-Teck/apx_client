'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, ChevronRight, Inbox, Loader2 } from 'lucide-react';
import { useNotificationStore } from '@/store/notification.store';
import { NotificationItem } from './NotificationItem';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    notifications,
    unreadCount,
    hasMore,
    isLoading,
    loadNotifications,
    loadMore,
    markRead,
    markAllRead,
    clearNotifications,
  } = useNotificationStore();

  useEffect(() => {
    // Load initial counts / page on mount if needed, or when opened
    loadNotifications(1);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllRead();
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotifications();
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Bell Button */}
      <button
        onClick={handleToggle}
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative border group ${
          isOpen
            ? 'bg-cyan-50 border-cyan-200 text-cyan-600 dark:bg-cyan-500/20 dark:border-cyan-500/30 dark:text-cyan-400'
            : 'bg-white dark:bg-[#1a1a1a] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-[#222]'
        } shadow-[0_2px_10px_rgba(0,0,0,0.02)]`}
        aria-label="Toggle notifications"
      >
        <Bell size={18} className="group-hover:animate-wiggle" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-[#1a1a1a] shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
        )}
      </button>

      {/* Popover Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-14 right-0 md:-right-2 w-[320px] sm:w-[380px] bg-white/95 dark:bg-[#151515]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-gray-50/50 dark:bg-black/20">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable list */}
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar flex-1">
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onRead={markRead}
                      onClosePanel={() => setIsOpen(false)}
                    />
                  ))}

                  {/* Load More Button */}
                  {hasMore && (
                    <div className="p-2 border-t border-gray-100/50 dark:border-white/5 bg-gray-50/20 dark:bg-black/10">
                      <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="w-full py-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            Load more <ChevronRight size={14} />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-3 text-gray-400 dark:text-gray-600">
                    <Inbox size={20} />
                  </div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">All caught up!</h4>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 max-w-[200px]">
                    No notifications right now. We'll let you know when something arrives.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default NotificationBell;
