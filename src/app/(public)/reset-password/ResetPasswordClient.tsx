'use client';

import { Suspense } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { motion } from 'framer-motion';
import { useResetPasswordLogic } from '@/hooks/useResetPasswordLogic';
import { ResetPasswordHeader } from './components/ResetPasswordHeader';
import { ResetPasswordForm } from './components/ResetPasswordForm';

function ResetPasswordFormWrapper() {
  const {
    isMounted,
    isLoading,
    errorMsg,
    token,
    form,
    onSubmit,
  } = useResetPasswordLogic();

  if (!isMounted) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md relative z-10"
      aria-labelledby="reset-password-heading"
    >
      <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
        <ResetPasswordHeader />

        <ResetPasswordForm 
          form={form} 
          onSubmit={form.handleSubmit(onSubmit)} 
          isLoading={isLoading} 
          errorMsg={errorMsg} 
          token={token} 
        />
      </GlassCard>
    </motion.section>
  );
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-md h-[400px] flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-2xl border border-glass-border" aria-label="Loading form...">
        <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ResetPasswordFormWrapper />
    </Suspense>
  );
}
