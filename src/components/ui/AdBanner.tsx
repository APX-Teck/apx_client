'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Ad } from '@/app/types/ad.types';
import { motion, AnimatePresence } from 'framer-motion';

interface AdBannerProps {
  placement:
    | 'BLOG_LIST_TOP'
    | 'BLOG_LIST_MID'
    | 'BLOG_POST_TOP'
    | 'BLOG_POST_MID'
    | 'BLOG_POST_BOTTOM'
    | 'BLOG_POST_SIDEBAR';
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAd() {
      try {
        const data = await api.fetchAds(placement);
        setAd(data);
      } catch (err) {
        console.error(`Failed to load ad banner for ${placement}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAd();
  }, [placement]);

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`w-full max-w-5xl mx-auto flex flex-col items-center gap-1.5 ${className}`}
        >
          <div className={`w-full rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse border border-gray-200 dark:border-white/5 shadow-sm ${placement === 'BLOG_POST_SIDEBAR' ? 'h-[250px] md:h-[600px]' : 'h-[90px] md:h-[160px]'}`}></div>
        </motion.div>
      ) : ad ? (
        <motion.div
          key="ad"
          initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`w-full max-w-5xl mx-auto flex flex-col items-center gap-1.5 group ${className}`}
        >
          {/* Micro Label */}
          <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest group-hover:text-foreground/70 transition-colors">
            Sponsored
          </span>

          {/* Glass Container */}
          <div className={`w-full h-auto rounded-2xl glass-panel border border-glass-border overflow-hidden flex items-center justify-center relative shadow-sm hover:shadow-lg hover:border-pink-500/20 transition-all duration-500 ${placement === 'BLOG_POST_SIDEBAR' ? 'min-h-[250px]' : 'min-h-[90px]'}`}>
            {ad.adType === 'GOOGLE' && ad.adCode ? (
              <div
                className="w-full flex justify-center py-2"
                dangerouslySetInnerHTML={{ __html: ad.adCode }}
              />
            ) : (
              ad.bannerUrl && (
                <a
                  href={ad.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ad.bannerUrl}
                    alt={ad.clientName || 'APXTeck Sponsor Advertisement'}
                    className={`w-full object-cover mx-auto transform group-hover:scale-[1.01] transition-transform duration-700 ${placement === 'BLOG_POST_SIDEBAR' ? 'h-full' : 'max-h-[160px]'}`}
                  />
                </a>
              )
            )}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="placeholder"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`w-full max-w-5xl mx-auto flex flex-col items-center gap-1.5 ${className}`}
        >
          <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
            Advertisement
          </span>
          <a
            href="/contact"
            className={`w-full rounded-2xl border-2 border-dashed border-foreground/10 flex flex-col items-center justify-center hover:bg-foreground/[0.02] hover:border-accent/30 transition-all duration-300 group ${
              placement === 'BLOG_POST_SIDEBAR' ? 'h-[250px] md:h-[400px]' : 'h-[90px] md:h-[120px]'
            }`}
          >
            <span className="text-sm font-bold text-foreground/40 group-hover:text-accent transition-colors">
              Your Ad Here
            </span>
            <span className="text-xs text-foreground/30 mt-1">
              Click to contact us
            </span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
