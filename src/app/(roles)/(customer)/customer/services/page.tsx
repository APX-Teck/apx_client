'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Code, Loader2, ArrowRight } from 'lucide-react';
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

export default function CustomerServicesPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyServices() {
      setLoading(true);
      // Fetching all requests to display as services
      const res = await api.getMyRequests();
      // Only keep non-cancelled requests for "My Services" view
      const activeRequests = (res.data || []).filter((r: ServiceRequest) => r.status !== 'CANCELLED');
      setRequests(activeRequests);
      setLoading(false);
    }
    fetchMyServices();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Services</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and view all your active APXTeck services.</p>
        </div>
        <Link href="/customer/services/new" className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all">
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </Link>
      </motion.div>

      {/* Services Grid */}
      {loading ? (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading your services...</p>
        </motion.div>
      ) : (
        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {requests.map((req) => (
              <motion.div 
                key={req.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:border-cyan-500/30 transition-all group flex flex-col h-full"
              >
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-6 shrink-0">
                  <Code className="w-6 h-6" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{req.service.name}</h3>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                  Service ID: REQ-{req.id.toString().padStart(4, '0')}<br/>
                  Started on {new Date(req.createdAt).toLocaleDateString()}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
                  <span className={`text-xs font-bold px-2 py-1 rounded-md ${
                    req.status === 'COMPLETED' ? 'text-emerald-500 bg-emerald-500/10' : 
                    req.status === 'IN_PROGRESS' ? 'text-cyan-500 bg-cyan-500/10' : 
                    'text-blue-500 bg-blue-500/10'
                  }`}>
                    {req.status.replace('_', ' ')}
                  </span>
                  <Link href={`/customer/requests/${req.id}`} className="text-xs font-bold text-cyan-600 hover:text-cyan-500 transition-colors flex items-center gap-1">
                    Manage <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty Placeholder Card / Add New Card */}
          <Link href="/customer/services/new" className="bg-gray-50 dark:bg-white/[0.02] p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all cursor-pointer min-h-[250px] group">
            <div className="w-12 h-12 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center shadow-sm mb-4 group-hover:bg-cyan-500 group-hover:text-black transition-colors">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-black" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-1">Explore Services</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Discover more ways we can help your business grow.</p>
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}
