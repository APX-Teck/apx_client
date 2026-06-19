'use client';
import React from 'react';
import { UsersHeader } from './UsersHeader';
import { UsersTable } from './UsersTable';
import { useUsersLogic } from '../_hooks/useUsersLogic';
import { User, Role } from '@/services/admin/users.service';

interface Props {
  initialUsers: User[];
  initialRoles: Role[];
}

export default function UsersManager({ initialUsers, initialRoles }: Props) {
  const logic = useUsersLogic(initialUsers, initialRoles);

  return (
    <>
      <UsersHeader />
      <UsersTable
        filteredUsers={logic.filteredUsers}
        setSearchTerm={logic.setSearchTerm}
        currentSort={logic.currentSort}
        setCurrentSort={logic.setCurrentSort}
        isLoading={logic.isLoading}
      />
    </>
  );
}
