'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface RequestsFilterProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
}

export function RequestsFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
}: RequestsFilterProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/5"
    >
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
        {['ALL', 'NEW', 'IN_PROGRESS', 'COMPLETED'].map((filter) => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            className={`px-4 py-2 min-h-[48px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
              statusFilter === filter
                ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
            }`}
          >
            {filter === 'ALL' ? 'All Requests' : filter.replace('_', ' ')}
          </button>
        ))}
      </div>
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by ID or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 min-h-[48px] bg-gray-50 dark:bg-white/5 border border-transparent focus:border-cyan-500/50 rounded-xl text-sm focus:outline-none transition-all dark:text-white"
        />
      </div>
    </motion.div>
  );
}
