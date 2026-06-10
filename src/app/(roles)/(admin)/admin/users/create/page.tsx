"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";
import { usersService, Role } from "@/services/admin/users.service";
import { rolesService } from "@/services/admin/roles.service";
import { AnimatePresence } from "framer-motion";
import { X, Loader2, Plus } from "lucide-react";

export default function CreateUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    roleId: "",
    isActive: true,
  });

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [newRoleData, setNewRoleData] = useState({ name: "", description: "" });
  const [isCreatingRole, setIsCreatingRole] = useState(false);

  const fetchRoles = async () => {
    const rolesData = await usersService.getRoles();
    setRoles(rolesData);
    return rolesData;
  };

  useEffect(() => {
    const loadInitial = async () => {
      const rolesData = await fetchRoles();
      if (rolesData.length > 0) {
        setFormData((prev) => ({ ...prev, roleId: String(rolesData[0].id) }));
      }
    };
    loadInitial();
  }, []);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingRole(true);
    try {
      const formattedName = newRoleData.name.toUpperCase().replace(/\s+/g, '_');
      const createdRole = await rolesService.createRole({ 
        name: formattedName, 
        description: newRoleData.description 
      });
      
      const updatedRoles = await fetchRoles();
      // Auto-select the newly created role
      // Note: The backend usually returns the newly created role in the response
      // or we can find it by name in the updated list
      const newlyAdded = updatedRoles.find(r => r.name === formattedName);
      if (newlyAdded) {
        setFormData(prev => ({ ...prev, roleId: String(newlyAdded.id) }));
      }
      
      setIsRoleModalOpen(false);
      setNewRoleData({ name: "", description: "" });
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || "Failed to create role");
    } finally {
      setIsCreatingRole(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await usersService.createUser({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        roleId: parseInt(formData.roleId),
        isActive: formData.isActive,
      });
      router.push("/admin/users");
      router.refresh();
    } catch (error) {
      console.error("Failed to create user", error);
      alert("Failed to create user. Please check the inputs and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
            <Link href="/admin/users" className="hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
              <ArrowLeft size={16} />
              Back to Users
            </Link>
          </div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Add New User
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-2">
            Create a new user account and assign their role within the system.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Form Fields */}
            <div className="w-full space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-3.5 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. John Doe"
                      className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Email Address <span className="text-red-500">*</span></label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="e.g. john@example.com"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Phone Number <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. +91 9876543210"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900 dark:text-white">Temporary Password <span className="text-red-500">*</span></label>
                  <input 
                    type="password" 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter a secure password"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-gray-900 dark:text-white">Assign Role <span className="text-red-500">*</span></label>
                    <button
                      type="button"
                      onClick={() => setIsRoleModalOpen(true)}
                      className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs font-bold flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 px-2 py-1 rounded-md transition-colors"
                    >
                      <Plus size={14} /> Add Role
                    </button>
                  </div>
                  <select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    required
                  >
                    <option value="" disabled>Select a Role</option>
                    {Array.isArray(roles) && roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name.replace(/_/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-3 pt-8">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    <span className="ml-3 text-sm font-bold text-gray-900 dark:text-white">Account is Active</span>
                  </label>
                </div>
              </div>
              
            </div>
          </div>

          <div className="pt-8 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/5">
            <button 
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-[0px_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Inline Role Creation Modal */}
      <AnimatePresence>
        {isRoleModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsRoleModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#111] w-full max-w-md rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-white/10">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick Create Role
                </h3>
                <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleCreateRole} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Role Name *</label>
                  <input
                    type="text"
                    required
                    value={newRoleData.name}
                    onChange={(e) => setNewRoleData({ ...newRoleData, name: e.target.value })}
                    placeholder="e.g. DATA ANALYST"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none uppercase dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Spaces will be automatically converted to underscores.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    value={newRoleData.description}
                    onChange={(e) => setNewRoleData({ ...newRoleData, description: e.target.value })}
                    placeholder="Brief description..."
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRoleModalOpen(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingRole || !newRoleData.name}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-[0px_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isCreatingRole && <Loader2 className="w-4 h-4 animate-spin" />}
                    Create & Select
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
