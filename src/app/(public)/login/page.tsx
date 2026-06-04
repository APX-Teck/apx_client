"use client";

import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogIn, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login for now
    setTimeout(() => {
      setIsLoading(false);
      alert("Login logic will be connected to the backend API here!");
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-accent/30">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Abstract background for login */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/20 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <GlassCard className="p-8 sm:p-10 shadow-2xl border-accent/20">
            <div className="flex flex-col items-center mb-8">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-4 shadow-[0_0_20px_rgba(14,165,233,0.3)]"
              >
                <LogIn className="w-7 h-7" />
              </motion.div>
              <h1 className="text-3xl font-extrabold tracking-tight">Welcome Back</h1>
              <p className="text-foreground/60 text-sm mt-2 text-center">
                Sign in to the APXTeck Portal to manage your digital ecosystem.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                  placeholder="you@company.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold">Password</label>
                  <a href="#" className="text-xs text-accent hover:underline font-medium">Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background/50 border border-glass-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-accent/50 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="group w-full h-12 mt-4 rounded-xl bg-accent text-white font-bold hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 disabled:opacity-70 disabled:hover:scale-100"
              >
                {isLoading ? "Signing in..." : "Sign In"}
                {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
              </button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-glass-border"></div>
                <span className="flex-shrink-0 mx-4 text-foreground/40 text-xs font-medium">OR</span>
                <div className="flex-grow border-t border-glass-border"></div>
              </div>

              <button
                type="button"
                className="w-full h-12 rounded-xl bg-background/30 border border-glass-border hover:bg-white/5 font-medium active:scale-[0.98] transition-all flex items-center justify-center gap-3"
              >
                {/* Simple Google SVG icon */}
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </form>
          </GlassCard>
        </motion.div>
      </main>
    </div>
  );
}
