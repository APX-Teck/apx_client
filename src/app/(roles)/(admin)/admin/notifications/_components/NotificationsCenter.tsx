"use client";

import React, { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { NotificationItem } from "@/components/NotificationItem";
import { Bell, Inbox, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationsCenter() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
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
    loadNotifications(1);
  }, []);

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAllRead();
  };

  const handleClearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearNotifications();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "unread") return !n.isRead;
    return true;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
        {/* Controls Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-white/10 pb-6">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border ${
                  filter === "all"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                All Notifications
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border flex items-center gap-2 ${
                  filter === "unread"
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-[0_4px_14px_rgba(79,70,229,0.3)]"
                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
              >
                Unread
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 self-start sm:self-auto">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors flex items-center gap-1.5"
              >
                Mark all as read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={handleClearNotifications}
                className="text-xs font-bold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1.5"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-gray-100/50 dark:divide-white/5">
          {isLoading && notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length > 0 ? (
            <div className="bg-white dark:bg-[#111111] overflow-hidden rounded-2xl border border-gray-100/50 dark:border-white/5">
              <AnimatePresence initial={false}>
                {filteredNotifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <NotificationItem
                      notification={notification}
                      onRead={markRead}
                      onClosePanel={() => {}}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-4 text-gray-400 dark:text-gray-600 border border-gray-100 dark:border-white/5 shadow-inner">
                <Inbox size={28} />
              </div>
              <h4 className="text-base font-bold text-gray-900 dark:text-white">All caught up!</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-[280px] leading-relaxed">
                {filter === "unread" 
                  ? "You have no unread notifications right now."
                  : "No notifications right now. We'll let you know when something arrives."}
              </p>
            </div>
          )}
        </div>

        {/* Load More Control */}
        {hasMore && filteredNotifications.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-center">
            <button
              onClick={loadMore}
              disabled={isLoading}
              className="px-6 py-2.5 bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 font-bold text-xs rounded-xl border border-gray-200 dark:border-white/10 flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 size={12} className="animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
