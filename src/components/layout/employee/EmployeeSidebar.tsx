"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Users,
  ClipboardList,
  CreditCard,
  FileText,
  TrendingUp,
  CheckSquare,
  Receipt,
  Monitor,
  Layout,
  Settings,
  LogOut,
  Menu,
  PanelLeftClose,
  X,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/AuthProvider";
import { useUiStore } from "@/store/uiStore";

const NAV_GROUPS = [
  {
    title: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/employee", icon: BarChart2, alwaysShow: true },
    ]
  },
  {
    title: "MY WORKSPACE",
    items: [
      { name: "My Tasks", href: "/employee/tasks", icon: CheckSquare, alwaysShow: true },
      { name: "Reimbursements", href: "/employee/reimbursements", icon: Receipt, alwaysShow: true },
    ]
  },
  {
    title: "GRANTED MODULES",
    items: [
      { name: "Users & Roles", href: "/admin/users", icon: Users, module: "USER_ROLE_MANAGEMENT" },
      { name: "Service Requests", href: "/admin/requests", icon: ClipboardList, module: "ORDER_PAYMENT_MANAGEMENT" },
      { name: "Payments", href: "/admin/payments", icon: CreditCard, module: "ORDER_PAYMENT_MANAGEMENT" },
      { name: "Leads & CRM", href: "/admin/leads", icon: TrendingUp, module: "LEADS_ACCESS_MANAGEMENT" },
      { name: "Services", href: "/admin/services", icon: Layers, module: "CONTENT_MANAGEMENT" },
      { name: "Blog", href: "/admin/blog", icon: FileText, module: "BLOG_MANAGEMENT" },
      { name: "Advertisements", href: "/admin/ads", icon: Monitor, module: "ADVERTISEMENT_MANAGEMENT" },
      { name: "Content", href: "/admin/content/faqs", icon: Layout, module: "CONTENT_MANAGEMENT" },
    ]
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Settings", href: "/employee/settings", icon: Settings, alwaysShow: true },
    ]
  }
];

export default function EmployeeSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

  // Filter NAV_GROUPS based on user permissions
  const filteredGroups = NAV_GROUPS.map(group => ({
    ...group,
    items: group.items.filter(item => {
      if (item.alwaysShow) return true;
      // If the user has read access or any access to the module
      if (item.module && user?.permissions && user.permissions[item.module]) {
        return user.permissions[item.module].canRead || user.permissions[item.module].canUpdate || user.permissions[item.module].canCreate || user.permissions[item.module].canDelete;
      }
      return false;
    })
  })).filter(group => group.items.length > 0);

  if (!mounted) return null; // Prevent hydration mismatch

  const sidebarContent = (
    <>
      {/* Header Section */}
      <div className="h-20 flex items-center justify-center border-b border-white/10 px-4 shrink-0">
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
                <div className="relative w-32 h-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
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
                className="hidden md:flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={18} />
              </button>
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="md:hidden flex w-8 h-8 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
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
                className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-gray-300 hover:text-[#39FF14] hover:bg-[#39FF14]/10 border border-white/5 shadow-sm transition-all"
                aria-label="Expand sidebar"
              >
                <Menu size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-6 px-4 custom-scrollbar">
        {filteredGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="mb-6 last:mb-0">
            {!isSidebarCollapsed && (
              <div className="text-[11px] font-bold text-gray-500 tracking-wider mb-3 px-3 transition-colors uppercase">
                {group.title}
              </div>
            )}
            <div className="space-y-1">
              {group.items.map((link) => {
                const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/employee' && link.href !== '/admin');
                const Icon = link.icon;

                return (
                  <Link key={link.href} href={link.href} title={isSidebarCollapsed ? link.name : undefined} onClick={() => setMobileSidebarOpen(false)}>
                    <div
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
                        isSidebarCollapsed ? "justify-center" : "justify-start",
                        isActive
                          ? "bg-white/5 text-white font-bold"
                          : "text-gray-400 hover:bg-white/5 hover:text-gray-200 font-medium"
                      )}
                    >
                      <Icon
                        size={20}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={cn(
                          "shrink-0 transition-colors",
                          isActive ? "text-[#39FF14]" : "text-gray-500 group-hover:text-gray-300"
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
                            className="ml-3.5 text-[14px] whitespace-nowrap overflow-hidden"
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
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange-500 to-yellow-500 rounded-r-full"
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
      <div className="p-4 border-t border-white/10 shrink-0">
        <button
          onClick={() => {
            setMobileSidebarOpen(false);
            logout();
          }}
          title={isSidebarCollapsed ? "Log out" : undefined}
          className={cn(
            "flex items-center w-full py-2.5 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-colors group",
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
        className="hidden md:flex h-screen bg-[#0A0A0A] border-r border-white/10 flex-col sticky top-0 z-40 shadow-sm transition-colors duration-300 overflow-hidden shrink-0"
      >
        {sidebarContent}
      </motion.aside>
    </>
  );
}
