'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface RequestItem {
  id: string;
  rawId: number;
  serviceType: string;
  status: 'NEW' | 'IN_REVIEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

interface RecentRequestsTableProps {
  activeRequests: RequestItem[];
}

export function RecentRequestsTable({ activeRequests }: RecentRequestsTableProps) {
  const router = useRouter();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'NEW':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">
            New
          </span>
        );
      case 'IN_REVIEW':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
            In Review
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 animate-pulse">
            In Progress
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
            Cancelled
          </span>
        );
    }
  };

  return (
    <motion.div
      variants={item}
      className="lg:col-span-2 bg-white dark:bg-[#111] p-5 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4 md:space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Recent Service Requests
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Track the status of your ongoing and past requests.
          </p>
        </div>
        <Link
          href="/customer/requests"
          className="hidden sm:flex items-center justify-center min-h-[44px] gap-1 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
              <th className="py-4 pr-4">Request ID</th>
              <th className="py-4 px-4">Service Details</th>
              <th className="py-4 px-4">Status</th>
              <th className="py-4 px-4">Priority</th>
              <th className="py-4 pl-4 text-right">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium text-gray-800 dark:text-gray-200">
            {activeRequests.slice(0, 5).map((req) => (
              <tr
                key={req.id}
                onClick={() => router.push(`/customer/requests/${req.rawId}`)}
                className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <td className="py-4 pr-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                  {req.id}
                </td>
                <td className="py-4 px-4 font-semibold">{req.serviceType}</td>
                <td className="py-4 px-4">{getStatusBadge(req.status)}</td>
                <td className="py-4 px-4">
                  <span
                    className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                      req.priority === 'HIGH'
                        ? 'bg-red-500/10 text-red-500 border-red-500/20'
                        : req.priority === 'MEDIUM'
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          : 'bg-gray-500/10 text-gray-500 border-gray-500/20 dark:text-gray-400'
                    }`}
                  >
                    {req.priority}
                  </span>
                </td>
                <td className="py-4 pl-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                  {new Date(req.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
              </tr>
            ))}
            {activeRequests.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                  No active service requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Link
        href="/customer/requests"
        className="sm:hidden w-full flex items-center justify-center min-h-[44px] gap-2 py-3 mt-2 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white border border-gray-100 dark:border-white/5"
      >
        <span>View All Requests</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
