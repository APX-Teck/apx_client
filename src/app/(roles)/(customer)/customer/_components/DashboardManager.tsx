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
  activeRequests: initialActiveRequests,
  completedCount: initialCompletedCount,
  unpaidInvoices: initialUnpaidInvoices,
}: DashboardManagerProps) {
  const [activeRequests, setActiveRequests] = React.useState<RequestItem[]>(initialActiveRequests);
  const [completedCount, setCompletedCount] = React.useState(initialCompletedCount);
  const [unpaidInvoices, setUnpaidInvoices] = React.useState(initialUnpaidInvoices);
  const [isLoading, setIsLoading] = React.useState(
    initialActiveRequests.length === 0 && initialCompletedCount === 0 && initialUnpaidInvoices === 0
  );

  React.useEffect(() => {
    const fetchFallback = async () => {
      try {
        const { api } = await import('@/lib/axios');
        const [reqRes, payRes] = await Promise.all([api.getMyRequests(), api.getMyPayments()]);

        const requests = reqRes?.data || [];
        if (Array.isArray(requests)) {
          const active = requests.filter((r: any) => !['COMPLETED', 'CANCELLED'].includes(r.status));
          setCompletedCount(requests.filter((r: any) => r.status === 'COMPLETED').length);
          setActiveRequests(
            active.map((r: any) => ({
              id: `REQ-${r.id.toString().padStart(4, '0')}`,
              rawId: r.id,
              serviceType: r.service?.name || 'Custom Service',
              status: r.status,
              priority: r.priority,
              createdAt: r.createdAt,
            }))
          );
        }

        const payments = payRes?.data || [];
        if (Array.isArray(payments)) {
          setUnpaidInvoices(
            payments.filter((p: any) => p.status === 'PENDING' || p.status === 'FAILED').length
          );
        }
      } catch (err) {
        console.error('Fallback fetch failed', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (
      initialActiveRequests.length === 0 &&
      initialCompletedCount === 0 &&
      initialUnpaidInvoices === 0
    ) {
      fetchFallback();
    }
  }, [initialActiveRequests, initialCompletedCount, initialUnpaidInvoices]);
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
