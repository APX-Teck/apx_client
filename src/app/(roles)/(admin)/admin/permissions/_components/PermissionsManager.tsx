'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { PermissionsRoleSelector } from './PermissionsRoleSelector';
import { PermissionsMatrix } from './PermissionsMatrix';
import { usePermissionsLogic } from '../_hooks/usePermissionsLogic';
import { Role } from '@/services/admin/roles.service';

interface Props {
  initialRoles: Role[];
}

export default function PermissionsManager({ initialRoles }: Props) {
  const logic = usePermissionsLogic(initialRoles);

  return (
    <>
      <Toaster position="top-right" />
      <PermissionsRoleSelector
        roles={logic.roles}
        selectedRoleId={logic.selectedRoleId}
        onSelectRole={logic.setSelectedRoleId}
        isLoadingRoles={logic.isLoadingRoles}
      />
      <PermissionsMatrix
        selectedRoleId={logic.selectedRoleId}
        permissions={logic.permissions}
        isLoadingPerms={logic.isLoadingPerms}
        isSaving={logic.isSaving}
        isResetting={logic.isResetting}
        onToggle={logic.handleToggle}
        onSave={logic.handleSave}
        onReset={logic.handleReset}
      />
    </>
  );
}
