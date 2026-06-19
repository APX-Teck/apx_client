'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { SettingsHeader } from './SettingsHeader';
import { ProfileForm } from './ProfileForm';
import { SettingsCards } from './SettingsCards';
import { useProfileLogic } from '../_hooks/useProfileLogic';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

export default function ProfileManager() {
  const [mounted, setMounted] = useState(false);
  const {
    user,
    fullName,
    setFullName,
    phone,
    setPhone,
    isSubmitting,
    message,
    handleSubmit,
  } = useProfileLogic();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-4xl mx-auto space-y-8"
    >
      <SettingsHeader />
      <ProfileForm
        user={user}
        fullName={fullName}
        setFullName={setFullName}
        phone={phone}
        setPhone={setPhone}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        message={message}
      />
      <SettingsCards />
    </motion.div>
  );
}
