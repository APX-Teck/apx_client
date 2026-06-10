'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  ClipboardList, 
  CreditCard, 
  ExternalLink, 
  Plus, 
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';

interface RequestItem {
  id: string;
  serviceType: string;
  status: 'NEW' | 'IN_REVIEW' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [activeRequests, setActiveRequests] = useState<RequestItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    setMounted(true);
    async function loadDashboardData() {
      const res = await api.getMyRequests();
      const requests = res.data || [];
      
      const active = requests.filter((r: any) => !['COMPLETED', 'CANCELLED'].includes(r.status));
      const completed = requests.filter((r: any) => r.status === 'COMPLETED').length;
      
      // Map back to RequestItem shape expected by the UI
      setActiveRequests(active.map((r: any) => ({
        id: `REQ-${r.id.toString().padStart(4, '0')}`,
        rawId: r.id, // For linking
        serviceType: r.service?.name || 'Custom Service',
        status: r.status,
        priority: r.priority,
        createdAt: r.createdAt
      })));
      setCompletedCount(completed);
    }
    loadDashboardData();
  }, []);

  if (!mounted) return null;

  const getStatusBadge = (status: RequestItem['status']) => {
    switch (status) {
      case 'NEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">New</span>;
      case 'IN_REVIEW':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">In Review</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 animate-pulse">In Progress</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Completed</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-red-500/10 text-red-500 border border-red-500/20">Cancelled</span>;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div variants={item} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-black dark:from-[#0a0a0a] dark:to-[#111] p-8 md:p-10 border border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Premium Workspace</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">{user?.fullName || 'Client'}</span>
              </h1>
              <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
                Here's what's happening with your projects today. Track your active requests, manage invoices, or request brand-new IT solutions instantly.
              </p>
            </div>
          </div>
          <button className="shrink-0 inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 h-12 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all cursor-pointer">
            <Plus className="w-5 h-5" />
            <span>Request New Service</span>
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-cyan-500/30 transition-all group flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Active Requests</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 dark:text-white">{activeRequests.length}</h3>
              <span className="text-sm font-medium text-cyan-500">In Progress</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-cyan-500/20 dark:to-cyan-500/5 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform">
            <ClipboardList className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-amber-500/30 transition-all group flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Unpaid Invoices</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 dark:text-white">1</h3>
              <span className="text-sm font-medium text-amber-500">Pending</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-500/20 dark:to-amber-500/5 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
            <CreditCard className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all group flex items-center justify-between">
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Projects Completed</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-4xl font-black text-gray-900 dark:text-white">{completedCount}</h3>
              <span className="text-sm font-medium text-emerald-500">Total</span>
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-500/20 dark:to-emerald-500/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-7 h-7" />
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Table & Info Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Requests Table */}
        <motion.div variants={item} className="lg:col-span-2 bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Recent Service Requests</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the status of your ongoing and past requests.</p>
            </div>
            <Link href="/customer/requests" className="hidden sm:flex items-center gap-1 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-4 pr-4">Request ID</th>
                  <th className="py-4 px-4">Service Details</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 pl-4 text-right">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium text-gray-800 dark:text-gray-200">
                {activeRequests.slice(0, 5).map((req: any) => (
                  <tr 
                    key={req.id} 
                    onClick={() => window.location.href = `/customer/requests/${req.rawId}`}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pr-4 font-mono text-cyan-600 dark:text-cyan-400 font-bold">{req.id}</td>
                    <td className="py-4 px-4 font-semibold">{req.serviceType}</td>
                    <td className="py-4 px-4">{getStatusBadge(req.status)}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-md border ${
                        req.priority === 'HIGH' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        req.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-gray-500/10 text-gray-500 border-gray-500/20 dark:text-gray-400'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-right text-gray-500 dark:text-gray-400 font-mono text-xs">
                      {new Date(req.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
                {activeRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No active service requests found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <Link href="/customer/requests" className="sm:hidden w-full flex items-center justify-center gap-2 py-3 mt-2 rounded-xl bg-gray-50 dark:bg-white/5 text-sm font-bold text-gray-900 dark:text-white border border-gray-100 dark:border-white/5">
            <span>View All Requests</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Right Sidebar panels */}
        <motion.div variants={item} className="space-y-6">
          {/* Support Panel */}
          <div className="bg-gradient-to-br from-cyan-600 to-indigo-700 p-6 md:p-8 rounded-3xl text-white shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <Zap className="w-24 h-24" />
            </div>
            
            <div className="relative z-10 space-y-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-cyan-200" />
                <span>Dedicated Support</span>
              </h4>
              <p className="text-sm text-cyan-100/80 leading-relaxed font-medium">
                Need custom configurations, layout changes, or urgent deployments? Chat with our team or raise high-priority tickets directly.
              </p>
              <Link href="mailto:support@apxteck.com" className="w-full py-3 rounded-xl bg-white text-cyan-700 hover:bg-cyan-50 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer">
                <span>Contact Account Manager</span>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white mb-2">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/customer/payments" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-transparent hover:border-cyan-200 dark:hover:border-cyan-500/30 transition-all text-center group">
                <CreditCard className="w-6 h-6 text-gray-400 group-hover:text-cyan-500 transition-colors" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">Pay Invoice</span>
              </Link>
              <Link href="/customer/requests" className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all text-center group">
                <Clock className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">History</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
