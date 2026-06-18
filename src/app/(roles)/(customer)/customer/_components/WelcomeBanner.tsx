'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/providers/AuthProvider';

export function WelcomeBanner() {
  const { user } = useAuth();

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-gray-900 to-black dark:from-[#0a0a0a] dark:to-[#111] p-6 md:p-10 border border-cyan-500/20 shadow-[0_10px_40px_-10px_rgba(6,182,212,0.2)]"
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
        <div className="space-y-4 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Premium Workspace</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Welcome back,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                {user?.fullName || 'Client'}
              </span>
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl leading-relaxed">
              Here's what's happening with your projects today. Track your active requests, manage
              invoices, or request brand-new IT solutions instantly.
            </p>
          </div>
        </div>
        <Link
          href="/customer/services"
          className="shrink-0 inline-flex items-center justify-center w-full md:w-auto gap-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 h-12 rounded-xl md:rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5" />
          <span>Request New Service</span>
        </Link>
      </div>
    </motion.div>
  );
}
