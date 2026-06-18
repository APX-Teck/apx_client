'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { WelcomeBanner } from './WelcomeBanner';
import { StatsGrid } from './StatsGrid';
import { RecentRequestsTable } from './RecentRequestsTable';
import { RightSidebar } from './RightSidebar';

interface RequestItem {
  id: string;
  rawId: number;
  serviceType: string;
  status: 'NEW' | 'IN_REVIEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

interface DashboardManagerProps {
  activeRequests: RequestItem[];
  completedCount: number;
  unpaidInvoices: number;
}

export default function DashboardManager({
  activeRequests,
  completedCount,
  unpaidInvoices,
}: DashboardManagerProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 md:space-y-8">
      <WelcomeBanner />
      <StatsGrid
        activeCount={activeRequests.length}
        unpaidInvoices={unpaidInvoices}
        completedCount={completedCount}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <RecentRequestsTable activeRequests={activeRequests} />
        <RightSidebar />
      </div>
    </motion.div>
  );
}
