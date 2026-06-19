'use client';

import React from 'react';
import { RolesHeader } from './RolesHeader';
import { RolesTable } from './RolesTable';
import { RoleModal } from './RoleModal';
import { useRolesLogic } from '../_hooks/useRolesLogic';
import { Role } from '@/services/admin/roles.service';

export default function RolesManager({ initialRoles }: { initialRoles: Role[] }) {
  const logic = useRolesLogic(initialRoles);

  return (
    <>
      <RolesHeader handleOpenModal={logic.handleOpenModal} />
      <RolesTable
        roles={logic.roles}
        handleOpenModal={logic.handleOpenModal}
        handleDelete={logic.handleDelete}
        isLoading={logic.isLoading}
      />
      <RoleModal
        isModalOpen={logic.isModalOpen}
        modalMode={logic.modalMode}
        handleCloseModal={logic.handleCloseModal}
        formData={logic.formData}
        setFormData={logic.setFormData}
        handleSubmit={logic.handleSubmit}
        isSubmitting={logic.isSubmitting}
      />
    </>
  );
}
