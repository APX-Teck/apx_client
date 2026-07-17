'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { motion, useScroll, useTransform } from 'framer-motion';
import { LogIn, Menu, X, LayoutDashboard, User, Search } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { SearchDialog } from './SearchDialog';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const { user, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300 ${
        isScrolled ? 'pt-3' : 'pt-6'
      }`}
    >
      <div className="relative w-full max-w-5xl">
        <div className="w-full rounded-full transition-all duration-300 shadow-2xl glass-panel bg-background/60 !backdrop-blur-2xl">
          <div className="px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-20 h-8 flex items-center justify-center transition-transform group-hover:scale-105">
                <Image
                  src="/APX Teck - Final Logo -01.png"
                  alt="APXTeck Header Logo Light"
                  width={80}
                  height={32}
                  priority={true}
                  className="object-contain dark:hidden drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                />
                <Image
                  src="/APX Teck - Final Logo -03.png"
                  alt="APXTeck Header Logo Dark"
                  width={80}
                  height={32}
                  priority={true}
                  className="object-contain hidden dark:block drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]"
                />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link href="/services" className="hover:text-accent transition-colors">
                Services
              </Link>
              <Link href="/portfolio" className="hover:text-accent transition-colors">
                Portfolio
              </Link>
              <Link href="/about" className="hover:text-accent transition-colors">
                About
              </Link>
              <Link href="/insights-news" className="hover:text-accent transition-colors">
                Insights & News
              </Link>
              <Link href="/careers" className="hover:text-accent transition-colors">
                Careers
              </Link>
              <Link href="/contact" className="hover:text-accent transition-colors">
                Contact
              </Link>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-4 shrink-0">
              <button
                suppressHydrationWarning
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline-block text-xs">Search...</span>
                <kbd className="hidden lg:inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>
              <ThemeToggle />
              {isLoading ? (
                <div className="w-[104px] h-10 rounded-full bg-accent/10 animate-pulse"></div>
              ) : isAuthenticated ? (
                <Link
                  href={`/${user?.role?.toLowerCase() || 'customer'}`}
                  className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent/10 border border-accent/20 pl-2 pr-4 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white active:scale-95"
                >
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden shrink-0">
                    {user?.profilePhotoUrl ? (
                      <img
                        src={user.profilePhotoUrl}
                        alt={`${user.fullName} desktop profile`}
                        className="w-full h-full object-cover"
                      />
                    ) : user?.fullName ? (
                      <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                        alt={`${user.fullName} default desktop avatar`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="truncate max-w-[100px] font-semibold">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-5 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="text-foreground p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors outline-none focus:outline-none focus:ring-0"
              >
                <Search className="w-5 h-5" />
              </button>
              <ThemeToggle />
              <button
                suppressHydrationWarning
                onClick={() => setIsOpen(!isOpen)}
                className="text-foreground p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors outline-none focus:outline-none focus:ring-0"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-[calc(100%+16px)] left-0 right-0 p-4 glass-panel bg-background/60 !backdrop-blur-2xl rounded-3xl flex flex-col gap-4 shadow-2xl"
          >
            <Link
              href="/services"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              Services
            </Link>
            <Link
              href="/portfolio"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              Portfolio
            </Link>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              About
            </Link>
            <Link
              href="/insights-news"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              Insights & News
            </Link>
            <Link
              href="/careers"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              Careers
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="p-3 text-center rounded-xl hover:bg-white/10 font-medium"
            >
              Contact
            </Link>
            {isLoading ? (
              <div className="h-12 rounded-xl bg-accent/10 animate-pulse"></div>
            ) : isAuthenticated ? (
              <Link
                href={`/${user?.role?.toLowerCase() || 'customer'}`}
                onClick={() => setIsOpen(false)}
                className="p-3 text-center rounded-xl bg-accent text-white font-medium flex items-center justify-center gap-3"
              >
                {user?.profilePhotoUrl ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={user.profilePhotoUrl}
                      alt={`${user.fullName} mobile profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : user?.fullName ? (
                  <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-white/20">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`}
                      alt={`${user.fullName} default mobile avatar`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
                {user?.fullName?.split(' ')[0] || 'User'}&apos;s Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="p-3 text-center rounded-xl bg-accent text-white font-medium flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Login
              </Link>
            )}
          </motion.div>
        )}
      </div>
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  );
}
