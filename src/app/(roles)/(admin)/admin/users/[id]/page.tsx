"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { usersService, UserDetail, Role, ModuleAccess } from "@/services/admin/users.service";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Shield, User as UserIcon, Mail, Phone, MapPin, Briefcase,
  Building, Calendar, CreditCard, FileText, CheckCircle, XCircle, Clock, Key,
  Edit3, Save, X, AlertTriangle, Hash, Globe, IndianRupee, Landmark, Cake,
  RotateCcw, Trash2, Eye
} from "lucide-react";
import { format } from "date-fns";

/* ─── tiny inline toast ─── */
function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 30, scale: 0.95 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl border text-sm font-bold ${
        type === "success"
          ? "bg-emerald-500/90 border-emerald-400/30 text-white"
          : "bg-red-500/90 border-red-400/30 text-white"
      }`}
    >
      {type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      {message}
    </motion.div>
  );
}

/* ─── editable field component ─── */
function EditableField({
  label, icon: Icon, value, name, isEditing, onChange, type = "text", placeholder
}: {
  label: string; icon: any; value: string; name: string;
  isEditing: boolean; onChange: (n: string, v: string) => void;
  type?: string; placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
        <Icon size={13} className="text-gray-400 dark:text-gray-500" />
        {label}
      </label>
      {isEditing ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(name, e.target.value)}
          placeholder={placeholder || label}
          className="w-full bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 transition-all placeholder:text-gray-400 dark:placeholder:text-gray-600"
        />
      ) : (
        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 min-h-[36px] flex items-center">
          {value || <span className="text-gray-300 dark:text-gray-600 italic font-normal">Not provided</span>}
        </p>
      )}
    </div>
  );
}

/* ─── Section wrapper ─── */
function Section({ title, icon: Icon, children, className = "" }: {
  title: string; icon: any; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={className}>
      <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-5 flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5">
          <Icon size={14} className="text-gray-500 dark:text-gray-400" />
        </div>
        {title}
      </h3>
      {children}
    </div>
  );
}

/* ─── Helper: format module key for display ─── */
function formatModuleKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/* ─── Source badge colors ─── */
function getSourceStyle(source: string) {
  switch (source) {
    case "override":
      return "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20";
    case "role_default":
      return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20";
    case "denied":
      return "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-500 border-gray-200 dark:border-white/10";
    default:
      return "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10";
  }
}

function getSourceLabel(source: string) {
  switch (source) {
    case "override": return "Override";
    case "role_default": return "Role Default";
    case "denied": return "No Access";
    default: return source;
  }
}

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<ModuleAccess[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "documents" | "permissions">("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPerms, setIsEditingPerms] = useState(false);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [editedPerms, setEditedPerms] = useState<ModuleAccess[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Document states
  const [rejectingDocId, setRejectingDocId] = useState<number | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [isUpdatingDoc, setIsUpdatingDoc] = useState(false);

  // Editable form state
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", roleId: "",
    address: "", city: "", state: "", pincode: "", dob: "",
    employeeId: "", department: "", designation: "", joiningDate: "",
    bankAccountName: "", bankAccountNumber: "", bankIfscCode: "", bankName: "", upiId: ""
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    if (!params?.id) return;
    const data = await usersService.getUserDetail(params.id as string);
    if (data) {
      setUser(data);
      setForm({
        fullName: data.fullName || "",
        email: data.email || "",
        phone: data.phone || "",
        roleId: String(data.role?.id || ""),
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        dob: data.dob || "",
        employeeId: data.employeeId || "",
        department: data.department || "",
        designation: data.designation || "",
        joiningDate: data.joiningDate || "",
        bankAccountName: data.bankDetails?.accountName || "",
        bankAccountNumber: data.bankDetails?.accountNumber || "",
        bankIfscCode: data.bankDetails?.ifsc || "",
        bankName: data.bankDetails?.bankName || "",
        upiId: data.bankDetails?.upiId || ""
      });
    }
    setIsLoading(false);
  }, [params?.id]);

  const loadPermissions = useCallback(async () => {
    if (!params?.id) return;
    const perms = await usersService.getUserPermissions(params.id as string);
    setPermissions(perms);
    setEditedPerms(perms.map(p => ({ ...p })));
  }, [params?.id]);

  useEffect(() => {
    loadUser();
    loadPermissions();
    usersService.getRoles().then(setRoles);
  }, [loadUser, loadPermissions]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        fullName: user.fullName || "", email: user.email || "", phone: user.phone || "",
        roleId: String(user.role?.id || ""),
        address: user.address || "", city: user.city || "", state: user.state || "",
        pincode: user.pincode || "", dob: user.dob || "",
        employeeId: user.employeeId || "", department: user.department || "",
        designation: user.designation || "", joiningDate: user.joiningDate || "",
        bankAccountName: user.bankDetails?.accountName || "",
        bankAccountNumber: user.bankDetails?.accountNumber || "",
        bankIfscCode: user.bankDetails?.ifsc || "",
        bankName: user.bankDetails?.bankName || "",
        upiId: user.bankDetails?.upiId || ""
      });
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
    }
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await usersService.updateUser(user.id, {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        roleId: parseInt(form.roleId),
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        dateOfBirth: form.dob,
        employeeId: form.employeeId,
        department: form.department,
        designation: form.designation,
        joiningDate: form.joiningDate,
        bankAccountName: form.bankAccountName,
        bankAccountNumber: form.bankAccountNumber,
        bankIfscCode: form.bankIfscCode,
        bankName: form.bankName,
        upiId: form.upiId,
        profilePicture: profilePictureFile || undefined,
      });
      setToast({ message: "User updated successfully!", type: "success" });
      setIsEditing(false);
      setProfilePictureFile(null);
      setProfilePicturePreview(null);
      await loadUser();
    } catch {
      setToast({ message: "Failed to update user. Please try again.", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async () => {
    if (!user) return;
    const action = user.isActive ? "block" : "activate";
    if (!confirm(`Are you sure you want to ${action} ${user.fullName}?`)) return;
    try {
      await usersService.toggleUserActive(user.id, !user.isActive);
      setToast({ message: `User ${user.isActive ? "blocked" : "activated"} successfully!`, type: "success" });
      await loadUser();
    } catch {
      setToast({ message: `Failed to ${action} user.`, type: "error" });
    }
  };

  const handleUpdateDocumentStatus = async (docId: number, status: "VERIFIED" | "REJECTED", note?: string) => {
    setIsUpdatingDoc(true);
    try {
      await usersService.updateDocumentStatus(docId, status, note);
      setToast({ message: `Document ${status.toLowerCase()} successfully!`, type: "success" });
      setRejectingDocId(null);
      setRejectNote("");
      await loadUser();
    } catch {
      setToast({ message: `Failed to update document status.`, type: "error" });
    } finally {
      setIsUpdatingDoc(false);
    }
  };

  // ─── Permission editing handlers ───
  const handlePermToggle = (moduleIndex: number, field: "canCreate" | "canRead" | "canUpdate" | "canDelete") => {
    setEditedPerms(prev => prev.map((p, i) => i === moduleIndex ? { ...p, [field]: !p[field] } : p));
  };

  const handleCancelPerms = () => {
    setEditedPerms(permissions.map(p => ({ ...p })));
    setIsEditingPerms(false);
  };

  const handleSavePerms = async () => {
    if (!user) return;
    setIsSavingPerms(true);
    try {
      // Collect only the modules that differ from role_default or have overrides
      const permsToSave = editedPerms
        .filter(p => {
          const original = permissions.find(o => o.module === p.module);
          if (!original) return true;
          return (
            p.canCreate !== original.canCreate ||
            p.canRead !== original.canRead ||
            p.canUpdate !== original.canUpdate ||
            p.canDelete !== original.canDelete
          );
        })
        .map(p => ({
          module: p.module,
          canCreate: p.canCreate,
          canRead: p.canRead,
          canUpdate: p.canUpdate,
          canDelete: p.canDelete,
        }));

      if (permsToSave.length > 0) {
        await usersService.bulkGrantModuleAccess(user.id, permsToSave);
      }

      setToast({ message: "Permissions updated successfully!", type: "success" });
      setIsEditingPerms(false);
      await loadPermissions();
    } catch {
      setToast({ message: "Failed to update permissions.", type: "error" });
    } finally {
      setIsSavingPerms(false);
    }
  };

  const handleRevokeModule = async (module: string) => {
    if (!user) return;
    if (!confirm(`Remove override for ${formatModuleKey(module)}? User will fall back to role defaults.`)) return;
    try {
      await usersService.revokeModuleAccess(user.id, module);
      setToast({ message: "Override removed successfully!", type: "success" });
      await loadPermissions();
    } catch {
      setToast({ message: "Failed to remove override.", type: "error" });
    }
  };

  const handleResetAllPerms = async () => {
    if (!user) return;
    if (!confirm(`Reset ALL overrides for ${user.fullName}? They will revert to role defaults.`)) return;
    try {
      await usersService.revokeAllModuleAccess(user.id);
      setToast({ message: "All overrides reset to role defaults!", type: "success" });
      await loadPermissions();
    } catch {
      setToast({ message: "Failed to reset permissions.", type: "error" });
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
          <p className="text-sm font-medium text-gray-400 dark:text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const hasOverrides = permissions.some(p => p.source === "override");

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/users')}
            className="p-2.5 bg-white dark:bg-[#111111] hover:bg-gray-50 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl transition-all hover:shadow-sm active:scale-95"
          >
            <ArrowLeft size={18} className="text-gray-600 dark:text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">User Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              Manage details, verify documents, and configure access.
            </p>
          </div>
        </div>

        {/* Edit / Save / Cancel buttons */}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all flex items-center gap-2 active:scale-95"
              >
                <X size={16} /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-[0px_4px_14px_rgba(79,70,229,0.25)] flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
              >
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                ) : (
                  <><Save size={16} /> Save Changes</>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-[0px_4px_14px_rgba(79,70,229,0.25)] flex items-center gap-2 active:scale-95"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ─── Left Sidebar - Profile Card ─── */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden"
          >
            {/* Gradient header strip */}
            <div className="h-24 bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_70%)]" />
            </div>

            <div className="px-6 pb-6">
              <div className="flex flex-col items-center -mt-12">
                <div className="relative group">
                  <img
                    src={profilePicturePreview || user.profilePhotoUrl || `https://ui-avatars.com/api/?name=${user.fullName}&background=4f46e5&color=fff&size=128&bold=true`}
                    alt={user.fullName}
                    className="w-[88px] h-[88px] rounded-2xl object-cover border-4 border-white dark:border-[#111111] shadow-lg"
                  />
                  {isEditing && (
                    <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setProfilePictureFile(file);
                            setProfilePicturePreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  )}
                  <div className={`absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full border-[3px] border-white dark:border-[#111111] ${
                    user.isActive ? "bg-emerald-500" : "bg-red-500"
                  }`} />
                </div>

                <h2 className="text-lg font-black text-gray-900 dark:text-white mt-3 tracking-tight">{user.fullName}</h2>

                {isEditing ? (
                  <select
                    value={form.roleId}
                    onChange={(e) => handleChange("roleId", e.target.value)}
                    className="mt-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-full px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 cursor-pointer"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>{r.name.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-1.5 mt-2 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-500/20">
                    <Shield size={12} className="text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">{user.role.name}</span>
                  </div>
                )}

                <div className={`mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  user.isActive
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20"
                    : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20"
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                  {user.isActive ? "Active" : "Blocked"}
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] group hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
                  <Mail size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] group hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
                  <Phone size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.phone || "—"}</span>
                </div>
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] group hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors">
                  <Calendar size={15} className="text-gray-400 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Joined {format(new Date(user.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/[0.06]">
                <button
                  onClick={handleToggleActive}
                  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-all border flex items-center justify-center gap-2 active:scale-[0.98] ${
                    user.isActive
                      ? "border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10"
                      : "border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                  }`}
                >
                  {user.isActive ? <><AlertTriangle size={15} /> Block User</> : <><CheckCircle size={15} /> Activate User</>}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white dark:bg-[#111111] rounded-3xl p-5 border border-gray-100 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            <h3 className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3.5 text-center border border-gray-100 dark:border-white/[0.04]">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{user.documents.length}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Documents</p>
              </div>
              <div className="bg-gray-50 dark:bg-white/[0.03] rounded-xl p-3.5 text-center border border-gray-100 dark:border-white/[0.04]">
                <p className="text-2xl font-black text-gray-900 dark:text-white">{permissions.filter(p => p.source === "override").length}</p>
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">Overrides</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ─── Right Content Area ─── */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="bg-white dark:bg-[#111111] p-1.5 rounded-2xl border border-gray-100 dark:border-white/[0.06] flex flex-wrap sm:flex-nowrap gap-1 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          >
            {[
              { id: "overview" as const, icon: UserIcon, label: "Overview" },
              { id: "documents" as const, icon: FileText, label: `Documents${user.documents.length ? ` (${user.documents.length})` : ''}` },
              { id: "permissions" as const, icon: Key, label: "Module Access" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  activeTab === tab.id
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-100 dark:border-indigo-500/20"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon size={16} />
                  {tab.label}
                </span>
              </button>
            ))}
          </motion.div>

          {/* Tab Content */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.04)] min-h-[500px]"
          >
            <AnimatePresence mode="wait">

              {/* ═══ OVERVIEW TAB ═══ */}
              {activeTab === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="p-6 md:p-8 space-y-8">
                  <Section title="Personal Information" icon={UserIcon}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50/60 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                      <EditableField label="Full Name" icon={UserIcon} value={form.fullName} name="fullName" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Email" icon={Mail} value={form.email} name="email" isEditing={isEditing} onChange={handleChange} type="email" />
                      <EditableField label="Phone" icon={Phone} value={form.phone} name="phone" isEditing={isEditing} onChange={handleChange} type="tel" />
                      <EditableField label="Date of Birth" icon={Cake} value={form.dob} name="dob" isEditing={isEditing} onChange={handleChange} type="date" />
                    </div>
                  </Section>
                  <Section title="Address & Contact" icon={MapPin}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50/60 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                      <div className="sm:col-span-2">
                        <EditableField label="Address" icon={MapPin} value={form.address} name="address" isEditing={isEditing} onChange={handleChange} />
                      </div>
                      <EditableField label="City" icon={Globe} value={form.city} name="city" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="State" icon={Globe} value={form.state} name="state" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Pincode" icon={Hash} value={form.pincode} name="pincode" isEditing={isEditing} onChange={handleChange} />
                    </div>
                  </Section>
                  <Section title="Employment Info" icon={Briefcase}>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 bg-gray-50/60 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                      <EditableField label="Employee ID" icon={Hash} value={form.employeeId} name="employeeId" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Department" icon={Building} value={form.department} name="department" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Designation" icon={Briefcase} value={form.designation} name="designation" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Joining Date" icon={Calendar} value={form.joiningDate} name="joiningDate" isEditing={isEditing} onChange={handleChange} type="date" />
                    </div>
                  </Section>
                  <Section title="Bank & Payment Details" icon={Landmark}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 bg-gray-50/60 dark:bg-white/[0.02] p-5 rounded-2xl border border-gray-100 dark:border-white/[0.04]">
                      <EditableField label="Account Holder Name" icon={UserIcon} value={form.bankAccountName} name="bankAccountName" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Bank Name" icon={Landmark} value={form.bankName} name="bankName" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="Account Number" icon={CreditCard} value={form.bankAccountNumber} name="bankAccountNumber" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="IFSC Code" icon={Hash} value={form.bankIfscCode} name="bankIfscCode" isEditing={isEditing} onChange={handleChange} />
                      <EditableField label="UPI ID" icon={IndianRupee} value={form.upiId} name="upiId" isEditing={isEditing} onChange={handleChange} />
                    </div>
                  </Section>
                </motion.div>
              )}

              {/* ═══ DOCUMENTS TAB ═══ */}
              {activeTab === "documents" && (
                <motion.div key="documents" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="p-6 md:p-8">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">KYC & Verification</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Review and manage identity verification documents.</p>
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/10">
                      {user.documents.length} Document{user.documents.length !== 1 ? "s" : ""}
                    </span>
                  </div>

                  {user.documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                        <FileText size={28} className="text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No documents uploaded yet</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Documents will appear here once the user uploads them.</p>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      {user.documents.map(doc => (
                        <div key={doc.id} className="border border-gray-100 dark:border-white/[0.06] rounded-2xl bg-gray-50/50 dark:bg-[#0a0a0a] overflow-hidden">
                          <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-white/[0.04]">
                            <div>
                              <h3 className="font-bold text-gray-900 dark:text-white">
                                {doc.documentLabel || doc.documentType.replace(/_/g, ' ')}
                              </h3>
                              {doc.documentNumber && (
                                <p className="text-sm text-gray-500 font-mono mt-0.5">{doc.documentNumber}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                Uploaded {format(new Date(doc.createdAt), "MMM dd, yyyy")}
                              </p>
                            </div>
                            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${
                              doc.status === "VERIFIED" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20" :
                              doc.status === "REJECTED" ? "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20" :
                              "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                            }`}>
                              {doc.status === "VERIFIED" && <CheckCircle size={14} />}
                              {doc.status === "REJECTED" && <XCircle size={14} />}
                              {doc.status === "PENDING" && <Clock size={14} />}
                              {doc.status}
                            </div>
                          </div>

                          <div className="p-5">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="aspect-[1.6] bg-gray-200 dark:bg-[#151515] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 relative group cursor-pointer">
                                <img src={doc.frontFileUrl} alt="Front" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                  <a href={doc.frontFileUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
                                    <Eye size={14} /> View Front
                                  </a>
                                </div>
                                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">FRONT</span>
                              </div>
                              {doc.backFileUrl && (
                                <div className="aspect-[1.6] bg-gray-200 dark:bg-[#151515] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 relative group cursor-pointer">
                                  <img src={doc.backFileUrl} alt="Back" className="w-full h-full object-cover" />
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
                                    <a href={doc.backFileUrl} target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2">
                                      <Eye size={14} /> View Back
                                    </a>
                                  </div>
                                  <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">BACK</span>
                                </div>
                              )}
                            </div>

                            {doc.reviewNote && (
                              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
                                <p className="text-xs font-bold text-amber-700 dark:text-amber-400 mb-1">Review Note</p>
                                <p className="text-sm text-amber-600 dark:text-amber-300">{doc.reviewNote}</p>
                              </div>
                            )}

                            {doc.status === "PENDING" && (
                              <div className="mt-5 pt-5 border-t border-gray-100 dark:border-white/[0.04]">
                                {rejectingDocId === doc.id ? (
                                  <div className="space-y-3">
                                    <textarea
                                      value={rejectNote}
                                      onChange={(e) => setRejectNote(e.target.value)}
                                      placeholder="Reason for rejection (optional)..."
                                      className="w-full bg-white dark:bg-[#0a0a0a] border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-red-500/40 resize-none h-20 placeholder:text-gray-400"
                                    />
                                    <div className="flex gap-3">
                                      <button 
                                        onClick={() => handleUpdateDocumentStatus(doc.id, "REJECTED", rejectNote)}
                                        disabled={isUpdatingDoc}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                      >
                                        <XCircle size={15} /> Confirm Reject
                                      </button>
                                      <button 
                                        onClick={() => { setRejectingDocId(null); setRejectNote(""); }}
                                        className="flex-1 bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-3">
                                    <button 
                                      onClick={() => handleUpdateDocumentStatus(doc.id, "VERIFIED")}
                                      disabled={isUpdatingDoc}
                                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] shadow-sm disabled:opacity-60"
                                    >
                                      <CheckCircle size={15} /> Approve
                                    </button>
                                    <button 
                                      onClick={() => setRejectingDocId(doc.id)}
                                      disabled={isUpdatingDoc}
                                      className="flex-1 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/20 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60"
                                    >
                                      <XCircle size={15} /> Reject
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ═══ PERMISSIONS TAB ═══ */}
              {activeTab === "permissions" && (
                <motion.div key="permissions" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }} className="p-0">
                  <div className="p-6 md:p-8 border-b border-gray-100 dark:border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Module Permissions</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Resolved permissions across all {permissions.length} modules. 
                        {hasOverrides && <span className="text-purple-500 ml-1">({permissions.filter(p => p.source === "override").length} overrides active)</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {isEditingPerms ? (
                        <>
                          <button
                            onClick={handleCancelPerms}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all flex items-center gap-1.5"
                          >
                            <X size={14} /> Cancel
                          </button>
                          <button
                            onClick={handleSavePerms}
                            disabled={isSavingPerms}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 disabled:opacity-60 shadow-sm"
                          >
                            {isSavingPerms ? (
                              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                            ) : (
                              <><Save size={14} /> Save Overrides</>
                            )}
                          </button>
                        </>
                      ) : (
                        <>
                          {hasOverrides && (
                            <button
                              onClick={handleResetAllPerms}
                              className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 border border-red-100 dark:border-red-500/20 transition-all flex items-center gap-1.5"
                            >
                              <RotateCcw size={13} /> Reset All
                            </button>
                          )}
                          <button
                            onClick={() => setIsEditingPerms(true)}
                            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <Edit3 size={13} /> Edit Permissions
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {permissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-4">
                        <Key size={28} className="text-gray-300 dark:text-gray-600" />
                      </div>
                      <p className="text-sm font-bold text-gray-400 dark:text-gray-500">No permissions data available</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">Could not load the permission matrix for this user.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50/80 dark:bg-white/[0.02] border-y border-gray-100 dark:border-white/[0.04]">
                          <tr>
                            <th className="px-6 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider">Module</th>
                            <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Create</th>
                            <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Read</th>
                            <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Update</th>
                            <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Delete</th>
                            <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">Source</th>
                            {!isEditingPerms && <th className="px-4 py-4 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right"></th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
                          {(isEditingPerms ? editedPerms : permissions).map((perm, i) => (
                            <tr key={perm.module} className="hover:bg-gray-50/50 dark:hover:bg-white/[0.015] transition-colors group">
                              <td className="px-6 py-4">
                                <p className="font-bold text-gray-900 dark:text-white text-sm">{formatModuleKey(perm.module)}</p>
                              </td>
                              {(["canCreate", "canRead", "canUpdate", "canDelete"] as const).map((key) => (
                                <td key={key} className="px-4 py-4 text-center">
                                  {isEditingPerms ? (
                                    <button
                                      onClick={() => handlePermToggle(i, key)}
                                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-all border ${
                                        (isEditingPerms ? editedPerms[i] : perm)[key]
                                          ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100"
                                          : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600 border-gray-200 dark:border-white/10 hover:bg-gray-200 dark:hover:bg-white/10"
                                      }`}
                                    >
                                      {(isEditingPerms ? editedPerms[i] : perm)[key] ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                    </button>
                                  ) : (
                                    <div className={`inline-flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                                      perm[key]
                                        ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                                        : "bg-gray-100 dark:bg-white/5 text-gray-300 dark:text-gray-600"
                                    }`}>
                                      {perm[key] ? <CheckCircle size={15} /> : <XCircle size={15} />}
                                    </div>
                                  )}
                                </td>
                              ))}
                              <td className="px-4 py-4 text-center">
                                <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${getSourceStyle(perm.source)}`}>
                                  {getSourceLabel(perm.source)}
                                </span>
                              </td>
                              {!isEditingPerms && (
                                <td className="px-4 py-4 text-right">
                                  {perm.source === "override" && (
                                    <button
                                      onClick={() => handleRevokeModule(perm.module)}
                                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                                      title="Remove override"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  )}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Legend */}
                      <div className="px-6 py-4 border-t border-gray-100 dark:border-white/[0.04] flex flex-wrap items-center gap-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Legend:</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getSourceStyle("role_default")}`}>Role Default</span>
                          <span className="text-[10px] text-gray-400">Inherited from role</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getSourceStyle("override")}`}>Override</span>
                          <span className="text-[10px] text-gray-400">User-specific</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${getSourceStyle("denied")}`}>No Access</span>
                          <span className="text-[10px] text-gray-400">Not configured</span>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
