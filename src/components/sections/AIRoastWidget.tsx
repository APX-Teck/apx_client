'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ArrowRight, Loader2, Link2, Terminal, AlertTriangle } from 'lucide-react';
import { ScrambleText } from '@/components/ui/ScrambleText';
import Link from 'next/link';

const ROASTS = [
  "I've seen faster loading times on Internet Explorer 6 over dial-up... APXTeck could fix this in an hour.",
  "Your website layout looks like it was designed by a blindfolded intern in 2008. Let's get you a premium APX upgrade.",
  "I analyzed your site. My AI circuits almost shorted out from the amount of outdated code. APXTeck builds Next.js magic, just saying.",
  "Did you build this on a potato? Because it's giving serious starch vibes. APX can make it lightning fast.",
  "Your SEO score is so low, even Google forgot you exist. APXTeck's Generative Engine Optimization could revive it.",
  "I tried to scan your site, but I fell asleep waiting for the LCP to load. You desperately need APXTeck's performance optimization.",
  "Wow, what a beautiful vintage website... Oh wait, you actually launched this year? Please, call APXTeck.",
  "Your color palette is violently offensive to my optical sensors. APX UI/UX designers are crying right now."
];

export function AIRoastWidget() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [roast, setRoast] = useState<string | null>(null);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking cursor effect for the terminal
  useEffect(() => {
    const interval = setInterval(() => setShowCursor((v) => !v), 500);
    return () => clearInterval(interval);
  }, []);

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsAnalyzing(true);
    setRoast(null);

    // Simulate AI thinking and network delay
    setTimeout(() => {
      setIsAnalyzing(false);
      // Pick a random roast
      const randomRoast = ROASTS[Math.floor(Math.random() * ROASTS.length)];
      setRoast(randomRoast);
    }, 2500);
  };

  return (
    <section className="w-full py-16 sm:py-24 relative overflow-hidden bg-background border-y border-glass-border">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[300px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Powered Roast</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4"
          >
            <ScrambleText text="Dare to see what AI thinks of your website?" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-foreground/70 text-lg mb-8 max-w-xl"
          >
            Enter your website URL below and let our ruthless AI analyze your digital presence. Don't worry, we can fix whatever it finds.
          </motion.p>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            onSubmit={handleRoast}
            className="w-full max-w-lg relative group mb-8"
          >
            <div className="absolute inset-0 bg-accent/20 rounded-full blur-xl transition-opacity opacity-0 group-hover:opacity-100 duration-500" />
            <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-glass-border hover:border-accent/50 rounded-full p-2 pl-6 transition-all duration-300 shadow-lg">
              <Link2 className="w-5 h-5 text-foreground/50 shrink-0" />
              <input
                type="text"
                placeholder="https://your-website.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-4 text-foreground placeholder:text-foreground/30 font-mono text-sm sm:text-base"
                required
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                data-interactive
                className="bg-foreground text-background hover:bg-accent hover:text-white px-6 py-2.5 rounded-full font-bold transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing
                  </>
                ) : (
                  <>
                    Roast It <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* Terminal Output */}
          <AnimatePresence mode="wait">
            {(isAnalyzing || roast) && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="w-full max-w-2xl text-left bg-[#0a0a0a] dark:bg-black border border-glass-border rounded-2xl p-6 shadow-2xl relative overflow-hidden"
              >
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
                  <Terminal className="w-5 h-5 text-accent" />
                  <span className="text-xs font-mono text-foreground/50 tracking-widest uppercase">AI_AUDIT_TERMINAL_V1.0</span>
                </div>

                <div className="font-mono text-sm sm:text-base leading-relaxed text-gray-300">
                  {isAnalyzing ? (
                    <div className="flex flex-col gap-2 text-accent/80">
                      <p>{">"} Initializing brutal honesty protocols...</p>
                      <p>{">"} Scanning DOM tree for inline styles...</p>
                      <p>{">"} Calculating time to interactive (it's bad)...</p>
                      <p>{">"} Fetching Lighthouse scores... {showCursor ? '█' : ''}</p>
                    </div>
                  ) : roast ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-red-400">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{">"} <span className="text-gray-100">{roast}</span></p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-xs text-foreground/40 italic">Ouch. That was harsh. But we can help.</p>
                        <Link 
                          href="/contact" 
                          data-interactive
                          className="text-accent hover:text-white text-sm font-bold flex items-center gap-2 underline underline-offset-4 decoration-accent/30 hover:decoration-white transition-all"
                        >
                          Book a rescue mission <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </section>
  );
}
