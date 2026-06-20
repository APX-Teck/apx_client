'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon, Settings, Mail, Shield, ChevronDown, X, Phone } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { motion, AnimatePresence } from 'framer-motion';

export function UserProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
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
                onClick={() => {
                  setIsOpen(false);
                  setShowProfileModal(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors group"
              >
                <UserIcon size={16} className="group-hover:scale-110 transition-transform duration-300" /> My Profile
              </button>
              <Link
                href={user.role === 'SUPER_ADMIN' || user.role === 'ADMIN' ? '/admin/settings' : '/employee/settings'}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors group"
              >
                <Settings size={16} className="group-hover:rotate-90 transition-transform duration-300" /> Account Settings
              </Link>
              
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

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden z-10"
            >
              {/* Modal content */}
              <div className="flex flex-col">
                <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="px-8 pb-8 pt-0 relative flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-[#111] p-1.5 -mt-12 mb-4 relative z-10 shadow-lg">
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-500/20 dark:to-indigo-500/10 overflow-hidden">
                      {user.profilePhotoUrl ? (
                        <img src={user.profilePhotoUrl} alt={user.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=4f46e5&color=fff&size=128`} alt={user.fullName} className="w-full h-full object-cover" />
                      )}
                    </div>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.fullName}</h2>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full mb-6">
                    <Shield size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      {user.role.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div className="w-full space-y-4 text-left">
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center shrink-0">
                        <Mail size={18} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Email Address</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-black/20 flex items-center justify-center shrink-0">
                        <Phone size={18} className="text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">Phone Number</p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full mt-6 pt-6 border-t border-gray-100 dark:border-white/10 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">To edit these details, please go to Account Settings.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
