'use client';
import React, { useEffect, useState } from 'react';
import { Code2 } from 'lucide-react';
import { ToastState } from '../SettingsManager';

interface Props {
  setToast: (toast: ToastState) => void;
}

export function DeveloperTab({ setToast }: Props) {
  const [devMode, setDevMode] = useState(false);
  const [networkLatency, setNetworkLatency] = useState(false);

  useEffect(() => {
    setDevMode(localStorage.getItem('apx_dev_mode') === 'true');
    setNetworkLatency(localStorage.getItem('apx_dev_latency') === 'true');
  }, []);

  const saveDevSettings = () => {
    localStorage.setItem('apx_dev_mode', devMode.toString());
    localStorage.setItem('apx_dev_latency', networkLatency.toString());
    setToast({ message: 'Developer options saved', type: 'success' });
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Code2 size={20} className="text-indigo-500" /> Developer Options
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Advanced diagnostic tools for dashboard administrators and engineers.
        </p>
      </div>

      <div className="p-6 space-y-6 min-h-[400px]">
        <div className="flex items-start justify-between gap-4 p-4 border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-2xl">
          <div>
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-400 mb-1">
              Enable Developer Mode
            </h3>
            <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70">
              Unlocks raw JSON payloads, exact timestamps, and internal UUIDs in tooltips across the
              platform.
            </p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input
              type="checkbox"
              id="dev_mode"
              checked={devMode}
              onChange={(e) => setDevMode(e.target.checked)}
              className="peer sr-only"
            />
            <label
              htmlFor="dev_mode"
              className="w-11 h-6 min-h-[24px] bg-gray-300 dark:bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 cursor-pointer flex items-center"
            ></label>
          </div>
        </div>

        <div className="flex items-start justify-between gap-4 p-4 border border-gray-200 dark:border-white/10 rounded-2xl">
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
              Simulate Network Latency
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Adds an artificial 1.5s delay to all outgoing API requests to test loading states.
            </p>
          </div>
          <div className="relative flex items-center shrink-0">
            <input
              type="checkbox"
              id="dev_latency"
              checked={networkLatency}
              onChange={(e) => setNetworkLatency(e.target.checked)}
              className="peer sr-only"
            />
            <label
              htmlFor="dev_latency"
              className="w-11 h-6 min-h-[24px] bg-gray-200 dark:bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500 cursor-pointer flex items-center"
            ></label>
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={saveDevSettings}
            className="bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 px-6 py-2.5 min-h-[48px] flex items-center justify-center rounded-xl text-sm font-bold shadow-md transition-colors"
          >
            Apply Developer Settings
          </button>
        </div>
      </div>
    </div>
  );
}
