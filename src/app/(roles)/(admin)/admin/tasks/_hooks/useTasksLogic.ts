import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { tasksService, Task } from '@/services/admin/tasks.service';

export const useTasksLogic = (initialTasks: Task[] = []) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = React.useCallback(() => {
    setIsLoading(true);
    tasksService
      .getTasks()
      .then((data) => {
        setTasks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast.error('Failed to load tasks');
        setIsLoading(false);
      });
  }, []);

  React.useEffect(() => {
    setTasks(initialTasks);
    if (!initialTasks || initialTasks.length === 0) {
      fetchTasks();
    }
  }, [initialTasks, fetchTasks]);

  const handleUpdateStatus = async (id: number, status: Task['status']) => {
    const toastId = toast.loading('Updating status...');
    try {
      await tasksService.updateTaskStatus(id, status);
      toast.success(`Task marked as ${status.replace('_', ' ')}`, { id: toastId });
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status', { id: toastId });
    }
  };

  const handleDeleteTaskClick = (id: number) => {
    setTaskToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!taskToDelete) return;
    setIsDeleting(true);
    try {
      await tasksService.deleteTask(taskToDelete);
      toast.success('Task deleted successfully');
      setIsDeleteModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
      setTaskToDelete(null);
    }
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.assignedTo?.fullName &&
          task.assignedTo.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [tasks, searchTerm]);

  const navigateToCreate = () => router.push('/admin/tasks/new');
  const navigateToDetails = (id: number) => router.push(`/admin/tasks/${id}`);

  return {
    tasks,
    isLoading,
    searchTerm,
    setSearchTerm,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    taskToDelete,
    isDeleting,
    filteredTasks,
    handleUpdateStatus,
    handleDeleteTaskClick,
    confirmDeleteTask,
    navigateToCreate,
    navigateToDetails,
  };
};
