import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tasksService, Task } from '@/services/admin/tasks.service';

export const useTaskDetailLogic = (initialTask: Task | null, taskId: number) => {
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(initialTask);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading';
  } | null>(null);

  const fetchTask = () => {
    if (!taskId) return;
    tasksService
      .getTaskById(taskId)
      .then((data) => {
        if (data) setTask(data);
      })
      .catch((err) => {
        setToast({ message: 'Failed to fetch task details', type: 'error' });
      });
  };

  useEffect(() => {
    if (!task) {
      fetchTask();
    }
  }, [task, taskId]);

  const handleUpdateStatus = async (status: Task['status']) => {
    if (!task) return;
    try {
      setToast({ message: 'Updating status...', type: 'loading' });
      await tasksService.updateTaskStatus(task.id, status);
      setToast({ message: `Status updated to ${status.replace('_', ' ')}`, type: 'success' });
      fetchTask();
    } catch (error) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  const handleUpdatePriority = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    try {
      setToast({ message: 'Updating priority...', type: 'loading' });
      await tasksService.updateTaskPriority(task.id, e.target.value as any);
      setToast({ message: 'Priority updated successfully', type: 'success' });
      fetchTask();
    } catch (error) {
      setToast({ message: 'Failed to update priority', type: 'error' });
    }
  };

  const handleDeleteTask = async () => {
    if (!task) return;
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      setToast({ message: 'Deleting task...', type: 'loading' });
      await tasksService.deleteTask(task.id);
      router.push('/admin/tasks');
    } catch (err: any) {
      setToast({ message: 'Failed to delete task', type: 'error' });
    }
  };

  return {
    task,
    toast,
    setToast,
    router,
    handleUpdateStatus,
    handleUpdatePriority,
    handleDeleteTask,
  };
};
