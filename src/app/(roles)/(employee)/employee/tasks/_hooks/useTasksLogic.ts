import { useState, useCallback, useEffect } from 'react';
import { tasksService } from '@/services/employee/tasks.service';
import { Task } from '@/services/admin/tasks.service';

export const useTasksLogic = (
  initialTasks: Task[],
  initialTotalPages: number,
  initialPage: number
) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [statusFilter, setStatusFilter] = useState<string>('');

  const fetchTasks = useCallback(
    async (pageNum = 1, status = statusFilter) => {
      setIsLoading(true);
      try {
        const res = await tasksService.getMyTasks({
          page: pageNum,
          limit: 10,
          status: status || undefined,
        });
        if (res.success) {
          setTasks(res.data.data);
          setTotalPages(res.data.pagination.totalPages);
          setPage(res.data.pagination.page);
        }
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      } finally {
        setIsLoading(false);
      }
    },
    [statusFilter]
  );

  useEffect(() => {
    setTasks(initialTasks);
    setPage(initialPage);
    setTotalPages(initialTotalPages);
    if (!initialTasks || initialTasks.length === 0) {
      fetchTasks(1);
    }
  }, [initialTasks, initialPage, initialTotalPages, fetchTasks]);

  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    let nextStatus: Task['status'] = 'IN_PROGRESS';
    if (currentStatus === 'IN_PROGRESS') nextStatus = 'COMPLETED';

    try {
      await tasksService.updateTaskStatus(id, nextStatus);
      fetchTasks(page, statusFilter);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to update task status.');
    }
  };

  const handleFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
    fetchTasks(1, newStatus);
  };

  return {
    tasks,
    isLoading,
    page,
    totalPages,
    statusFilter,
    handleFilterChange,
    handleUpdateStatus,
    fetchTasks,
  };
};
