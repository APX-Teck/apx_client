'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Image as ImageIcon,
  Palette,
  Database,
  Code2,
  Monitor,
  Settings,
} from 'lucide-react';

import { AccountTab } from './tabs/AccountTab';
import { HeroBannersTab } from './tabs/HeroBannersTab';
import { AppearanceTab } from './tabs/AppearanceTab';
import { DataCacheTab } from './tabs/DataCacheTab';
import { DeveloperTab } from './tabs/DeveloperTab';
import { SystemInfoTab } from './tabs/SystemInfoTab';
import { Toast } from './Toast';
import { HeroBanner } from '@/app/types/home.types';

export type TabType = 'account' | 'hero' | 'appearance' | 'data' | 'developer' | 'system';
export type ToastState = { message: string; type: 'success' | 'error' | 'loading' } | null;

interface Props {
  initialBanners: HeroBanner[];
}

export default function SettingsManager({ initialBanners }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('account');
  const [toast, setToast] = useState<ToastState>(null);

  const TabButton = ({
    id,
    icon,
    title,
  }: {
    id: TabType;
    icon: React.ReactNode;
    title: string;
  }) => {
    const isActive = activeTab === id;
    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center justify-between min-h-[48px] px-4 py-3 rounded-xl font-bold text-sm transition-all ${
          isActive
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
        }`}
      >
        <div className="flex items-center gap-3">
          {icon}
          {title}
        </div>
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Settings size={24} />
            </div>
            Advanced Site Settings
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Configure enterprise-grade platform parameters, system cache, and UI preferences.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <TabButton id="account" icon={<User size={18} />} title="My Account" />
          <TabButton id="hero" icon={<ImageIcon size={18} />} title="Homepage Sliders" />
          <TabButton id="appearance" icon={<Palette size={18} />} title="Appearance & Theme" />
          <TabButton id="data" icon={<Database size={18} />} title="Data & Cache" />
          <TabButton id="developer" icon={<Code2 size={18} />} title="Developer Options" />
          <TabButton id="system" icon={<Monitor size={18} />} title="System Info" />
        </div>

        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'account' && <AccountTab setToast={setToast} />}
              {activeTab === 'hero' && (
                <HeroBannersTab initialBanners={initialBanners} setToast={setToast} />
              )}
              {activeTab === 'appearance' && <AppearanceTab setToast={setToast} />}
              {activeTab === 'data' && <DataCacheTab setToast={setToast} />}
              {activeTab === 'developer' && <DeveloperTab setToast={setToast} />}
              {activeTab === 'system' && <SystemInfoTab setToast={setToast} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}
