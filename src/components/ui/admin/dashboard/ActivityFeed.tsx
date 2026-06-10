"use client";

import React from "react";
import { activityFeed } from "@/services/admin/dashboardData";
import { Activity, Headset, CreditCard, TrendingUp, HelpCircle, FileText, CheckCircle, UserPlus, Receipt, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, React.ElementType> = {
  Headset, CreditCard, TrendingUp, HelpCircle, FileText, CheckCircle, UserPlus, Receipt, Monitor
};

const ColorMap: Record<string, string> = {
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400",
  yellow: "bg-yellow-100 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400",
};

export default function ActivityFeed({ data }: { data?: any[] }) {
  const feedData = data?.length ? data : activityFeed;

  const formatRelativeTime = (dateString: string) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((new Date().getTime() - date.getTime()) / 60000);
    if (diffInMinutes < 60) return `${diffInMinutes || 1} mins ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return `${Math.floor(diffInMinutes / 1440)} days ago`;
  };

  return (
    <div className="bg-white dark:bg-[#111111] rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_30px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 flex flex-col min-h-[400px] transition-colors duration-300">
      <div className="p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h2 className="font-bold text-gray-900 dark:text-white text-lg">Recent Activity</h2>
        <div className="w-7 h-7 rounded-full bg-indigo-600 dark:bg-indigo-500/20 text-white dark:text-indigo-400 text-xs font-bold flex items-center justify-center">
          {feedData.length}
        </div>
      </div>
      <div className="p-6 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar">
        <div className="space-y-6 relative">
          <div className="absolute left-5 top-2 bottom-2 w-px bg-gray-100 dark:bg-white/10"></div>
          {feedData.map((activity: any) => {
            const Icon = IconMap[activity.icon] || Activity;
            return (
              <div key={activity.id} className="flex gap-4 relative group">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-white dark:border-[#111111] shadow-sm transition-colors",
                  ColorMap[activity.color] || ColorMap.indigo
                )}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 pb-1 pt-1 group-hover:translate-x-1 transition-transform duration-200">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium leading-relaxed max-w-[85%]">
                      {activity.text}
                    </p>
                    <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 whitespace-nowrap pt-0.5">
                      {activity.time || formatRelativeTime(activity.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
