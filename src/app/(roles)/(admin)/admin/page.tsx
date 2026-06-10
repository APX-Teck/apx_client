"use client";

import React, { useState, useEffect } from "react";
import KPICard from "@/components/ui/admin/dashboard/KPICard";
import ActivityFeed from "@/components/ui/admin/dashboard/ActivityFeed";
import DashboardCharts from "@/components/ui/admin/dashboard/DashboardCharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  mockCustomerKPIs, 
  mockRevenueKPIs, 
  mockContentKPIs, 
  mockLeadsKPIs 
} from "@/services/admin/dashboardData";

type Tab = "overview" | "customers" | "revenue" | "content" | "operations";

export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "customers", label: "Customers & Requests" },
    { id: "revenue", label: "Finance & Revenue" },
    { id: "content", label: "Content & Engagement" },
    { id: "operations", label: "CRM & Operations" },
  ];

  const tabVariants: any = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="space-y-8 pb-12 max-w-[1600px] mx-auto overflow-hidden">
      
      {/* Header and Tabs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6 mb-8 border-b border-gray-100 dark:border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Welcome back! Here is a summary of platform performance.</p>
        </div>
        <div className="flex bg-gray-100/80 dark:bg-white/5 p-1.5 rounded-xl w-full xl:w-auto overflow-x-auto no-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-white dark:bg-[#111] text-indigo-600 dark:text-indigo-400 shadow-[0_2px_10px_rgba(0,0,0,0.05)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)]"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200/50 dark:hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              {/* Top 4 Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockRevenueKPIs[1] && <KPICard data={mockRevenueKPIs[1]} delay={0.0} />}
                {mockCustomerKPIs[0] && <KPICard data={mockCustomerKPIs[0]} delay={0.1} />}
                {mockLeadsKPIs[0] && <KPICard data={mockLeadsKPIs[0]} delay={0.2} />}
                {mockContentKPIs[0] && <KPICard data={mockContentKPIs[0]} delay={0.3} />}
              </div>

              {/* Dashboard Charts & Visualizations */}
              <section className="pt-4">
                <DashboardCharts />
              </section>

              {/* Activity Feed */}
              <section className="pt-8 border-t border-gray-100 dark:border-white/5">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Latest actions and events across the platform.</p>
                </div>
                <ActivityFeed />
              </section>
            </motion.div>
          )}

          {activeTab === "customers" && (
            <motion.div key="customers" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer & Request Analytics</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed breakdown of client growth and service request volume.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {mockCustomerKPIs.map((kpi, index) => (
                  <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "revenue" && (
            <motion.div key="revenue" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
               <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue & Finance</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed tracking of incoming payments, overdue invoices, and lifetime revenue.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockRevenueKPIs.map((kpi, index) => (
                  <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "content" && (
            <motion.div key="content" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Content & Engagement</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed metrics on blog output, user comments, and AI-generated content.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockContentKPIs.map((kpi, index) => (
                  <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "operations" && (
            <motion.div key="operations" variants={tabVariants} initial="hidden" animate="visible" exit="exit" className="space-y-8">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Operations & CRM</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Detailed metrics for internal operations, task tracking, and lead conversion.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mockLeadsKPIs.map((kpi, index) => (
                  <KPICard key={kpi.title} data={kpi} delay={index * 0.05} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
