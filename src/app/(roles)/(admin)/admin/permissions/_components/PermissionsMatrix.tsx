import React from 'react';
import { Loader2, Save, RotateCcw } from 'lucide-react';
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
    <div className="bg-white dark:bg-[#111111] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden flex flex-col mt-6">
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
                  <tr
                    key={perm.module}
                    className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-6">
                      <span className="font-bold text-gray-900 dark:text-white">
                        {formatModuleName(perm.module)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <label className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.canRead}
                          onChange={() => onToggle(perm.module, 'canRead')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"></div>
                      </label>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <label className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.canCreate}
                          onChange={() => onToggle(perm.module, 'canCreate')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                      </label>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <label className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.canUpdate}
                          onChange={() => onToggle(perm.module, 'canUpdate')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-500"></div>
                      </label>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <label className="relative inline-flex items-center justify-center min-w-[44px] min-h-[44px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={perm.canDelete}
                          onChange={() => onToggle(perm.module, 'canDelete')}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-white/10 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-500"></div>
                      </label>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20 flex flex-col sm:flex-row justify-end items-center gap-4">
            <button
              onClick={onReset}
              disabled={isResetting || isSaving}
              className="w-full sm:w-auto px-6 py-2.5 min-h-[44px] rounded-xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw size={18} />}
              Reset Defaults
            </button>
            <button
              onClick={onSave}
              disabled={isSaving || isResetting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2.5 min-h-[44px] rounded-xl font-bold transition-all shadow-[0_4px_14px_rgba(79,70,229,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No permissions found for this role. Click "Reset Defaults" to initialize or "Save
            Changes" after toggling.
          </p>
        </div>
      )}
    </div>
  );
}
