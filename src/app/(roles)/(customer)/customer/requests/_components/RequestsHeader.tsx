'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function RequestsHeader() {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={item}
      className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Service Requests</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Track and manage your ongoing project or support requests.
        </p>
      </div>
      <Link
        href="/customer/services/new"
        className="w-full md:w-auto bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center min-h-[48px] gap-2"
      >
        <span>New Request</span>
      </Link>
    </motion.div>
  );
}
