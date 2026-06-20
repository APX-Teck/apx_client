import React, { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { tasksService } from '@/services/admin/tasks.service';
import { TaskDetailClient } from '../_components/TaskDetailClient';

export const dynamic = 'force-dynamic';

export default async function TaskDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  let task = null;
  try {
    task = await tasksService.getTaskById(Number(params.id));
  } catch (err) {
    console.error('SSR Fetch failed for task, deferring to client', err);
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-[80vh] items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-gray-200 dark:border-white/10 border-t-indigo-600 dark:border-t-indigo-500 animate-spin"></div>
        </div>
      }
    >
      <TaskDetailClient initialTask={task as any} taskId={Number(params.id)} />
    </Suspense>
  );
}
