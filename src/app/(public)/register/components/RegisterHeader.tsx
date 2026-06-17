'use client';

import { UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';

export function RegisterHeader() {
  return (
    <div className="flex flex-col items-center mb-8">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.2)]"
      >
        <UserPlus className="w-7 h-7" aria-hidden="true" role="presentation" />
      </motion.div>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create Account</h1>
      <p className="text-foreground/60 text-sm mt-2 text-center">
        Join APXTeck as a client partner and launch your digital projects.
      </p>
    </div>
  );
}
