'use client';

import React, { useEffect, useState } from 'react';
import { RequestDetailClient } from './RequestDetailClient';
import { requestsService, ServiceRequestDetail } from '@/services/admin/requests.service';
import { usersService, User } from '@/services/admin/users.service';
import { Layers, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: string;
  initialRequest: ServiceRequestDetail | null;
  initialAdmins: User[];
}

export function RequestDetailLoader({ id, initialRequest, initialAdmins }: Props) {
  const [request, setRequest] = useState<ServiceRequestDetail | null>(initialRequest);
  const [admins, setAdmins] = useState<User[]>(initialAdmins);
  const [loading, setLoading] = useState(!initialRequest);

  useEffect(() => {
    let isMounted = true;
    const fetchAll = async () => {
      if (!request || admins.length === 0) setLoading(true);
      try {
        const [reqData, usersData] = await Promise.all([
          requestsService.getRequestDetail(id),
          usersService.getUsers(),
        ]);
        if (isMounted) {
          if (reqData) setRequest(reqData);
          if (usersData && usersData.length > 0) {
            const filteredAdmins = usersData
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
            setAdmins(filteredAdmins);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchAll();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Loader2 size={48} className="animate-spin text-indigo-500" />
        <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Loading request details...</h2>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col h-64 items-center justify-center gap-4">
        <Layers size={48} className="text-gray-500" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Request Not Found</h2>
        <Link href="/admin/requests" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
          Return to Service Requests
        </Link>
      </div>
    );
  }

  return <RequestDetailClient initialData={request} initialAdmins={admins} />;
}
