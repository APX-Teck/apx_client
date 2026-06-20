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
      control,
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
      className="w-full max-w-md relative z-10 px-4 sm:px-0"
    >
      <div className="glass-panel p-6 sm:p-8 md:p-10 rounded-[2rem] sm:rounded-3xl relative z-10 flex flex-col w-full">
        <LoginFormHeader />

        <form
          suppressHydrationWarning
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          aria-labelledby="login-heading"
          noValidate
        >
          <LoginAlerts
            errorMsg={errorMsg}
            infoMsg={infoMsg}
            successMsg={successMsg}
            resendEmail={!!resendEmail}
            onResendVerification={handleResendVerification}
          />

          <LoginInputFields register={register} errors={errors} isLoading={isLoading} control={control} />

          <div className="relative flex items-center py-2" aria-hidden="true">
            <div className="flex-grow border-t border-foreground/10"></div>
            <span className="flex-shrink-0 mx-4 text-foreground/40 text-[11px] font-bold uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-foreground/10"></div>
          </div>

          <GoogleLoginButton />

          <div className="text-center mt-6">
            <p className="text-sm text-foreground/60 font-medium inline-flex items-center gap-1">
              {"Don't have an account? "}
              <Link
                href="/register"
                className="text-accent hover:text-accent/80 font-bold transition-colors inline-flex items-center justify-center min-h-[44px] min-w-[44px] px-2 rounded-full"
                aria-label="Create a new APXTeck Account"
              >
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
