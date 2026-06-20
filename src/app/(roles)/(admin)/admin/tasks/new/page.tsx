import React from 'react';
import apiClient from '@/lib/axios';
import { CreateTaskClient } from '../_components/CreateTaskClient';

export const dynamic = 'force-dynamic';

export default async function CreateTaskPage() {
  let users = [];
  try {
    const response = await apiClient.get('/auth/getAllUsers?limit=100');
    const allUsers = response.data?.data?.data || [];
    users = allUsers.filter((u: any) => u.role?.name && u.role.name !== 'CUSTOMER');
  } catch (err) {
    console.error('Failed to load users for task assignment', err);
  }

  return <CreateTaskClient users={users} />;
}
