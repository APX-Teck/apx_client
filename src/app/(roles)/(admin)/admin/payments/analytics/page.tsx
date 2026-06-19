'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { paymentsService } from '@/services/admin/payments.service';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { TrendingUp, DollarSign, Activity, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function PaymentAnalyticsPage() {
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsService.getPayments(),
  });

  const payments = paymentsData?.payments || [];

  const { statusData, revenueOverTime, totalRevenue, pendingRevenue } = useMemo(() => {
    if (!payments.length)
      return { statusData: [], revenueOverTime: [], totalRevenue: 0, pendingRevenue: 0 };

    let paid = 0,
      pending = 0,
      sent = 0,
      failed = 0;
    let totalRev = 0;
    let pendRev = 0;

    const revMap: Record<string, number> = {};

    payments.forEach((p) => {
      // Status Counts
      if (p.status === 'PAID') paid++;
      else if (p.status === 'PENDING') pending++;
      else if (p.status === 'SENT') sent++;
      else if (p.status === 'FAILED') failed++;

      // Revenue
      if (p.status === 'PAID') {
        totalRev += Number(p.amountPaid) || Number(p.negotiatedAmount);
        const dateKey = format(new Date(p.paidAt || p.createdAt), 'MMM dd');
        revMap[dateKey] =
          (revMap[dateKey] || 0) + (Number(p.amountPaid) || Number(p.negotiatedAmount));
      } else if (p.status === 'PENDING' || p.status === 'SENT') {
        pendRev += Number(p.negotiatedAmount);
      }
    });

    const statusData = [
      { name: 'Paid', value: paid },
      { name: 'Sent', value: sent },
      { name: 'Pending', value: pending },
      { name: 'Failed', value: failed },
    ].filter((s) => s.value > 0);

    const revenueOverTime = Object.keys(revMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date,
        revenue: revMap[date],
      }));

    return { statusData, revenueOverTime, totalRevenue: totalRev, pendingRevenue: pendRev };
  }, [payments]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 text-gray-900 dark:text-white pb-safe">
        <div className="mb-8 animate-pulse">
          <div className="h-8 w-64 bg-gray-200 dark:bg-white/10 rounded-lg mb-4"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-white/5 rounded-lg max-w-full"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white/50 dark:bg-[#111111]/50 border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 h-[140px] animate-pulse">
              <div className="h-5 w-32 bg-gray-200 dark:bg-white/10 rounded-md mb-6"></div>
              <div className="h-8 w-40 bg-gray-200 dark:bg-white/10 rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white/50 dark:bg-[#111111]/50 border border-gray-200/50 dark:border-white/5 rounded-[2rem] p-6 h-[400px] animate-pulse">
              <div className="h-6 w-48 bg-gray-200 dark:bg-white/10 rounded-md mb-6"></div>
              <div className="h-72 w-full bg-gray-200 dark:bg-white/5 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-center h-[50vh]">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-red-100 dark:border-red-500/20">
          <AlertCircle size={40} strokeWidth={2} />
        </div>
        <h2 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white mb-2">Failed to load analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">There was an error securely fetching your payment data.</p>
      </div>
    );
  }

  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '16px',
    color: '#111',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(12px)',
    padding: '12px 16px',
    fontWeight: 'bold',
  };

  const customDarkTooltipStyle = {
    backgroundColor: 'rgba(17, 17, 17, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    color: '#fff',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(12px)',
    padding: '12px 16px',
    fontWeight: 'bold',
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 md:p-8 text-gray-900 dark:text-white pb-safe"
    >
      <motion.div variants={itemVariants} className="mb-8 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-indigo-100/50 dark:border-indigo-500/20">
            <TrendingUp size={28} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Payment Analytics</h1>
            <p className="text-base font-medium text-gray-500 dark:text-gray-400 mt-1">
              Insights and metrics about your invoice payments and revenue.
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 relative z-10">
        {/* Metric Card 1 */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125" />
          <div className="flex items-center gap-3 mb-5 text-gray-500 dark:text-gray-400 relative z-10">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <DollarSign size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-extrabold text-[13px] tracking-widest uppercase">Total Revenue</h3>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">
            {formatCurrency(totalRevenue)}
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125" />
          <div className="flex items-center gap-3 mb-5 text-gray-500 dark:text-gray-400 relative z-10">
            <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-extrabold text-[13px] tracking-widest uppercase">Pending Revenue</h3>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">
            {formatCurrency(pendingRevenue)}
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125" />
          <div className="flex items-center gap-3 mb-5 text-gray-500 dark:text-gray-400 relative z-10">
            <div className="w-10 h-10 bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center shrink-0">
              <TrendingUp size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-extrabold text-[13px] tracking-widest uppercase">Total Invoices</h3>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">
            {payments.length}
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 dark:bg-red-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-125" />
          <div className="flex items-center gap-3 mb-5 text-gray-500 dark:text-gray-400 relative z-10">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle size={20} strokeWidth={2.5} />
            </div>
            <h3 className="font-extrabold text-[13px] tracking-widest uppercase">Unpaid Invoices</h3>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white tracking-tight relative z-10">
            {payments.filter((p) => p.status !== 'PAID').length}
          </div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        {/* Revenue Chart */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-8">Revenue Over Time</h3>
          <div className="h-80 w-full relative">
            {revenueOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueOverTime} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-800" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                    fontWeight={500}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => '₹' + value}
                    dx={-10}
                    fontWeight={500}
                  />
                  <RechartsTooltip
                    contentStyle={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? customDarkTooltipStyle : customTooltipStyle}
                    itemStyle={{ color: '#10b981' }}
                    labelStyle={{ color: '#6b7280', marginBottom: '4px' }}
                    formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                    cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={4}
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, strokeWidth: 3, stroke: '#fff' }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold tracking-wide uppercase text-sm">
                Not enough data yet
              </div>
            )}
          </div>
        </div>

        {/* Status Chart */}
        <div className="bg-white/80 dark:bg-[#111111]/80 backdrop-blur-xl border border-gray-200/80 dark:border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <h3 className="text-xl font-black tracking-tight text-gray-900 dark:text-white mb-8">Status Distribution</h3>
          <div className="h-80 w-full relative">
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="45%"
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    animationDuration={1500}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? customDarkTooltipStyle : customTooltipStyle}
                    itemStyle={{ fontWeight: 'bold' }}
                    labelStyle={{ display: 'none' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-gray-700 dark:text-gray-300 font-bold ml-1.5">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold tracking-wide uppercase text-sm">
                Not enough data yet
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
