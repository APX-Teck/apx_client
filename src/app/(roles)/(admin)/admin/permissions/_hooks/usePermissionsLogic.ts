import { useState, useEffect } from 'react';
import { rolesService, Role, PermRow } from '@/services/admin/roles.service';
import toast from 'react-hot-toast';

export const usePermissionsLogic = (initialRoles: Role[]) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isLoadingRoles, setIsLoadingRoles] = useState(initialRoles.length === 0);

  useEffect(() => {
    // Unconditionally fetch on the client side to ensure the auth token is passed correctly on the live domain
    const fetchRoles = async () => {
      if (roles.length === 0) setIsLoadingRoles(true);
      try {
        const result = await rolesService.getRoles();
        if (result && result.length > 0) {
          setRoles(result);
        }
      } catch (error) {
        console.error('Failed to load roles', error);
      } finally {
        setIsLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);
  const [selectedRoleId, setSelectedRoleId] = useState<number | ''>('');
  const [permissions, setPermissions] = useState<PermRow[]>([]);

  const [isLoadingPerms, setIsLoadingPerms] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!selectedRoleId) {
        setPermissions([]);
        return;
      }
      setIsLoadingPerms(true);
      try {
        const response = await rolesService.getRolePermissions(Number(selectedRoleId));
        if (response && response.permissions) {
          setPermissions(response.permissions);
        } else {
          setPermissions([]);
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        toast.error('Failed to load permissions for this role.');
        setPermissions([]);
      } finally {
        setIsLoadingPerms(false);
      }
    };

    fetchPermissions();
  }, [selectedRoleId]);

  const handleToggle = (moduleName: string, field: keyof PermRow) => {
    setPermissions((prev) =>
      prev.map((p) => {
        if (p.module === moduleName) {
          return { ...p, [field]: !p[field] };
        }
        return p;
      })
    );
  };

  const handleSave = async () => {
    if (!selectedRoleId) return;
    setIsSaving(true);
    try {
      await rolesService.updateRolePermissions(Number(selectedRoleId), permissions);
      toast.success('Permissions saved successfully!');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message || 'Failed to save permissions');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (!selectedRoleId) return;
    if (
      window.confirm(
        'Are you sure you want to reset all permissions for this role? They will be wiped completely.'
      )
    ) {
      setIsResetting(true);
      try {
        await rolesService.resetRolePermissions(Number(selectedRoleId));
        const response = await rolesService.getRolePermissions(Number(selectedRoleId));
        if (response && response.permissions) {
          setPermissions(response.permissions);
        }
        toast.success('Permissions have been reset to defaults.');
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message || error.message || 'Failed to reset permissions'
        );
      } finally {
        setIsResetting(false);
      }
    }
  };

  return {
    roles,
    selectedRoleId,
    setSelectedRoleId,
    permissions,
    isLoadingPerms,
    isSaving,
    isResetting,
    handleToggle,
    handleSave,
    handleReset,
    isLoadingRoles,
  };
};
