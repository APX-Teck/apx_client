import React, { useMemo, useState } from 'react';
import DataTable, { ColumnDef } from '@/components/ui/admin/DataTable';
import { Role } from '@/services/admin/roles.service';

import { Shield, Settings, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

interface Props {
  roles: Role[];
  handleOpenModal: (mode: 'CREATE' | 'EDIT', role: Role) => void;
  handleDelete: (id: number, name: string) => void;
  isLoading?: boolean;
}

const PROTECTED_ROLES = ['SUPER_ADMIN', 'ADMIN', 'CUSTOMER', 'EMPLOYEE', 'SALES'];

export function RolesTable({ roles, handleOpenModal, handleDelete, isLoading }: Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRoles = useMemo(() => {
    return roles.filter(
      (role) =>
        role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [roles, searchTerm]);

  const columns: ColumnDef<Role>[] = useMemo(
    () => [
      {
        header: 'Role Name',
        accessorKey: 'name',
        cell: (role) => (
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <Shield size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="font-bold text-[15px] text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                {role.name}
                {PROTECTED_ROLES.includes(role.name) && (
                  <span className="px-2 py-0.5 text-[9px] font-black bg-red-50 text-red-600 border border-red-100 rounded-md tracking-widest">
                    SYSTEM
                  </span>
                )}
              </p>
              <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-xs">
                {role.description || 'No description provided.'}
              </p>
            </div>
          </div>
        ),
      },

      {
        header: 'Actions',
        cell: (role) => (
          <div className="flex items-center gap-2">
            <Link
              href={`/admin/roles/${role.id}`}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 transition-colors tooltip-trigger relative group"
            >
              <Settings size={18} strokeWidth={2.5} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Manage Permissions
              </span>
            </Link>
            <button
              onClick={() => handleOpenModal('EDIT', role)}
              disabled={PROTECTED_ROLES.includes(role.name)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors group relative"
            >
              <Edit size={18} strokeWidth={2.5} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Edit Details
              </span>
            </button>
            <button
              onClick={() => handleDelete(role.id, role.name)}
              disabled={PROTECTED_ROLES.includes(role.name)}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors group relative"
            >
              <Trash2 size={18} strokeWidth={2.5} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Delete Role
              </span>
            </button>
          </div>
        ),
      },
    ],
    [handleOpenModal, handleDelete]
  );

  return (
    <>
      <div className="hidden sm:block">
        <DataTable
          data={filteredRoles}
          columns={columns}
          searchPlaceholder="Search roles by name or description..."
          onSearch={setSearchTerm}
          isLoading={isLoading}
        />
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4 p-4">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/50 dark:bg-[#1a1a1a]/50 border border-gray-200/80 dark:border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-gray-900 dark:text-white"
            placeholder="Search roles..."
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold">Loading...</div>
        ) : filteredRoles.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">No roles found.</div>
        ) : (
          filteredRoles.map((role) => (
            <div key={role.id} className="bg-white dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                  <Shield size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="font-bold text-[15px] text-gray-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
                    {role.name}
                    {PROTECTED_ROLES.includes(role.name) && (
                      <span className="px-2 py-0.5 text-[9px] font-black bg-red-50 text-red-600 border border-red-100 rounded-md tracking-widest shrink-0">
                        SYSTEM
                      </span>
                    )}
                  </p>
                  <p className="text-[12px] font-medium text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                    {role.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5">
                <Link
                  href={`/admin/roles/${role.id}`}
                  className="flex-1 py-2.5 min-h-[44px] flex items-center justify-center gap-2 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 transition-colors"
                >
                  <Settings size={16} /> Permissions
                </Link>
                <button
                  onClick={() => handleOpenModal('EDIT', role)}
                  disabled={PROTECTED_ROLES.includes(role.name)}
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-500/10 disabled:opacity-30 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(role.id, role.name)}
                  disabled={PROTECTED_ROLES.includes(role.name)}
                  className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-500/10 disabled:opacity-30 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
