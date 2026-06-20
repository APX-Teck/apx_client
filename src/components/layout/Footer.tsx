'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';
import { Service } from '@/app/types/service.types';
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaThreads,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
} from 'react-icons/fa6';

export function Footer() {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await api.fetchServices();
        setServices(data.slice(0, 4)); // Only show top 4 services in footer
      } catch (err) {
        console.error('Failed to fetch services for footer', err);
      }
    }
    loadServices();
  }, []);

  return (
    <footer className="relative mt-12 md:mt-20 border-t border-glass-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12">
          <div className="md:col-span-2 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-flex justify-center md:justify-start mb-6">
              <div className="relative w-48 h-16">
                <Image
                  src="/APX Teck - Final Logo -01.png"
                  alt="APXTeck Logo Light"
                  fill
                  className="object-contain dark:hidden drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                />
                <Image
                  src="/APX Teck - Final Logo -03.png"
                  alt="APXTeck Logo Dark"
                  fill
                  className="object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                />
              </div>
            </Link>
            <p className="text-foreground/70 max-w-sm mx-auto md:mx-0">
              Crafting premium digital experiences, advanced web applications, and data-driven SEO
              strategies for the modern web.
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4 mt-8">
              {/* Facebook */}
              <a
                href="https://www.facebook.com/share/18ayv4SZDZ/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-[#1877F2] hover:scale-110 hover:bg-[#1877F2]/10 transition-all shadow-sm"
              >
                <FaFacebookF className="w-5 h-5" />
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/apxteckofficial?igsh=ZDF2MXBhdXh3cGEx"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-[#E4405F] hover:scale-110 hover:bg-[#E4405F]/10 transition-all shadow-sm"
              >
                <FaInstagram className="w-5 h-5" />
              </a>

              {/* X (formerly Twitter) */}
              <a
                href="https://x.com/apxteckofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-white hover:scale-110 hover:bg-white/10 transition-all shadow-sm"
              >
                <FaXTwitter className="w-5 h-5" />
              </a>

              {/* Threads */}
              <a
                href="https://www.threads.com/@apxteckofficial"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Threads"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-white hover:scale-110 hover:bg-white/10 transition-all shadow-sm"
              >
                <FaThreads className="w-5 h-5" />
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/apxteck"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-[#0A66C2] hover:scale-110 hover:bg-[#0A66C2]/10 transition-all shadow-sm"
              >
                <FaLinkedinIn className="w-5 h-5" />
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com/@apxteckofficial?si=j7mR992lS_k4YUPY"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-[#FF0000] hover:scale-110 hover:bg-[#FF0000]/10 transition-all shadow-sm"
              >
                <FaYoutube className="w-5 h-5" />
              </a>

              {/* Pinterest */}
              <a
                href="https://pin.it/6ZxAM1tCH"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-11 h-11 md:w-10 md:h-10 rounded-full glass-panel flex items-center justify-center hover:text-[#E60023] hover:scale-110 hover:bg-[#E60023]/10 transition-all shadow-sm"
              >
                <FaPinterestP className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 col-span-1 md:col-span-2 gap-8 w-full text-left">
            <div>
              <h3 className="font-semibold mb-4 md:mb-6">Services</h3>
              <ul className="space-y-2 md:space-y-4 text-foreground/70 text-sm">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <>
                    <li>
                      <Link
                        href="/services"
                        className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                      >
                        Web Development
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services"
                        className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                      >
                        UI/UX Design
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/services"
                        className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                      >
                        SEO Optimization
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 md:mb-6">Company</h3>
              <ul className="space-y-2 md:space-y-4 text-foreground/70 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-glass-border text-center text-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} APXTeck. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
