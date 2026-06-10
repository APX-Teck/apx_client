"use client";

import React from "react";
import { Bell, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useUiStore } from "@/store/uiStore";
import { useAuth } from "@/providers/AuthProvider";

export default function AdminTopbar() {
  const pathname = usePathname();
  const { toggleMobileSidebar } = useUiStore();
  const { user } = useAuth();
  
  const getPageTitle = () => {
    if (pathname === "/admin") return "Overview";
    const pathParts = pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1);
  };

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-4 md:px-8 z-40">
      <div className="flex items-center gap-3">
        <button 
          onClick={toggleMobileSidebar}
          className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight drop-shadow-sm">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center space-x-4 md:space-x-5">
        <div className="flex items-center space-x-3">
          <ThemeToggle />

          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all border border-gray-100 dark:border-white/5">
            <Search size={18} />
          </button>
          
          <button className="w-10 h-10 rounded-full bg-white dark:bg-[#1a1a1a] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#222] shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all relative border border-gray-100 dark:border-white/5">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 dark:bg-red-400 rounded-full border-2 border-white dark:border-[#1a1a1a]"></span>
          </button>
        </div>

        <div className="flex items-center pl-4 md:pl-5 border-l border-gray-200 dark:border-white/10 cursor-pointer group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-500/10 overflow-hidden border border-indigo-200 dark:border-indigo-500/30 shadow-inner flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                {user?.fullName ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "US"}
              </div>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {user?.fullName || "Loading..."}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
                {user?.role?.replace(/_/g, " ").toLowerCase() || "User"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
