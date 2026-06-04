"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { motion, useScroll, useTransform } from "framer-motion";
import { LogIn, Menu, X } from "lucide-react";

export function Navbar() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 50], ["rgba(0,0,0,0)", "var(--glass)"]);
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(16px)"]);
  const borderWidth = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "var(--glass-border)"]);
  const paddingY = useTransform(scrollY, [0, 50], ["1.5rem", "0.75rem"]);

  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4"
      style={{ paddingTop: paddingY }}
    >
      <motion.div
        style={{
          backgroundColor: backgroundY,
          backdropFilter: backdropBlur,
          WebkitBackdropFilter: backdropBlur,
          borderColor: borderWidth,
        }}
        className="w-full max-w-5xl rounded-full border border-transparent transition-all duration-300 shadow-2xl"
      >
        <div className="px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <Image src="/APXTeck.png" alt="APXTeck Logo" fill className="object-contain drop-shadow-[0_0_15px_rgba(14,165,233,0.3)]" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">APXTeck</span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
            <Link href="/portfolio" className="hover:text-accent transition-colors">Portfolio</Link>
            <Link href="/explore" className="hover:text-accent transition-colors">Explore & News</Link>
            <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4 shrink-0">
            <ThemeToggle />
            <Link
              href="/login"
              className="group relative inline-flex h-10 items-center justify-center gap-2 rounded-full bg-accent/10 border border-accent/20 px-5 text-sm font-medium text-accent transition-all hover:bg-accent hover:text-white active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button onClick={() => setIsOpen(!isOpen)} className="text-foreground p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden absolute top-full left-0 right-0 mt-4 p-4 glass-panel rounded-3xl flex flex-col gap-4 shadow-xl"
          >
            <Link href="/services" onClick={() => setIsOpen(false)} className="p-3 text-center rounded-xl hover:bg-white/10 font-medium">Services</Link>
            <Link href="/portfolio" onClick={() => setIsOpen(false)} className="p-3 text-center rounded-xl hover:bg-white/10 font-medium">Portfolio</Link>
            <Link href="/explore" onClick={() => setIsOpen(false)} className="p-3 text-center rounded-xl hover:bg-white/10 font-medium">Explore & News</Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className="p-3 text-center rounded-xl hover:bg-white/10 font-medium">Contact</Link>
            <Link href="/login" onClick={() => setIsOpen(false)} className="p-3 text-center rounded-xl bg-accent text-white font-medium flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> Login
            </Link>
          </motion.div>
        )}
      </motion.div>
    </motion.header>
  );
}
