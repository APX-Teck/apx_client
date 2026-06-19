'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tab } from '../_hooks/useDashboardLogic';

interface Props {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'customers', label: 'Customers & Requests' },
  { id: 'revenue', label: 'Finance & Revenue' },
  { id: 'content', label: 'Content & Engagement' },
  { id: 'operations', label: 'CRM & Operations' },
];

export function DashboardTabs({ activeTab, setActiveTab }: Props) {
  return (
    <div className="mb-8 relative z-10 w-full">
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 bg-gray-100/80 dark:bg-black/40 backdrop-blur-md p-1.5 rounded-[1.25rem] w-full xl:max-w-max border border-gray-200/60 dark:border-white/5 shadow-inner">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 min-h-[44px] rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap flex-none text-center relative overflow-hidden group flex items-center justify-center ${
              activeTab === tab.id
                ? 'text-indigo-600 dark:text-indigo-300'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="relative z-10">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="active-tab"
                className="absolute inset-0 bg-white dark:bg-white/10 rounded-2xl z-0 shadow-[0_2px_15px_rgba(0,0,0,0.06)] dark:shadow-[0_2px_15px_rgba(255,255,255,0.05)] border border-gray-200/50 dark:border-white/10"
                initial={false}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}

            {/* Subtle hover effect for inactive tabs */}
            {activeTab !== tab.id && (
              <div className="absolute inset-0 bg-gray-200/50 dark:bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
