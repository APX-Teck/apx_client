'use client';

import React, { useState, useRef, useEffect } from 'react';
import { LogOut, User as UserIcon, Settings, Mail, Shield, ChevronDown } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-4 md:pl-5 border-l border-gray-200 dark:border-white/10 group focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-500/10 overflow-hidden border border-indigo-200 dark:border-indigo-500/30 shadow-inner flex items-center justify-center shrink-0 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all">
          {user.profilePhotoUrl ? (
            <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
          ) : (
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`} alt={user.fullName} className="w-full h-full object-cover" />
          )}
        </div>
        <div className="hidden md:flex flex-col items-start text-left">
          <span className="text-sm font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {user.fullName}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-medium capitalize">
            {user.role.replace(/_/g, ' ').toLowerCase()}
          </span>
        </div>
        <ChevronDown size={14} className={`hidden md:block text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-[calc(100%+12px)] right-0 w-64 bg-white/95 dark:bg-[#151515]/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden z-50 origin-top-right flex flex-col"
          >
            {/* User Info Header */}
            <div className="p-4 bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/10 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-500/10 overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30 mb-2">
                {user.profilePhotoUrl ? (
                  <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff`} alt={user.fullName} className="w-full h-full object-cover" />
                )}
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white text-[15px]">{user.fullName}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center justify-center gap-1 mt-0.5">
                <Mail size={12} /> {user.email}
              </p>
              <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-md">
                <Shield size={10} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  {user.role.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="p-2 flex flex-col gap-1">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-not-allowed opacity-60"
                disabled
              >
                <UserIcon size={16} /> My Profile (Coming Soon)
              </button>
              <button
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors cursor-not-allowed opacity-60"
                disabled
              >
                <Settings size={16} /> Account Settings
              </button>
              
              <div className="h-px w-full bg-gray-100 dark:bg-white/10 my-1"></div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors group"
              >
                <LogOut size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Log out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
