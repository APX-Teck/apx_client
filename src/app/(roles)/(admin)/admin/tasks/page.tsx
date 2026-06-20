import React from 'react';
// Removed dynamic import
import { tasksService, Task } from '@/services/admin/tasks.service';

import TasksManager from './_components/TasksManager';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  let initialTasks: Task[] = [];
  try {
    const fetchedTasks = await tasksService.getTasks();
    if (fetchedTasks) initialTasks = fetchedTasks;
  } catch (error) {
    console.error('Failed to fetch initial tasks:', error);
  }

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-safe pt-4">
      <TasksManager initialTasks={initialTasks} />
    </div>
  );
}
