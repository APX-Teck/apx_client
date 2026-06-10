"use client";

import React, { useState, useEffect } from "react";
import { Key, Shield, Save, RotateCcw, Loader2 } from "lucide-react";
import { rolesService, Role, PermRow } from "@/services/admin/roles.service";

export default function ModuleAccessPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | "">("");
  
  const [permissions, setPermissions] = useState<PermRow[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isLoadingPerms, setIsLoadingPerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoadingRoles(true);
      const rolesData = await rolesService.getRoles();
      // Ensure we flatten or access correctly depending on backend response, 
      // although getRoles in service handles most cases.
      setRoles(rolesData || []);
      setIsLoadingRoles(false);
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!selectedRoleId) {
        setPermissions([]);
        return;
      }
      setIsLoadingPerms(true);
      const response = await rolesService.getRolePermissions(Number(selectedRoleId));
      if (response && response.permissions) {
        setPermissions(response.permissions);
      } else {
        setPermissions([]);
      }
      setIsLoadingPerms(false);
    };
    
    fetchPermissions();
  }, [selectedRoleId]);

  const handleToggle = (moduleName: string, field: keyof PermRow) => {
    setPermissions(prev => prev.map(p => {
      if (p.module === moduleName) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    }));
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setIsSaving(true);
    try {
      await rolesService.updateRolePermissions(Number(selectedRoleId), permissions);
      alert("Permissions saved successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.message || error.message || "Failed to save permissions");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedRoleId) return;
    if (window.confirm("Are you sure you want to reset all permissions for this role? They will be wiped completely.")) {
      setIsResetting(true);
      try {
        await rolesService.resetRolePermissions(Number(selectedRoleId));
        const response = await rolesService.getRolePermissions(Number(selectedRoleId));
        if (response && response.permissions) {
          setPermissions(response.permissions);
        }
        alert("Permissions have been reset.");
      } catch (error: any) {
        alert(error?.response?.data?.message || error.message || "Failed to reset permissions");
      } finally {
        setIsResetting(false);
      }
    }
  };

  const formatModuleName = (moduleKey: string) => {
    return moduleKey.split('_').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Key className="w-8 h-8 text-indigo-500" />
            Module Access Control
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Configure Read, Create, Update, and Delete permissions for each role across all system modules.
          </p>
        </div>
      </div>

      {/* Role Selector */}
      <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-500" />
          Select a Role to Manage
        </label>
        {isLoadingRoles ? (
          <div className="flex items-center gap-3 text-indigo-600 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading roles...
          </div>
        ) : (
          <div className="max-w-sm">
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-gray-900 dark:text-white transition-all shadow-sm"
            >
              <option value="" disabled>-- Select a Role --</option>
              {Array.isArray(roles) && roles.map(r => (
                <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Permissions Matrix */}
      {selectedRoleId !== "" && (
        <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col">
          {isLoadingPerms ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Loading permissions matrix...</p>
            </div>
          ) : permissions.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      <th className="py-4 px-6 w-1/3">Module Name</th>
                      <th className="py-4 px-6 text-center">Read</th>
                      <th className="py-4 px-6 text-center">Create</th>
                      <th className="py-4 px-6 text-center">Update</th>
                      <th className="py-4 px-6 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm font-medium">
                    {permissions.map((perm) => (
                      <tr key={perm.module} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {formatModuleName(perm.module)}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.canRead} 
                              onChange={() => handleToggle(perm.module, "canRead")}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                          </label>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.canCreate} 
                              onChange={() => handleToggle(perm.module, "canCreate")}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                          </label>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.canUpdate} 
                              onChange={() => handleToggle(perm.module, "canUpdate")}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                          </label>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={perm.canDelete} 
                              onChange={() => handleToggle(perm.module, "canDelete")}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-col sm:flex-row justify-end items-center gap-4">
                <button
                  onClick={handleReset}
                  disabled={isResetting || isSaving}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw size={18} />}
                  Reset Defaults
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving || isResetting}
                  className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </>
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-500 dark:text-gray-400 font-medium">No permissions found for this role. Click "Reset Defaults" to initialize or "Save Changes" after toggling.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
