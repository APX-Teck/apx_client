"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Layers,
  ClipboardList,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useUiStore } from "@/store/uiStore";

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/customer", icon: BarChart2 },
    ]
  },
  {
    title: "MY WORKSPACE",
    items: [
      { name: "My Services", href: "/customer/services", icon: Layers },
      { name: "Service Requests", href: "/customer/requests", icon: ClipboardList },
    ]
  },
  {
    title: "BILLING",
    items: [
      { name: "Invoices & Payments", href: "/customer/payments", icon: CreditCard },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Settings", href: "/customer/settings", icon: Settings },
    ]
  }
];

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [mounted, setMounted] = useState(false);
  const { 
    isSidebarCollapsed, 
    setSidebarCollapsed, 
    isMobileSidebarOpen, 
    setMobileSidebarOpen 
  } = useUiStore();

  useEffect(() => {
    setMounted(true);
    
    // Automatically collapse sidebar to icon-only on medium screens, and handle resizing
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
      
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };

    handleResize(); // Init on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setSidebarCollapsed, setMobileSidebarOpen]);

  if (!mounted) return null; // Prevent hydration mismatch

  const sidebarContent = (
    <>
      {/* Header Section */}
      <div className="h-20 flex items-center justify-center border-b border-white/10 px-4 shrink-0 bg-black/20">
        <AnimatePresence mode="wait">
          {!isSidebarCollapsed ? (
            <motion.div
              key="open"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between w-full h-full"
            >
              <div className="flex-1 flex justify-center">
                <div className="relative w-32 h-8 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">
                  <Image
                    src="/APXTeck.png"
                    alt="APXTeck Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-colors shrink-0"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-cyan-500/10 transition-colors shrink-0"
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="closed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex items-center justify-center"
            >
              <button
                onClick={() => setSidebarCollapsed(false)}
                className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 border border-white/5 shadow-sm transition-all"
                aria-label="Expand sidebar"
              >
                <Menu size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 custom-scrollbar bg-[#0A0A0A]/50">
        {NAV_GROUPS.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6 last:mb-0">
            {!isSidebarCollapsed && (
              <div className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 px-3 transition-colors uppercase flex items-center gap-2">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/customer');
                const Icon = link.icon;

                return (
                  <Link key={link.href} href={link.href} title={isSidebarCollapsed ? link.name : undefined} onClick={() => setMobileSidebarOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                        isSidebarCollapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "bg-cyan-500/10 text-cyan-50 font-bold border border-cyan-500/20 shadow-[inset_0px_0px_10px_rgba(6,182,212,0.1)]"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200 font-medium border border-transparent"
                      )}
                    >
                      {/* Active State Background Gradient */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent pointer-events-none" />
                      )}

                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "shrink-0 transition-colors relative z-10",
                          isActive ? "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : "text-gray-500 group-hover:text-gray-300"
                        )}
                      />

                      <AnimatePresence mode="wait">
                        {!isSidebarCollapsed && (
                          <motion.span
                            key="label"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-3.5 text-[14px] whitespace-nowrap overflow-hidden relative z-10"
                          >
                            {link.name}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      <AnimatePresence mode="wait">
                        {isActive && !isSidebarCollapsed && (
                          <motion.div
                            key="indicator"
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            exit={{ opacity: 0, scaleY: 0 }}
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-7 bg-cyan-500 rounded-r-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="p-4 border-t border-white/10 shrink-0 bg-black/20">
        <button
          onClick={() => {
            setMobileSidebarOpen(false);
            logout();
          }}
          title={isSidebarCollapsed ? "Log out" : undefined}
          className={cn(
            "flex items-center w-full py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all group",
            isSidebarCollapsed ? "justify-center px-0" : "justify-start px-3"
          )}
        >
          <LogOut size={20} strokeWidth={2} className="shrink-0 text-gray-500 group-hover:text-red-400 transition-colors" />
          <AnimatePresence mode="wait">
            {!isSidebarCollapsed && (
              <motion.span
                key="logout-text"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="ml-3.5 font-bold text-[14px] whitespace-nowrap overflow-hidden"
              >
                Log out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 w-[260px] bg-[#0A0A0A] border-r border-white/10 flex flex-col z-50 shadow-2xl md:hidden overflow-hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 80 : 260 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex h-screen bg-[#0A0A0A] border-r border-white/10 flex-col sticky top-0 z-40 shadow-[4px_0_24px_rgba(0,0,0,0.5)] transition-colors duration-300 overflow-hidden shrink-0"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
