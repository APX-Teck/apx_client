import React from 'react';
import { requestsService } from '@/services/admin/requests.service';
import { usersService } from '@/services/admin/users.service';
import { RequestDetailLoader } from '../_components/RequestDetailLoader';

export default async function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;

  let request = null;
  let admins: import('@/services/admin/users.service').User[] = [];

  try {
    const [reqData, usersData] = await Promise.all([
      requestsService.getRequestDetail(resolvedParams.id),
      usersService.getUsers(),
    ]);
    request = reqData;

    if (usersData && usersData.length > 0) {
      admins = usersData
        .filter(
          (u) =>
            u.role?.name === 'SUPER_ADMIN' ||
            u.role?.name === 'ADMIN' ||
            u.role?.name?.includes('STAFF') ||
            u.role?.name?.includes('EMPLOYEE') ||
            u.role?.name === 'EMPLOYEE'
        )
        .sort((a, b) => {
          const roleA = a.role?.name || 'Z_UNKNOWN';
          const roleB = b.role?.name || 'Z_UNKNOWN';
          if (roleA !== roleB) {
            return roleA.localeCompare(roleB);
          }
          return a.fullName.localeCompare(b.fullName);
        });
    }
  } catch (error) {
    console.error('Failed to load request or users:', error);
  }

  return <RequestDetailLoader id={resolvedParams.id} initialRequest={request} initialAdmins={admins} />;
}
