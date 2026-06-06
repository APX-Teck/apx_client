"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Ad } from "@/app/types/ad.types";

interface AdBannerProps {
  placement: "BLOG_LIST_TOP" | "BLOG_LIST_MID" | "BLOG_POST_TOP" | "BLOG_POST_MID" | "BLOG_POST_BOTTOM";
  className?: string;
}

export function AdBanner({ placement, className = "" }: AdBannerProps) {
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

  if (isLoading || !ad || !ad.isActive) {
    return null;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto px-6 py-6 flex flex-col items-center gap-1.5 ${className}`}>
      {/* Micro Label */}
      <span className="text-[10px] font-bold text-foreground/45 uppercase tracking-widest">
        Sponsored
      </span>

      {/* Glass Container */}
      <div className="w-full h-auto min-h-[90px] rounded-2xl glass-panel border border-glass-border overflow-hidden flex items-center justify-center relative shadow-md">
        {ad.adType === "GOOGLE" && ad.adCode ? (
          <div
            className="w-full flex justify-center py-2"
            dangerouslySetInnerHTML={{ __html: ad.adCode }}
          />
        ) : (
          ad.bannerUrl && (
            <a
              href={ad.targetUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block hover:opacity-95 transition-opacity duration-300"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={ad.bannerUrl}
                alt={ad.clientName || "APXTeck Sponsor Advertisement"}
                className="w-full max-h-[160px] object-cover mx-auto"
              />
            </a>
          )
        )}
      </div>
    </div>
  );
}
