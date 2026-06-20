'use client';
import React from 'react';
import { TasksHeader } from './TasksHeader';
import { TasksTable } from './TasksTable';
import { useTasksLogic } from '../_hooks/useTasksLogic';
import { Task } from '@/services/admin/tasks.service';

interface Props {
  initialTasks: Task[];
}

export default function TasksManager({ initialTasks }: Props) {
  const logic = useTasksLogic(initialTasks);

  return (
    <>
      <TasksHeader navigateToCreate={logic.navigateToCreate} />
      <TasksTable
        filteredTasks={logic.filteredTasks}
        isLoading={logic.isLoading}
        searchTerm={logic.searchTerm}
        setSearchTerm={logic.setSearchTerm}
        currentSort={logic.currentSort}
        setCurrentSort={logic.setCurrentSort}
        currentFilter={logic.currentFilter}
        setCurrentFilter={logic.setCurrentFilter}
        handleUpdateStatus={logic.handleUpdateStatus}
        handleDeleteTaskClick={logic.handleDeleteTaskClick}
        navigateToDetails={logic.navigateToDetails}
        isDeleteModalOpen={logic.isDeleteModalOpen}
        setIsDeleteModalOpen={logic.setIsDeleteModalOpen}
        confirmDeleteTask={logic.confirmDeleteTask}
        isDeleting={logic.isDeleting}
      />
    </>
  );
}
