'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, ArrowRight, Loader2, Link2, Terminal, AlertTriangle, Share2 } from 'lucide-react';
import Link from 'next/link';
import { FaWhatsapp, FaXTwitter, FaLinkedinIn, FaInstagram, FaEnvelope } from 'react-icons/fa6';

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

  const handleShare = (platform: string) => {
    if (!roast) return;
    const shareText = `I asked APXTeck's AI to roast my website and it was brutally honest! 😭\n\nAI says:\n"${roast}"\n\nDare to get yours roasted? Check it out at https://www.apxteck.com/#ai-roast`;
    const shareUrl = encodeURIComponent('https://www.apxteck.com/#ai-roast');
    const encodedText = encodeURIComponent(shareText);

    let popupUrl = '';
    switch (platform) {
      case 'twitter':
        popupUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
        break;
      case 'linkedin':
        popupUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
        break;
      case 'whatsapp':
        popupUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
        break;
      case 'email':
        popupUrl = `mailto:?subject=${encodeURIComponent('Brutal AI Website Roast')}&body=${encodedText}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(shareText);
        alert('Roast copied to clipboard! Share it on Instagram.');
        return;
      default:
        navigator.clipboard.writeText(shareText);
        alert('Roast copied to clipboard!');
        return;
    }
    window.open(popupUrl, '_blank');
  };

  return (
    <section id="ai-roast" className="w-full py-16 sm:py-24 relative overflow-hidden bg-background border-y border-glass-border">
      {/* Premium Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
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
            Dare to see what AI thinks of your website?
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
            <div className="relative flex items-center bg-background/50 backdrop-blur-xl border border-glass-border hover:border-accent/50 rounded-full p-1 sm:p-2 pl-3 sm:pl-6 transition-all duration-300 shadow-lg w-full max-w-full overflow-hidden">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/50 shrink-0" />
              <input
                type="text"
                placeholder="https://your-website.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 min-w-0 bg-transparent border-none outline-none px-2 sm:px-4 text-foreground placeholder:text-foreground/30 font-mono text-xs sm:text-base"
                required
              />
              <button
                type="submit"
                disabled={isAnalyzing}
                data-interactive
                className="bg-foreground text-background hover:bg-accent hover:text-white px-3 py-2 sm:px-6 sm:py-2.5 rounded-full font-bold text-xs sm:text-base transition-all duration-300 flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
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
                className="w-full max-w-2xl text-left bg-[#0a0a0a] dark:bg-black border border-glass-border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-2xl relative overflow-hidden"
              >
                {/* Terminal Header */}
                <div className="flex items-center gap-2 mb-3 sm:mb-4 pb-3 sm:pb-4 border-b border-white/10">
                  <Terminal className="w-5 h-5 text-accent" />
                  <span className="text-xs font-mono text-foreground/50 tracking-widest uppercase">AI_AUDIT_TERMINAL_V1.0</span>
                </div>

                <div className="font-mono text-sm sm:text-base leading-relaxed text-gray-300">
                  {isAnalyzing ? (
                    <div className="flex flex-col gap-2 text-accent/80">
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0 }}>{">"} Initializing brutal honesty protocols...</motion.p>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>{">"} Scanning DOM tree for inline styles...</motion.p>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>{">"} Calculating time to interactive (it's bad)...</motion.p>
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>{">"} Fetching Lighthouse scores... {showCursor ? '█' : ''}</motion.p>
                    </div>
                  ) : roast ? (
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 text-red-400">
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <p>{">"} <span className="text-gray-100">{roast}</span></p>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
                          <span className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                            <Share2 className="w-3 h-3" /> Share Roast
                          </span>
                          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                            <button onClick={() => handleShare('whatsapp')} title="Share on WhatsApp" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#25D366] hover:text-white transition-colors border border-glass-border hover:border-transparent"><FaWhatsapp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleShare('twitter')} title="Share on X" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-white hover:text-black transition-colors border border-glass-border hover:border-transparent"><FaXTwitter className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleShare('linkedin')} title="Share on LinkedIn" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#0A66C2] hover:text-white transition-colors border border-glass-border hover:border-transparent"><FaLinkedinIn className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleShare('email')} title="Share via Email" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-accent hover:text-white transition-colors border border-glass-border hover:border-transparent"><FaEnvelope className="w-3.5 h-3.5" /></button>
                            <button onClick={() => handleShare('instagram')} title="Copy for Instagram" className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-white/5 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:text-white transition-all border border-glass-border hover:border-transparent"><FaInstagram className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                        <Link 
                          href="/contact" 
                          data-interactive
                          className="text-accent hover:text-white text-[13px] font-bold flex items-center justify-center sm:justify-start gap-2 border border-accent/20 hover:border-accent/40 bg-accent/5 hover:bg-accent/10 px-4 py-2 rounded-full transition-all w-full sm:w-auto shrink-0"
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
