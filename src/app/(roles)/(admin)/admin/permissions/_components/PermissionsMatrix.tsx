import React from 'react';
import { Loader2, Save, RotateCcw, Shield } from 'lucide-react';
import { PermRow } from '@/services/admin/roles.service';

interface Props {
  selectedRoleId: number | '';
  permissions: PermRow[];
  isLoadingPerms: boolean;
  isSaving: boolean;
  isResetting: boolean;
  onToggle: (moduleName: string, field: keyof PermRow) => void;
  onSave: () => void;
  onReset: () => void;
}

export function PermissionsMatrix({
  selectedRoleId,
  permissions,
  isLoadingPerms,
  isSaving,
  isResetting,
  onToggle,
  onSave,
  onReset,
}: Props) {
  const formatModuleName = (moduleKey: string) => {
    return moduleKey
      .split('_')
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (selectedRoleId === '') return null;

  return (
    <div className="bg-white dark:bg-[#111111] rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] overflow-hidden flex flex-col mt-6">
      {isLoadingPerms ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500 font-bold tracking-tight">Loading permissions matrix...</p>
        </div>
      ) : permissions.length > 0 ? (
        <>
          <div className="overflow-x-auto hidden sm:block">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-black/20 border-b border-gray-100 dark:border-white/10 text-xs font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  <th className="py-5 px-6 lg:px-8 w-1/3 whitespace-nowrap">Module Name</th>
                  <th className="py-5 px-6 text-center whitespace-nowrap">Read</th>
                  <th className="py-5 px-6 text-center whitespace-nowrap">Create</th>
                  <th className="py-5 px-6 text-center whitespace-nowrap">Update</th>
                  <th className="py-5 px-6 text-center whitespace-nowrap">Delete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80 dark:divide-white/5 text-[15px] font-medium bg-transparent">
                {permissions.map((perm) => (
                  <tr
                    key={perm.module}
                    className="hover:bg-indigo-50/60 dark:hover:bg-indigo-500/10 transition-colors duration-300 group hover:shadow-[inset_4px_0_0_0_#6366f1]"
                  >
                    <td className="py-5 px-6 lg:px-8">
                      <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-[14px]">
                        {formatModuleName(perm.module)}
                      </span>
                    </td>
                    {[
                      { field: 'canRead', color: 'peer-checked:bg-blue-500' },
                      { field: 'canCreate', color: 'peer-checked:bg-emerald-500' },
                      { field: 'canUpdate', color: 'peer-checked:bg-orange-500' },
                      { field: 'canDelete', color: 'peer-checked:bg-red-500' },
                    ].map(({ field, color }) => (
                      <td key={field} className="py-5 px-6 text-center">
                        <label className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer group/toggle">
                          <input
                            type="checkbox"
                            checked={perm[field as keyof PermRow] as boolean}
                            onChange={() => onToggle(perm.module, field as keyof PermRow)}
                            className="sr-only peer"
                          />
                          <div
                            className={`relative w-12 h-6 bg-gray-200/80 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 after:shadow-sm dark:border-gray-600 ${color} group-hover/toggle:ring-4 group-hover/toggle:ring-indigo-500/10 transition-all`}
                          ></div>
                        </label>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden space-y-4 p-4 bg-gray-50/30 dark:bg-black/10">
            {permissions.map((perm) => (
              <div key={perm.module} className="bg-white dark:bg-[#1a1a1a] rounded-xl p-4 border border-gray-200/50 dark:border-white/10 shadow-sm">
                <p className="font-bold text-gray-900 dark:text-white uppercase tracking-tight text-sm mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                  {formatModuleName(perm.module)}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { field: 'canRead', label: 'Read', color: 'peer-checked:bg-blue-500' },
                    { field: 'canCreate', label: 'Create', color: 'peer-checked:bg-emerald-500' },
                    { field: 'canUpdate', label: 'Update', color: 'peer-checked:bg-orange-500' },
                    { field: 'canDelete', label: 'Delete', color: 'peer-checked:bg-red-500' },
                  ].map(({ field, label, color }) => (
                    <div key={field} className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-2.5 rounded-lg">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{label}</span>
                      <label className="relative inline-flex items-center justify-center cursor-pointer group/toggle">
                        <input
                          type="checkbox"
                          checked={perm[field as keyof PermRow] as boolean}
                          onChange={() => onToggle(perm.module, field as keyof PermRow)}
                          className="sr-only peer"
                        />
                        <div
                          className={`relative w-10 h-5 bg-gray-200/80 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-200 after:border after:rounded-full after:h-4 after:w-4 after:transition-all after:duration-300 after:shadow-sm dark:border-gray-600 ${color} group-hover/toggle:ring-4 group-hover/toggle:ring-indigo-500/10 transition-all`}
                        ></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 lg:p-8 border-t border-gray-100/80 dark:border-white/10 bg-transparent flex flex-col sm:flex-row justify-end items-center gap-4">
            <button
              onClick={onReset}
              disabled={isResetting || isSaving}
              className="w-full sm:w-auto px-6 py-3.5 min-h-[44px] rounded-2xl font-bold text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-white/5 border border-gray-200/80 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-all shadow-sm hover:shadow-md active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <RotateCcw size={18} strokeWidth={2.5} />}
              Reset Defaults
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || isResetting}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white px-8 py-3.5 min-h-[44px] rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-95"
            >
              {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save size={18} strokeWidth={2.5} />}
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <div className="py-24 text-center px-4">
          <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-gray-400 dark:text-gray-500" strokeWidth={1.5} />
          </div>
          <p className="text-gray-900 dark:text-white font-bold text-lg mb-2">No permissions found</p>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-sm mx-auto">
            Click "Reset Defaults" to initialize the permissions matrix for this role, or "Save Changes" after toggling.
          </p>
        </div>
      )}
    </div>
  );
}
