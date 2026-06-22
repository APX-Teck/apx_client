'use client';

import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Script from 'next/script';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi (हिंदी)' },
  { code: 'mr', label: 'Marathi (मराठी)' },
  { code: 'pa', label: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'gu', label: 'Gujarati (ગુજરાતી)' },
  { code: 'te', label: 'Telugu (తెలుగు)' },
  { code: 'kn', label: 'Kannada (ಕನ್ನಡ)' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isOpenRef = useRef(isOpen);

  useEffect(() => {
    // Detect current language from cookie on mount
    const match = document.cookie.match(/googtrans=\/en\/([^;]+)/);
    if (match && match[1]) {
      setCurrentLang(match[1]);
    } else {
      setCurrentLang('en');
    }
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    setMounted(true);
    // Add Google Translate callback to window
    (window as any).googleTranslateElementInit = () => {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,pa,gu,te,kn',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      }
    };

    // Close on click outside
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.language-switcher-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    // Scroll visibility logic
    let timeout: NodeJS.Timeout;
    const handleScroll = () => {
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!isOpenRef.current) {
          setIsVisible(false);
        }
      }, 2000); // Auto-hide after 2 seconds of inactivity
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Trigger initially

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const changeLanguage = (langCode: string) => {
    setCurrentLang(langCode);

    const domain = window.location.hostname;
    const isWww = domain.startsWith('www.');
    const rootDomain = isWww ? domain.substring(4) : domain;
    
    // Target both root and current path to avoid cookie shadowing
    const paths = ['/', window.location.pathname];

    if (langCode === 'en') {
      // Clear cookies aggressively
      const expires = 'expires=Thu, 01 Jan 1970 00:00:00 UTC';
      paths.forEach((p) => {
        document.cookie = `googtrans=; ${expires}; path=${p};`;
        document.cookie = `googtrans=; ${expires}; domain=${domain}; path=${p};`;
        document.cookie = `googtrans=; ${expires}; domain=.${domain}; path=${p};`;
        if (isWww) {
          document.cookie = `googtrans=; ${expires}; domain=${rootDomain}; path=${p};`;
          document.cookie = `googtrans=; ${expires}; domain=.${rootDomain}; path=${p};`;
        }
      });
      // Also clear localStorage if any third-party script synced it
      localStorage.removeItem('googtrans');
    } else {
      // Set cookies aggressively
      const val = `/en/${langCode}`;
      paths.forEach((p) => {
        document.cookie = `googtrans=${val}; path=${p};`;
        document.cookie = `googtrans=${val}; domain=${domain}; path=${p};`;
        document.cookie = `googtrans=${val}; domain=.${domain}; path=${p};`;
        if (isWww) {
          document.cookie = `googtrans=${val}; domain=${rootDomain}; path=${p};`;
          document.cookie = `googtrans=${val}; domain=.${rootDomain}; path=${p};`;
        }
      });
      localStorage.setItem('googtrans', val);
    }

    setIsOpen(false);

    // Hard reload is the absolute safest way to guarantee language change with the external GT widget
    window.location.reload();
  };

  const portalContent = (
    <>
      {/* Absolute CSS override to nuke the Google Translate bar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .goog-te-banner-frame { display: none !important; }
        .goog-te-banner-frame.skiptranslate { display: none !important; }
        iframe.goog-te-banner-frame { display: none !important; }
        body { top: 0px !important; position: static !important; margin-top: 0px !important; }
        html { top: 0px !important; }
        .goog-te-gadget-icon { display: none !important; }
        #goog-gt-tt { display: none !important; }
        .VIpgJd-ZVi9od-l4eHX-hSRGPd { display: none !important; }
        body > .skiptranslate { display: none !important; }
      `,
        }}
      />

      {/* Floating Button container positioned above WhatsApp */}
      <div className="fixed bottom-28 right-6 z-[99999] flex items-center justify-end pointer-events-none language-switcher-container drop-shadow-2xl">
        <AnimatePresence>
          {isVisible && (
            <motion.div
              layout
              initial={{ opacity: 0, x: 20, borderRadius: 32 }}
              animate={{ opacity: 1, x: 0, borderRadius: isOpen ? 24 : 32 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-background/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(139,92,246,0.15)] overflow-hidden pointer-events-auto"
            >
              {/* Header / Button Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between p-3 outline-none hover:bg-white/5 transition-colors"
            aria-label="Translate"
          >
            <div className="flex items-center">
              <div className="bg-accent/20 p-2.5 rounded-full text-accent shadow-inner flex-shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    <span className="font-bold text-sm tracking-wide pl-3 pr-2">Translate</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, width: 0 }}
                  animate={{ opacity: 1, scale: 1, width: 'auto' }}
                  exit={{ opacity: 0, scale: 0, width: 0 }}
                  className="flex-shrink-0 overflow-hidden"
                >
                  <ChevronDown className="w-4 h-4 text-foreground/50 ml-2 mr-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Expanded List */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-2 pb-2"
              >
                <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar p-1">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`text-left px-3 py-2.5 rounded-xl text-sm transition-all duration-200 flex items-center justify-between group ${
                        currentLang === lang.code
                          ? 'bg-accent/15 text-accent font-bold border border-accent/30'
                          : 'hover:bg-white/10 text-foreground/80 hover:text-foreground border border-transparent font-medium'
                      }`}
                    >
                      <span>{lang.label}</span>
                      {currentLang === lang.code && (
                        <motion.div
                          layoutId="activeDot"
                          className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(139,92,246,0.8)]"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );

  return (
    <>
      <div id="google_translate_element" className="hidden"></div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="lazyOnload"
      />
      {mounted && createPortal(portalContent, document.body)}
    </>
  );
}
