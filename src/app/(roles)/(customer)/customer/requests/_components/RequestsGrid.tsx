'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { ServiceRequest, RequestStatus } from '../types';

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'NEW':
      return { label: 'New', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle };
    case 'IN_REVIEW':
      return { label: 'In Review', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Clock };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Loader2 };
    case 'COMPLETED':
      return {
        label: 'Completed',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        icon: CheckCircle2,
      };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    default:
      return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle };
  }
};

interface RequestsGridProps {
  isLoading: boolean;
  filteredRequests: ServiceRequest[];
  searchQuery: string;
  statusFilter: string;
}

export function RequestsGrid({
  isLoading,
  filteredRequests,
  searchQuery,
  statusFilter,
}: RequestsGridProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111] rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm animate-pulse flex flex-col h-[280px]"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-lg"></div>
                <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
              </div>
              <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
              <div className="h-6 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>

              <div className="space-y-3 mt-6">
                <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-50 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  if (filteredRequests.length === 0) {
    return (
      <motion.div
        variants={item}
        className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px] text-center"
      >
        <div className="w-24 h-24 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping opacity-20"></div>
          <ClipboardList className="w-12 h-12 text-cyan-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Requests Found</h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
          {searchQuery || statusFilter !== 'ALL'
            ? "We couldn't find any requests matching your filters."
            : "You currently don't have any open service requests. When you need help or want to start a new project, create one here."}
        </p>
        {!searchQuery && statusFilter === 'ALL' && (
          <Link
            href="/customer/services/new"
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
          >
            Create New Request
          </Link>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {filteredRequests.map((req) => {
          const status = getStatusConfig(req.status);
          const StatusIcon = status.icon;
          return (
            <motion.div
              key={req.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-[#111] rounded-2xl sm:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-cyan-500/30 hover:shadow-lg transition-all group flex flex-col overflow-hidden"
            >
              <Link href={`/customer/requests/${req.id}`} className="flex flex-col h-full">
                <div className="p-4 sm:p-6 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.color}`}
                    >
                      <StatusIcon className="w-3.5 h-3.5" />
                      {status.label}
                    </div>
                    <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                      REQ-{req.id.toString().padStart(4, '0')}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {req.service?.name || 'Unknown Service'}
                  </h3>

                  <div className="space-y-3 mt-4 sm:mt-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>Created on {new Date(req.createdAt).toLocaleDateString()}</span>
                    </div>
                    {req.assignedTo && (
                      <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>Assigned to {req.assignedTo.fullName}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    View Details
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors shadow-sm">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
