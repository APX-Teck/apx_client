import React from 'react';
// Removed dynamic import
import { tasksService } from '@/services/employee/tasks.service';
import { Task } from '@/services/admin/tasks.service';

import TasksManager from './_components/TasksManager';

export const dynamic = 'force-dynamic';

export default async function EmployeeTasksPage() {
  let initialTasks: Task[] = [];
  let initialTotalPages = 1;
  let initialPage = 1;

  try {
    const res = await tasksService.getMyTasks({ page: 1, limit: 10 });
    if (res?.success) {
      initialTasks = res.data.data;
      initialTotalPages = res.data.pagination.totalPages;
      initialPage = res.data.pagination.page;
    }
  } catch (error) {
    console.error('Failed to load initial tasks on server', error);
  }

  return (
    <TasksManager
      initialTasks={initialTasks}
      initialTotalPages={initialTotalPages}
      initialPage={initialPage}
    />
  );
}
