import React from 'react';
import { Shield } from 'lucide-react';
import { Role } from '@/services/admin/roles.service';

interface Props {
  roles: Role[];
  selectedRoleId: number | '';
  onSelectRole: (roleId: number | '') => void;
  isLoadingRoles?: boolean;
}

export function PermissionsRoleSelector({ roles, selectedRoleId, onSelectRole, isLoadingRoles }: Props) {
  return (
    <div className="bg-white dark:bg-[#111111] p-6 lg:p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] transition-all">
      <label className="block text-sm font-extrabold text-gray-900 dark:text-white mb-4 flex items-center gap-2 tracking-tight">
        <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
          <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
        </div>
        Select a Role to Manage
      </label>
      <div className="max-w-md relative group">
        <select
          value={selectedRoleId}
          onChange={(e) => onSelectRole(e.target.value ? Number(e.target.value) : '')}
          disabled={isLoadingRoles}
          className="w-full appearance-none bg-gray-50/50 dark:bg-[#1a1a1a] border border-gray-200/80 dark:border-white/10 rounded-2xl px-5 py-4 min-h-[56px] text-[15px] focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold text-gray-900 dark:text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100/50 dark:hover:bg-white/[0.02]"
        >
          <option value="" disabled>
            {isLoadingRoles ? '-- Loading Roles... --' : '-- Select a Role --'}
          </option>
          {Array.isArray(roles) &&
            roles.map((r) => (
              <option key={r.id} value={r.id} className="font-medium py-2">
                {r.name.replace(/_/g, ' ')}
              </option>
            ))}
        </select>
        {/* Custom dropdown arrow to replace the native appearance-none one */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-gray-500 dark:text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
