"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Shield, Settings, Key, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { rolesService, Role, PermRow } from "@/services/admin/roles.service";

const PROTECTED_ROLES = ["SUPER_ADMIN", "ADMIN", "CUSTOMER", "EMPLOYEE", "SALES"];

export default function RoleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const roleId = Number(params?.id);

  const [activeTab, setActiveTab] = useState<"details" | "permissions">("details");
  const [role, setRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<PermRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isProtected = role ? PROTECTED_ROLES.includes(role.name) : false;

  useEffect(() => {
    if (!roleId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch role details
        const allRoles = await rolesService.getRoles();
        const foundRole = allRoles.find(r => r.id === roleId);
        
        if (!foundRole) {
          setError("Role not found");
          setIsLoading(false);
          return;
        }
        
        setRole(foundRole);
        setFormData({ name: foundRole.name, description: foundRole.description || "" });

        // Fetch permissions
        const permsData = await rolesService.getRolePermissions(roleId);
        if (permsData && permsData.permissions) {
          setPermissions(permsData.permissions);
        }
      } catch (err) {
        console.error("Error fetching data", err);
        setError("Failed to load role data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [roleId]);

  const handleRoleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProtected) return;
    
    setError("");
    setSuccess("");
    
    try {
      setIsSubmitting(true);
      await rolesService.updateRole(roleId, formData);
      setSuccess("Role details updated successfully");
      setRole(prev => prev ? { ...prev, ...formData } : null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePermissionToggle = (moduleName: string, field: keyof PermRow) => {
    if (isProtected && role?.name === "SUPER_ADMIN") return; // Super admin permissions shouldn't be touched usually
    
    setPermissions(prev => prev.map(p => {
      if (p.module === moduleName) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    }));
  };

  const handleSavePermissions = async () => {
    setError("");
    setSuccess("");
    
    try {
      setIsSubmitting(true);
      await rolesService.updateRolePermissions(roleId, permissions);
      setSuccess("Role permissions updated successfully");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update permissions");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 animate-spin"></div>
      </div>
    );
  }

  if (!role && !isLoading) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Role Not Found</h2>
        <Link href="/admin/roles" className="mt-4 inline-block text-indigo-600 hover:underline">Return to Roles</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link 
          href="/admin/roles"
          className="p-2 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
            Role Configuration: <span className="text-indigo-600 dark:text-indigo-400">{role?.name}</span>
            {isProtected && (
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100 rounded-md ml-2">
                System Protected
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Manage details and default module permissions.</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`p-4 rounded-xl text-sm font-bold border ${error ? "bg-red-50 text-red-600 border-red-200" : "bg-emerald-50 text-emerald-600 border-emerald-200"}`}>
          {error || success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-3 space-y-2">
          <button
            onClick={() => setActiveTab("details")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "details"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <Settings size={18} />
            Role Details
          </button>
          <button
            onClick={() => setActiveTab("permissions")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
              activeTab === "permissions"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white dark:bg-[#111111] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
            }`}
          >
            <Key size={18} />
            Module Permissions
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-[0px_4px_20px_rgba(0,0,0,0.02)] min-h-[400px]">
            <AnimatePresence mode="wait">
              
              {/* DETAILS TAB */}
              {activeTab === "details" && (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Role Details</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Update the basic information of this role.</p>
                  </div>

                  {isProtected && (
                    <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl flex gap-3">
                      <AlertCircle className="text-amber-600 dark:text-amber-400 shrink-0" size={20} />
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        This is a system-protected role. Its core details cannot be modified or deleted to ensure system stability.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleRoleUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Role Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value.toUpperCase().replace(/\s+/g, '_') }))}
                        disabled={isProtected}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed font-mono uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        disabled={isProtected}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                      />
                    </div>
                    {!isProtected && (
                      <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                        >
                          {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                          Save Changes
                        </button>
                      </div>
                    )}
                  </form>
                </motion.div>
              )}

              {/* PERMISSIONS TAB */}
              {activeTab === "permissions" && (
                <motion.div key="permissions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-0">
                  <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Default Module Permissions</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure CRUD access defaults for any user assigned to this role.</p>
                    </div>
                    <button
                      onClick={handleSavePermissions}
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
                    >
                      {isSubmitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                      Save Permissions
                    </button>
                  </div>

                  {permissions.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No permissions mapped for this role.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-[#1a1a1a] border-b border-gray-100 dark:border-white/5">
                          <tr>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Module Key</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Create</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Read</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Update</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Delete</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                          {permissions.map((perm) => (
                            <tr key={perm.module} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-bold text-gray-900 dark:text-white text-sm font-mono">{perm.module}</td>
                              {(['canCreate', 'canRead', 'canUpdate', 'canDelete'] as const).map(field => (
                                <td key={field} className="px-6 py-4 text-center">
                                  <input 
                                    type="checkbox" 
                                    checked={perm[field]} 
                                    onChange={() => handlePermissionToggle(perm.module, field)}
                                    disabled={isProtected && role?.name === "SUPER_ADMIN"}
                                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300 bg-gray-100 disabled:opacity-50 cursor-pointer" 
                                  />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
