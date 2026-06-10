"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plus, Edit2, Trash2, X, Search, Loader2 } from "lucide-react";
import { rolesService, Role } from "@/services/admin/roles.service";

export default function RolesManagementPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoles = async () => {
    setLoading(true);
    const result = await rolesService.getRoles();
    setRoles(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (mode: "CREATE" | "EDIT", role?: Role) => {
    setModalMode(mode);
    if (mode === "EDIT" && role) {
      setSelectedRole(role);
      setFormData({ name: role.name, description: role.description || "" });
    } else {
      setSelectedRole(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formattedName = formData.name.toUpperCase().replace(/\s+/g, '_');
      if (modalMode === "CREATE") {
        await rolesService.createRole({ name: formattedName, description: formData.description });
      } else if (modalMode === "EDIT" && selectedRole) {
        await rolesService.updateRole(selectedRole.id, { name: formattedName, description: formData.description });
      }
      handleCloseModal();
      fetchRoles();
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || "Failed to save role");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete the role "${name}"? This cannot be undone.`)) {
      try {
        await rolesService.deleteRole(id);
        fetchRoles();
      } catch (error: any) {
        alert(error?.response?.data?.message || error.message || "Failed to delete role");
      }
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Shield className="w-8 h-8 text-indigo-500" />
            Role Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Manage system roles, descriptions, and view assigned users.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal("CREATE")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] flex items-center gap-2"
        >
          <Plus size={18} />
          <span>Add New Role</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading roles...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Role Name</th>
                  <th className="py-4 px-6 w-full">Description</th>
                  <th className="py-4 px-6 text-center">Assigned Users</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <tr key={role.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 text-gray-500 font-mono">#{role.id}</td>
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white">
                        <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg">
                          {role.name}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-500 dark:text-gray-400 truncate max-w-[200px] md:max-w-md">
                        {role.description || <span className="italic opacity-50">No description</span>}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 w-8 h-8 rounded-full font-bold">
                          {role._count?.users || 0}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal("EDIT", role)}
                            className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                            title="Edit Role"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(role.id, role.name)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Delete Role"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-500">
                      No roles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
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
                  {modalMode === "CREATE" ? "Create New Role" : "Edit Role"}
                </h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Role Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. MARKETING MANAGER"
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none uppercase dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Spaces will be automatically converted to underscores.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this role's responsibilities..."
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none dark:text-white resize-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-[0px_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                  >
                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                    {modalMode === "CREATE" ? "Create Role" : "Save Changes"}
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
