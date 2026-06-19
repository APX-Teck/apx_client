'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export function ServicesHeader() {
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Services</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage and view all your active APXTeck services.
        </p>
      </div>
      <Link
        href="/customer/services/new"
        className="flex items-center justify-center min-h-[48px] gap-2 bg-cyan-500 hover:bg-cyan-600 text-black font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all"
      >
        <Plus className="w-4 h-4" />
        <span>Add New Service</span>
      </Link>
    </motion.div>
  );
}
