import React from 'react';
import { notFound } from 'next/navigation';
import { usersService, UserDetail, Role, ModuleAccess } from '@/services/admin/users.service';
import { UserDetailClient } from '../_components/UserDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  let initialUser: UserDetail | null = null;
  let initialPermissions: ModuleAccess[] = [];
  let initialRoles: Role[] = [];

  try {
    const [userData, permsData, rolesData] = await Promise.all([
      usersService.getUserDetail(id),
      usersService.getUserPermissions(id),
      usersService.getRoles(),
    ]);
    initialUser = userData;
    initialPermissions = permsData || [];
    initialRoles = rolesData || [];
  } catch (error) {
    console.error('Failed to load user data:', error);
    // Let the error boundary handle catastrophic fetch failures if desired,
    // or just pass null to let the client handle it gracefully.
  }

  return (
    <UserDetailClient
      userId={id}
      initialUser={initialUser}
      initialPermissions={initialPermissions}
      initialRoles={initialRoles}
    />
  );
}
