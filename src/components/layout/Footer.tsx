'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { api } from '@/lib/axios';
import { Service } from '@/app/types/service.types';
import { Portfolio } from '@/app/types/portfolio.types';
import { BlogPost } from '@/app/types/blog.types';
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaThreads,
  FaLinkedinIn,
  FaYoutube,
  FaPinterestP,
} from 'react-icons/fa6';
import { MapPin, Mail, Phone } from 'lucide-react';

export function Footer() {
  const [services, setServices] = useState<Service[]>([]);
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const pathname = usePathname() || '/';

  const getIndiaPath = () => {
    if (pathname.startsWith('/en-in')) return pathname;
    return `/en-in${pathname === '/' ? '' : pathname}`;
  };

  const getGlobalPath = () => {
    if (pathname.startsWith('/en-in')) return pathname.replace('/en-in', '') || '/';
    return pathname;
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, portfolioData, blogData] = await Promise.all([
          api.fetchServices(),
          api.fetchPortfolios(),
          api.fetchBlogs()
        ]);
        setServices(servicesData); // No slice, show all to maximize internal links
        setPortfolios(portfolioData.slice(0, 5));
        setBlogs(blogData.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch data for footer', err);
      }
    }
    loadData();
  }, []);

  return (
    <footer className="relative mt-12 md:mt-20 border-t border-glass-border overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-accent/5 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16 relative z-10">
        <div className="flex flex-col xl:flex-row gap-10 md:gap-12 justify-between">
          <div className="xl:w-[350px] flex flex-col items-center xl:items-start text-center xl:text-left shrink-0">
            <Link href="/" className="inline-flex justify-center md:justify-start mb-6">
              <div className="relative w-48 h-16">
                <Image
                  src="/APX Teck - Final Logo -01.png"
                  alt="APXTeck Footer Logo Light"
                  width={192}
                  height={64}
                  className="object-contain dark:hidden drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                />
                <Image
                  src="/APX Teck - Final Logo -03.png"
                  alt="APXTeck Footer Logo Dark"
                  width={192}
                  height={64}
                  className="object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(163,230,53,0.3)]"
                />
              </div>
            </Link>
            
            <div className="mt-8 space-y-4 text-sm text-foreground/80 max-w-sm mx-auto xl:mx-0">
              <div className="flex flex-col xl:flex-row items-center xl:items-start gap-2 xl:gap-3 text-center xl:text-left">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5 hidden xl:block" />
                <span>FL NO-F2-1006 SR NO-296/4, REVELL ORCHID, Lohogaon, Pune City, Pune - 411047, Maharashtra</span>
              </div>
              <div className="flex flex-col xl:flex-row items-center xl:items-start gap-2 xl:gap-3 text-center xl:text-left">
                <Mail className="w-5 h-5 text-accent shrink-0 hidden xl:block" />
                <a href="mailto:info@apxteck.com" className="hover:text-accent transition-colors">info@apxteck.com</a>
              </div>
              <div className="flex flex-col xl:flex-row items-center xl:items-start gap-2 xl:gap-3 text-center xl:text-left">
                <Phone className="w-5 h-5 text-accent shrink-0 hidden xl:block" />
                <a href="tel:+919405282582" className="hover:text-accent transition-colors">+91 94052 82582</a>
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-2 md:gap-3 mt-8 w-full">
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-8 w-full text-left flex-1">
            <div>
              <h2 className="font-semibold mb-4 md:mb-6 text-lg">Services</h2>
              <ul className="space-y-2 md:space-y-4 text-foreground/70 text-sm">
                {services.length > 0 ? (
                  services.map((service) => (
                    <li key={service.id}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="hover:text-accent transition-colors block py-1 md:py-0 w-full line-clamp-2"
                      >
                        {service.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link href="/services" className="hover:text-accent transition-colors block py-1 md:py-0 w-full">
                      Web Development
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-4 md:mb-6 text-lg">Recent Work</h2>
              <ul className="space-y-2 md:space-y-4 text-foreground/70 text-sm">
                {portfolios.length > 0 ? (
                  portfolios.map((portfolio) => (
                    <li key={portfolio.id}>
                      <Link
                        href={`/portfolio/${portfolio.slug}`}
                        className="hover:text-accent transition-colors block py-1 md:py-0 w-full line-clamp-2"
                      >
                        {portfolio.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link href="/portfolio" className="hover:text-accent transition-colors block py-1 md:py-0 w-full">
                      View Portfolio
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-4 md:mb-6 text-lg">Insights</h2>
              <ul className="space-y-4 md:space-y-5 text-foreground/70 text-sm">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <li key={blog.id}>
                      <Link
                        href={`/insights-news/${blog.slug}`}
                        className="group block w-full"
                      >
                        <span className="hover:text-accent transition-colors line-clamp-2 mb-1.5 leading-snug">
                          {blog.title}
                        </span>
                        <span className="text-accent text-[11px] uppercase tracking-wider font-semibold opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          Read more →
                        </span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li>
                    <Link href="/insights-news" className="hover:text-accent transition-colors block py-1 md:py-0 w-full">
                      Read Blog
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-4 md:mb-6 text-lg">Company</h2>
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
                <li>
                  <Link
                    href="/disclaimer"
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-4 md:mb-6 text-lg">Region</h2>
              <ul className="space-y-2 md:space-y-4 text-foreground/70 text-sm">
                <li>
                  <Link
                    href={getGlobalPath()}
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    Global (EN)
                  </Link>
                </li>
                <li>
                  <Link
                    href={getIndiaPath()}
                    className="hover:text-accent transition-colors inline-block py-2 md:py-0 w-full"
                  >
                    India (EN)
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-glass-border text-center text-foreground/50 text-sm">
          <p>© {new Date().getFullYear()} <strong>APXTECK SOLUTIONS PRIVATE LIMITED</strong>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
