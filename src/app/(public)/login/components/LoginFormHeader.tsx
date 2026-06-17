'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function LoginFormHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="relative w-40 h-14 mb-4"
      >
        <Image
          src="/APXTeck.png"
          alt="APXTeck Logo"
          fill
          sizes="160px"
          className="object-contain"
          priority
        />
      </motion.div>
      <h1 id="login-heading" className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
      <p className="text-foreground/60 text-sm mt-1 text-center font-medium">
        Sign in to your account
      </p>
    </div>
  );
}
