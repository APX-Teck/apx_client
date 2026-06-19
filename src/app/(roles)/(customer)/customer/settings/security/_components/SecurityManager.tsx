'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { PasswordForm } from './PasswordForm';
import { useSecurityLogic } from '../_hooks/useSecurityLogic';

export default function SecurityManager() {
  const { formData, handleInputChange, handleSave, isSubmitting, message } = useSecurityLogic();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 md:px-8 pt-4 pb-safe space-y-8"
    >
      <motion.div variants={item} className="flex items-center gap-4">
        <Link
          href="/customer/settings"
          className="p-2 rounded-xl bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 hover:border-cyan-500/30 text-gray-500 hover:text-cyan-500 transition-all flex items-center justify-center min-w-[44px] min-h-[48px]"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Security Settings</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Update your password to keep your account secure.
          </p>
        </div>
      </motion.div>

      <motion.div variants={item}>
        <PasswordForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          isSubmitting={isSubmitting}
          message={message}
        />
      </motion.div>
    </motion.div>
  );
}
