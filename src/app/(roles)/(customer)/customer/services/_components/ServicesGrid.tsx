'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Code, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ServiceRequest } from '../types';

interface ServicesGridProps {
  services: ServiceRequest[];
  isLoading: boolean;
}

export function ServicesGrid({ services, isLoading }: ServicesGridProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-[#111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm animate-pulse flex flex-col h-[250px]"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-white/10 mb-6 shrink-0"></div>
            <div className="h-6 w-3/4 bg-gray-200 dark:bg-white/10 rounded mb-2"></div>
            <div className="space-y-2 mb-6 flex-1 mt-2">
              <div className="h-4 w-1/2 bg-gray-200 dark:bg-white/10 rounded"></div>
              <div className="h-4 w-2/3 bg-gray-200 dark:bg-white/10 rounded mt-1"></div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-between items-center">
              <div className="h-6 w-24 bg-gray-200 dark:bg-white/10 rounded-md"></div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {services.map((req) => (
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

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {req.service.name}
            </h3>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
              Service ID: REQ-{req.id.toString().padStart(4, '0')}
              <br />
              Started on {new Date(req.createdAt).toLocaleDateString()}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              <span
                className={`text-xs font-bold px-2 py-1 rounded-md ${
                  req.status === 'COMPLETED'
                    ? 'text-emerald-500 bg-emerald-500/10'
                    : req.status === 'IN_PROGRESS'
                      ? 'text-cyan-500 bg-cyan-500/10'
                      : 'text-blue-500 bg-blue-500/10'
                }`}
              >
                {req.status.replace('_', ' ')}
              </span>
              <Link
                href={`/customer/requests/${req.id}`}
                className="text-xs font-bold text-cyan-600 hover:text-cyan-500 transition-colors flex items-center justify-center min-h-[48px] px-2 gap-1"
              >
                Manage <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Empty Placeholder Card / Add New Card */}
      <Link
        href="/customer/services/new"
        className="bg-gradient-to-br from-gray-50 to-white dark:from-[#151515] dark:to-[#111] p-6 rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 flex flex-col items-center justify-center text-center hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all cursor-pointer min-h-[250px] group"
      >
        <div className="w-14 h-14 rounded-full bg-cyan-50 dark:bg-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-cyan-500 transition-all duration-300 shadow-sm relative">
          <div className="absolute inset-0 bg-cyan-500/20 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Plus className="w-6 h-6 text-cyan-600 dark:text-cyan-400 group-hover:text-black relative z-10" />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-lg">
          Explore New Services
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px]">
          Discover more ways we can help your business grow and scale.
        </p>
      </Link>
    </motion.div>
  );
}
