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
    <div className="bg-white dark:bg-[#111111] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
        <Shield className="w-4 h-4 text-indigo-500" />
        Select a Role to Manage
      </label>
      <div className="max-w-sm">
        <select
          value={selectedRoleId}
          onChange={(e) => onSelectRole(e.target.value ? Number(e.target.value) : '')}
          disabled={isLoadingRoles}
          className="w-full bg-gray-50 dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 min-h-[44px] text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none font-bold text-gray-900 dark:text-white transition-all shadow-sm disabled:opacity-50"
        >
          <option value="" disabled>
            {isLoadingRoles ? '-- Loading Roles... --' : '-- Select a Role --'}
          </option>
          {Array.isArray(roles) &&
            roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name.replace(/_/g, ' ')}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
}
