'use client';

import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { KPIData } from '@/services/admin/dashboardData';

export default function KPICard({ data, delay = 0 }: { data: KPIData; delay?: number }) {
  const isUp = data.trend === 'up';
  const isDown = data.trend === 'down';
  const isNeutral = data.trend === 'neutral';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-gray-100/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:shadow-indigo-500/10 hover:-translate-y-1 hover:border-indigo-100 dark:hover:border-indigo-500/30 group"
    >
      {/* Soft gradient background glow */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500/5 to-purple-500/5 blur-2xl group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-colors duration-500" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {data.title}
        </p>

        {data.alert && (
          <div className="px-2 py-1 bg-red-50/80 dark:bg-red-500/10 backdrop-blur-sm rounded-lg border border-red-100 dark:border-red-500/20 flex items-center gap-1 shadow-sm">
            <AlertCircle size={12} className="text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">
              Attention
            </span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between relative z-10">
        <h3 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          {data.value}
        </h3>

        {data.percentage !== undefined && (
          <div
            className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1.5 rounded-xl shadow-sm backdrop-blur-sm ${
              isUp
                ? 'text-emerald-700 bg-emerald-100/80 border border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                : isDown
                  ? 'text-red-700 bg-red-100/80 border border-red-200/50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20'
                  : 'text-gray-600 bg-gray-100/80 border border-gray-200/50 dark:bg-white/5 dark:text-gray-400 dark:border-white/10'
            }`}
          >
            {isUp && <TrendingUp size={16} strokeWidth={2.5} />}
            {isDown && <TrendingDown size={16} strokeWidth={2.5} />}
            {isNeutral && <Minus size={16} strokeWidth={2.5} />}
            <span>{Math.abs(data.percentage)}%</span>
          </div>
        )}
      </div>

      {data.sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none">
          {/* Subtle gradient under the line */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-current to-transparent opacity-10"
            style={{ color: isUp ? '#10B981' : isDown ? '#EF4444' : '#6366f1' }}
          />

          <svg
            viewBox="0 0 100 20"
            preserveAspectRatio="none"
            className="w-full h-full relative z-10"
          >
            <polyline
              points={data.sparklineData
                .map(
                  (val, i) =>
                    `${(i / (data.sparklineData!.length - 1)) * 100},${20 - (val / Math.max(...data.sparklineData!)) * 20}`
                )
                .join(' ')}
              fill="none"
              stroke={isUp ? '#10B981' : isDown ? '#EF4444' : '#6366f1'}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
              className="drop-shadow-md"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
