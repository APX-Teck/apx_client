"use client";

import React from "react";
import { TrendingUp, TrendingDown, AlertCircle, Minus } from "lucide-react";
import { motion } from "framer-motion";
import { KPIData } from "@/services/admin/dashboardData";

export default function KPICard({ data, delay = 0 }: { data: KPIData; delay?: number }) {
  const isUp = data.trend === "up";
  const isDown = data.trend === "down";
  const isNeutral = data.trend === "neutral";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_30px_rgba(0,0,0,0.2)] flex flex-col justify-between relative overflow-hidden transition-all hover:shadow-md dark:hover:border-white/10 group"
    >
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{data.title}</p>

        {data.alert && (
          <div className="px-2 py-1 bg-red-50 dark:bg-red-500/10 rounded-md border border-red-100 dark:border-red-500/20 flex items-center gap-1">
            <AlertCircle size={12} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Attention</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between">
        <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          {data.value}
        </h3>

        {data.percentage !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${isUp ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400" :
              isDown ? "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400" :
                "text-gray-500 bg-gray-50 dark:bg-white/5 dark:text-gray-400"
            }`}>
            {isUp && <TrendingUp size={16} />}
            {isDown && <TrendingDown size={16} />}
            {isNeutral && <Minus size={16} />}
            <span>{Math.abs(data.percentage)}%</span>
          </div>
        )}
      </div>

      {data.sparklineData && (
        <div className="absolute bottom-0 left-0 right-0 h-12 opacity-20 group-hover:opacity-40 transition-opacity pointer-events-none">
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-full">
            <polyline
              points={data.sparklineData.map((val, i) => `${(i / (data.sparklineData!.length - 1)) * 100},${20 - (val / Math.max(...data.sparklineData!)) * 20}`).join(" ")}
              fill="none"
              stroke={isUp ? "#10B981" : isDown ? "#EF4444" : "#6366f1"}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
