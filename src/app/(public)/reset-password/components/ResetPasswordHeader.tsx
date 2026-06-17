'use client';

import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function ResetPasswordHeader() {
  return (
    <header className="flex flex-col items-center mb-8">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
        aria-hidden="true"
      >
        <Lock className="w-7 h-7" aria-hidden="true" role="presentation" />
      </motion.div>
      <h1 id="reset-password-heading" className="text-3xl font-extrabold tracking-tight text-center">
        New Password
      </h1>
      <p className="text-foreground/60 text-sm mt-2 text-center">
        Create a strong, new password for your APXTeck account.
      </p>
    </header>
  );
}
