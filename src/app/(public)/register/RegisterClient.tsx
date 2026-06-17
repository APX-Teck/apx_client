'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { useRegisterLogic } from '@/hooks/useRegisterLogic';
import { RegisterHeader } from './components/RegisterHeader';
import { RegisterSuccess } from './components/RegisterSuccess';
import { RegisterForm } from './components/RegisterForm';

export function RegisterClient() {
  const {
    isMounted,
    isLoading,
    errorMsg,
    successMsg,
    form,
    onSubmit,
  } = useRegisterLogic();

  if (!isMounted) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-lg"
    >
      <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
        <RegisterHeader />

        {successMsg ? (
          <RegisterSuccess successMsg={successMsg} />
        ) : (
          <RegisterForm 
            form={form} 
            onSubmit={form.handleSubmit(onSubmit)} 
            isLoading={isLoading} 
            errorMsg={errorMsg} 
          />
        )}
      </GlassCard>
    </motion.div>
  );
}
