'use client';
import React, { useRef } from 'react';
import { Download, Upload, Trash } from 'lucide-react';
import { ToastState } from '../SettingsManager';

interface Props {
  setToast: (toast: ToastState) => void;
}

export function DataCacheTab({ setToast }: Props) {
  const fileReaderRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const data = JSON.stringify(localStorage);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `apx-settings-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setToast({ message: 'Settings exported successfully', type: 'success' });
    } catch (e) {
      setToast({ message: 'Failed to export settings', type: 'error' });
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        Object.keys(json).forEach((key) => {
          localStorage.setItem(key, json[key]);
        });
        setToast({ message: 'Settings imported successfully! Reloading...', type: 'success' });
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        setToast({ message: 'Invalid backup file', type: 'error' });
      }
    };
    reader.readAsText(file);
  };

  const handleClearCache = () => {
    if (
      window.confirm(
        'WARNING: This will clear all local dashboard preferences. You will be logged out. Proceed?'
      )
    ) {
      localStorage.clear();
      sessionStorage.clear();
      setToast({ message: 'Cache cleared. Reloading...', type: 'loading' });
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <div className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Data & Cache Management</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Export your configurations, clear local cache, or restore backups.
        </p>
      </div>

      <div className="p-6 space-y-6 min-h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-gray-50 dark:bg-[#151515]">
            <Download className="text-indigo-500 mb-3" size={28} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Export Settings</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Download a JSON backup of your current local dashboard configurations.
            </p>
            <button
              onClick={handleExport}
              className="bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 px-4 py-2 min-h-[48px] flex items-center justify-center rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Download JSON
            </button>
          </div>

          <div className="border border-gray-200 dark:border-white/10 rounded-2xl p-6 bg-gray-50 dark:bg-[#151515]">
            <Upload className="text-emerald-500 mb-3" size={28} />
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Import Settings</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Restore your dashboard settings from a previously downloaded JSON file.
            </p>
            <input
              type="file"
              ref={fileReaderRef}
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileReaderRef.current?.click()}
              className="bg-white dark:bg-[#222] border border-gray-200 dark:border-white/10 px-4 py-2 min-h-[48px] flex items-center justify-center rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Upload JSON
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-white/5"></div>

        <div>
          <h3 className="font-bold text-red-600 mb-1 flex items-center gap-2">
            <Trash size={16} /> Danger Zone
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Wipe all local storage, preferences, and session data. This is useful for resetting a
            broken UI state.
          </p>
          <button
            onClick={handleClearCache}
            className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 px-4 py-2 min-h-[48px] flex items-center justify-center rounded-lg text-sm font-bold transition-colors"
          >
            Clear Local Cache
          </button>
        </div>
      </div>
    </div>
  );
}
