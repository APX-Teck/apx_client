'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Filter, Search, Loader2, ArrowRight, Clock, CheckCircle2, XCircle, AlertCircle, User } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/axios';

type RequestStatus = "NEW" | "IN_REVIEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

interface ServiceRequest {
  id: number;
  status: RequestStatus;
  priority: string;
  createdAt: string;
  service: { id: number; name: string };
  assignedTo?: { id: number; fullName: string };
}

const getStatusConfig = (status: RequestStatus) => {
  switch (status) {
    case 'NEW':
      return { label: 'New', color: 'text-blue-500', bg: 'bg-blue-500/10', icon: AlertCircle };
    case 'IN_REVIEW':
      return { label: 'In Review', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Clock };
    case 'IN_PROGRESS':
      return { label: 'In Progress', color: 'text-cyan-500', bg: 'bg-cyan-500/10', icon: Loader2 };
    case 'COMPLETED':
      return { label: 'Completed', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 };
    case 'CANCELLED':
      return { label: 'Cancelled', color: 'text-red-500', bg: 'bg-red-500/10', icon: XCircle };
    default:
      return { label: status, color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle };
  }
};

export default function CustomerRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    async function loadRequests() {
      setLoading(true);
      const res = await api.getMyRequests();
      setRequests(res.data || []);
      setLoading(false);
    }
    loadRequests();
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          `REQ-${req.id}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and manage your ongoing project or support requests.</p>
        </div>
        <Link href="/customer/services/new" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2">
          <span>New Request</span>
        </Link>
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={item} className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-[#111] p-4 rounded-2xl border border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          {['ALL', 'NEW', 'IN_PROGRESS', 'COMPLETED'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
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
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-white/5 border border-transparent focus:border-cyan-500/50 rounded-xl text-sm focus:outline-none transition-all dark:text-white"
          />
        </div>
      </motion.div>

      {/* Main Content Area */}
      {loading ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your requests...</p>
        </motion.div>
      ) : filteredRequests.length === 0 ? (
        <motion.div variants={item} className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px] text-center">
          <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-6">
            <ClipboardList className="w-10 h-10 text-cyan-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Requests Found</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            {searchQuery || statusFilter !== 'ALL' 
              ? "We couldn't find any requests matching your filters." 
              : "You currently don't have any open service requests. When you need help or want to start a new project, create one here."}
          </p>
          {(!searchQuery && statusFilter === 'ALL') && (
            <Link href="/customer/services/new" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all">
              Create New Request
            </Link>
          )}
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredRequests.map((req) => {
              const status = getStatusConfig(req.status);
              const StatusIcon = status.icon;
              return (
                <motion.div 
                  key={req.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white dark:bg-[#111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-cyan-500/30 hover:shadow-lg transition-all group flex flex-col overflow-hidden"
                >
                  <Link href={`/customer/requests/${req.id}`} className="flex flex-col h-full">
                    <div className="p-6 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {status.label}
                        </div>
                        <span className="text-xs font-semibold text-gray-400 dark:text-gray-500">REQ-{req.id.toString().padStart(4, '0')}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                        {req.service.name}
                      </h3>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Created on {new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                        {req.assignedTo && (
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <User className="w-4 h-4 text-gray-400" />
                            <span>Assigned to {req.assignedTo.fullName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="px-6 py-4 border-t border-gray-50 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                      <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">View Details</span>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-colors shadow-sm">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
