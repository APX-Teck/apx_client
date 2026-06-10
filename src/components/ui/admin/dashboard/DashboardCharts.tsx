"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  FunnelChart, Funnel, LabelList
} from "recharts";
import { chartData } from "@/services/admin/dashboardData";

const ChartContainer = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-[0px_4px_30px_rgba(0,0,0,0.2)] border border-gray-100 dark:border-white/5 flex flex-col h-[400px]">
    <h3 className="font-bold text-gray-900 dark:text-white mb-6 text-lg">{title}</h3>
    <div className="flex-1 w-full relative">
      {children}
    </div>
  </div>
);

export default function DashboardCharts({ data }: { data?: any }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="animate-pulse flex gap-6 h-[400px] w-full bg-gray-100 dark:bg-white/5 rounded-3xl" />;
  }

  // Use real data for serviceRequests if provided, otherwise fallback to mock data
  const serviceRequestsData = data?.requestsByStatus?.length ? data.requestsByStatus : chartData.serviceRequests;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* 1. Monthly Revenue Trend (Line Chart) */}
      <ChartContainer title="Monthly Revenue Trend">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.revenueTrend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6B7280', fontSize: 12 }}
              tickFormatter={(value) => `₹${value / 1000}k`}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', backgroundColor: '#1f2937', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value) => [`₹${value}`, "Revenue"]}
            />
            <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 2. Service Requests by Status (Donut Chart) */}
      <ChartContainer title="Service Requests by Status">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={serviceRequestsData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {serviceRequestsData.map((entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backgroundColor: '#1f2937', color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 3. New Requests Over Time (Bar Chart) */}
      <ChartContainer title="New Requests Over Time">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.requestsOverTime} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
            <Tooltip
              cursor={{ fill: '#374151', opacity: 0.1 }}
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
            />
            <Bar dataKey="requests" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 4. Task Completion Rate (Stacked Bar) */}
      <ChartContainer title="Task Completion Rate">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.taskCompletion} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
            <Tooltip
              cursor={{ fill: '#374151', opacity: 0.1 }}
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
            <Bar dataKey="done" stackId="a" fill="#10B981" radius={[0, 0, 4, 4]} />
            <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" />
            <Bar dataKey="open" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 5. Lead Conversion Funnel */}
      <ChartContainer title="Lead Conversion Funnel">
        <ResponsiveContainer width="100%" height="100%">
          <FunnelChart>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
            />
            <Funnel
              dataKey="value"
              data={chartData.leadFunnel}
              isAnimationActive
            >
              <LabelList position="right" fill="#6B7280" stroke="none" dataKey="stage" />
              {chartData.leadFunnel.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 6. Enquiry Sources (Pie Chart) */}
      <ChartContainer title="Enquiry Sources">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData.enquirySources}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              stroke="none"
              label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {chartData.enquirySources.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* 7. Blog Post Performance (Bar Chart) */}
      <div className="lg:col-span-2">
        <ChartContainer title="Top Blog Post Performance">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData.blogPerformance} margin={{ top: 5, right: 20, bottom: 25, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={15} angle={-15} textAnchor="end" />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
              <Tooltip
                cursor={{ fill: '#374151', opacity: 0.1 }}
                contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: '#1f2937', color: '#fff' }}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#6B7280' }} />
              <Bar dataKey="likes" fill="#ec4899" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="comments" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
