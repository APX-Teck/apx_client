'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import KPICard from '@/components/ui/admin/dashboard/KPICard';
import ActivityFeed from '@/components/ui/admin/dashboard/ActivityFeed';
const DashboardCharts = dynamic(
  () => import('@/components/ui/admin/dashboard/DashboardCharts'),
  { ssr: false, loading: () => <div className="animate-pulse h-[400px] w-full bg-gray-100/50 dark:bg-white/5 rounded-[2rem]" /> }
);
import { DashboardStats } from '@/services/admin/dashboard.service';
import { KPIData } from '@/services/admin/dashboardData';
import { Tab } from '../_hooks/useDashboardLogic';

interface Props {
  activeTab: Tab;
  stats: DashboardStats | null;
  customerKPIs: KPIData[];
  revenueKPIs: KPIData[];
  contentKPIs: KPIData[];
  leadsKPIs: KPIData[];
}

const tabVariants: any = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

export function DashboardContent({
  activeTab,
  stats,
  customerKPIs,
  revenueKPIs,
  contentKPIs,
  leadsKPIs,
}: Props) {
  return (
    <div className="min-h-[600px] relative">
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {revenueKPIs[1] && <KPICard data={revenueKPIs[1]} delay={0.0} />}
              {customerKPIs[0] && <KPICard data={customerKPIs[0]} delay={0.1} />}
              {leadsKPIs[0] && <KPICard data={leadsKPIs[0]} delay={0.2} />}
              {contentKPIs[0] && <KPICard data={contentKPIs[0]} delay={0.3} />}
            </div>

            <section className="pt-4">
              <DashboardCharts data={stats?.charts} />
            </section>

            <section className="pt-8 border-t border-gray-100 dark:border-white/5">
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Latest actions and events across the platform.
                </p>
              </div>
              <ActivityFeed data={stats?.activityFeed} />
            </section>
          </motion.div>
        )}

        {activeTab === 'customers' && (
          <motion.div
            key="customers"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Customer & Request Analytics
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed breakdown of client growth and service request volume.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {customerKPIs.map((kpi, index) => (
                <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'revenue' && (
          <motion.div
            key="revenue"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue & Finance</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed tracking of incoming payments, overdue invoices, and lifetime revenue.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {revenueKPIs.map((kpi, index) => (
                <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'content' && (
          <motion.div
            key="content"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Content & Engagement
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed metrics on blog output, user comments, and AI-generated content.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contentKPIs.map((kpi, index) => (
                <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'operations' && (
          <motion.div
            key="operations"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-8"
          >
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Operations & CRM</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Detailed metrics for internal operations, task tracking, and lead conversion.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {leadsKPIs.map((kpi, index) => (
                <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
