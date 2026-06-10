"use client";

import Link from "next/link";

import React, { useEffect, useState } from "react";
import DataTable, { ColumnDef } from "@/components/ui/admin/DataTable";
import { usersService, User, Role } from "@/services/admin/users.service";
import { Shield, User as UserIcon, Settings, MoreVertical, Edit2 } from "lucide-react";
import { format } from "date-fns";

export default function UsersManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, rolesData] = await Promise.all([
          usersService.getUsers(),
          usersService.getRoles()
        ]);
        setUsers(usersData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Failed to fetch users and roles", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  const columns: ColumnDef<User>[] = [
    {
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold shadow-sm">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{user.fullName}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (user) => <span className="font-medium">{user.phone}</span>
    },
    {
      header: "Role",
      cell: (user) => (
        <div className="flex items-center gap-2">
          {user.role?.name === "SUPER_ADMIN" ? (
            <Shield size={14} className="text-emerald-500" />
          ) : user.role?.name === "ADMIN" ? (
            <Settings size={14} className="text-indigo-500" />
          ) : (
            <UserIcon size={14} className="text-gray-500" />
          )}
          <span className="font-bold text-xs uppercase tracking-wider bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-md text-gray-700 dark:text-gray-300">
            {user.role?.name || "UNKNOWN"}
          </span>
        </div>
      )
    },
    {
      header: "Status",
      cell: (user) => (
        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
          user.isActive 
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
            : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
        }`}>
          {user.isActive ? "ACTIVE" : "INACTIVE"}
        </span>
      )
    },
    {
      header: "Joined",
      cell: (user) => (
        <span className="text-sm font-medium">
          {format(new Date(user.createdAt), "MMM dd, yyyy")}
        </span>
      )
    },
    {
      header: "Actions",
      cell: (user) => {
        const router = require("next/navigation").useRouter();
        return (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 transition-colors"
            >
              View Profile
            </button>
            <button className="p-2 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
              <MoreVertical size={16} />
            </button>
          </div>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Users & Roles</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Manage system users, role assignments, and module access permissions.</p>
        </div>
        <Link 
          href="/admin/users/create" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-[0px_4px_14px_rgba(79,70,229,0.3)] inline-flex items-center gap-2"
        >
          + Add New User
        </Link>
      </div>

      <DataTable 
        data={filteredUsers}
        columns={columns}
        searchPlaceholder="Search by name, email, or phone..."
        onSearch={setSearchTerm}
      />
    </div>
  );
}
