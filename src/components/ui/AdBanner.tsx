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
  const [ads, setAds] = useState<Ad[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAd() {
      try {
        const data = await api.fetchAds(placement);
        const fetchedAds = Array.isArray(data) ? data : ((data as any)?.data || []);
        const safeAds = Array.isArray(fetchedAds) ? fetchedAds : [];

        // Only keep ads that actually have content to prevent blank spaces
        const validAds = safeAds.filter((ad: Ad) => 
          (ad.adType === 'GOOGLE' && ad.adCode && ad.adCode.trim() !== '') || 
          (ad.adType === 'CLIENT' && ad.bannerUrl && ad.bannerUrl.trim() !== '')
        );

        // Group by Ad Type to prevent mixing CLIENT and GOOGLE ads in the rotation
        const clientAds = validAds.filter((ad: Ad) => ad.adType === 'CLIENT');
        const googleAds = validAds.filter((ad: Ad) => ad.adType === 'GOOGLE');

        let selectedGroup: Ad[] = [];
        if (clientAds.length > 0 && googleAds.length > 0) {
          selectedGroup = Math.random() > 0.5 ? clientAds : googleAds;
        } else if (clientAds.length > 0) {
          selectedGroup = clientAds;
        } else {
          selectedGroup = googleAds;
        }

        setAds(selectedGroup);
      } catch (err) {
        console.error(`Failed to load ad banner for ${placement}`, err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAd();
  }, [placement]);

  useEffect(() => {
    // Only rotate CLIENT ads. GOOGLE ads manage their own rotation and
    // re-rendering Google script tags every 5 seconds causes errors.
    if (ads.length > 1 && ads[0]?.adType === 'CLIENT') {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const currentAd = ads[currentIndex] || null;

  useEffect(() => {
    // Manually trigger AdSense push when a GOOGLE ad is loaded
    if (currentAd?.adType === 'GOOGLE') {
      try {
        const insElements = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"])');
        if (insElements.length > 0) {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (err) {
        console.error('AdSense push error:', err);
      }
    }
  }, [currentAd]);

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
          <div
            className={`w-full rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse border border-gray-200 dark:border-white/5 shadow-sm ${placement === 'BLOG_POST_SIDEBAR' ? 'h-[250px] md:h-[600px]' : 'h-[90px] md:h-[160px]'}`}
          ></div>
        </motion.div>
      ) : currentAd ? (
        <motion.div
          key={currentAd.id || 'ad'}
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
          <div
            className={`w-full h-auto rounded-2xl glass-panel border border-glass-border overflow-hidden flex items-center justify-center relative shadow-sm hover:shadow-lg hover:border-pink-500/20 transition-all duration-500 ${placement === 'BLOG_POST_SIDEBAR' ? 'min-h-[250px]' : 'min-h-[90px]'}`}
          >
            {currentAd.adType === 'GOOGLE' && currentAd.adCode ? (
              <div
                className="w-full flex justify-center py-2"
                dangerouslySetInnerHTML={{ __html: currentAd.adCode }}
              />
            ) : (
              currentAd.bannerUrl && (
                <a
                  href={currentAd.targetUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentAd.bannerUrl}
                    alt={currentAd.clientName || 'APXTeck Sponsor Advertisement'}
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
            <span className="text-xs text-foreground/30 mt-1">Click to contact us</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
