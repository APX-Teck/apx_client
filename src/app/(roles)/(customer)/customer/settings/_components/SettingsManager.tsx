'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ProfileForm } from './ProfileForm';
import { SettingsNavigation } from './SettingsNavigation';
import { useProfileSettingsLogic } from '../_hooks/useProfileSettingsLogic';

export default function SettingsManager() {
  const [mounted, setMounted] = useState(false);
  const { user, formData, handleInputChange, handleSave, isSubmitting, message } =
    useProfileSettingsLogic();

  useEffect(() => {
    setMounted(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (!mounted) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8"
    >
      {/* Header */}
      <motion.div variants={item}>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your profile, security, and notification preferences.
        </p>
      </motion.div>

      <motion.div variants={item}>
        <ProfileForm
          user={user}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSave={handleSave}
          isSubmitting={isSubmitting}
          message={message}
        />
      </motion.div>

      <motion.div variants={item}>
        <SettingsNavigation />
      </motion.div>
    </motion.div>
  );
}
