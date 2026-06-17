'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLoginLogic } from '@/hooks/useLoginLogic';
import { LoginFormHeader } from './components/LoginFormHeader';
import { LoginAlerts } from './components/LoginAlerts';
import { LoginInputFields } from './components/LoginInputFields';
import { GoogleLoginButton } from './components/GoogleLoginButton';

export default function LoginClient() {
  const {
    form: {
      register,
      handleSubmit,
      formState: { errors },
    },
    onSubmit,
    handleResendVerification,
    isLoading,
    errorMsg,
    resendEmail,
    infoMsg,
    successMsg,
  } = useLoginLogic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-md relative z-10"
    >
      <div className="glass-panel p-8 sm:p-10 rounded-3xl relative z-10">
        <LoginFormHeader />

        <form suppressHydrationWarning onSubmit={handleSubmit(onSubmit)} className="space-y-5" aria-labelledby="login-heading" noValidate>
          <LoginAlerts
            errorMsg={errorMsg}
            infoMsg={infoMsg}
            successMsg={successMsg}
            resendEmail={!!resendEmail}
            onResendVerification={handleResendVerification}
          />

          <LoginInputFields
            register={register}
            errors={errors}
            isLoading={isLoading}
          />

          <div className="relative flex items-center py-2" aria-hidden="true">
            <div className="flex-grow border-t border-foreground/10"></div>
            <span className="flex-shrink-0 mx-4 text-foreground/40 text-[11px] font-bold uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-foreground/10"></div>
          </div>

          <GoogleLoginButton />

          <p className="text-center text-sm text-foreground/60 mt-6 font-medium">
            {"Don't have an account? "}
            <Link href="/register" className="text-accent hover:text-accent/80 font-bold transition-colors">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
