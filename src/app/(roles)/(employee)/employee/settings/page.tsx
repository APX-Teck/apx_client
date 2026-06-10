"use client";

import React from "react";
import { Settings } from "lucide-react";

export default function EmployeeSettingsPage() {
  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-gray-500" />
          Settings
        </h1>
      </div>
      <div className="bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center">
        <p className="text-gray-500 dark:text-gray-400 mt-2">Account settings coming soon.</p>
      </div>
    </div>
  );
}
