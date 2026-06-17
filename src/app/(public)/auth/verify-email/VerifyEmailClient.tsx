'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { ShieldAlert, Mail, Send, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useVerifyEmailLogic } from '@/hooks/useVerifyEmailLogic';

import { VerifyingState } from './components/VerifyingState';
import { LinkExpiredState } from './components/LinkExpiredState';
import { ResendVerificationForm } from './components/ResendVerificationForm';

export default function VerifyEmailClient() {
  const {
    isMounted,
    verifying,
    errorState,
    isResending,
    resendSuccess,
    resendError,
    form,
    onResendSubmit,
  } = useVerifyEmailLogic();

  if (!isMounted) return null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-md"
      aria-labelledby="verify-email-heading"
    >
      <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
        {verifying ? (
          <VerifyingState />
        ) : errorState ? (
          <section className="space-y-6" aria-live="assertive">
            <LinkExpiredState errorState={errorState} />

            <div className="h-px bg-glass-border w-full my-6" aria-hidden="true" />

            <ResendVerificationForm
              resendSuccess={resendSuccess}
              resendError={resendError}
              isResending={isResending}
              form={form}
              onResendSubmit={onResendSubmit}
            />

            <nav className="text-center pt-4" aria-label="Back to Login Navigation">
              <Link
                href="/login"
                className="text-xs text-foreground/50 hover:text-foreground font-semibold"
              >
                Back to Sign In
              </Link>
            </nav>
          </section>
        ) : null}
      </GlassCard>
    </motion.article>
  );
}
