import apiClient from '@/lib/axios';
import { extractDataArray, extractDataObject } from '@/lib/api/responseParser';

export type TaskStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  assignedToId: number;
  assignedTo?: { fullName: string; profile?: { profilePhotoUrl: string | null } };
  createdById: number;
  createdBy?: { fullName: string; profile?: { profilePhotoUrl: string | null } };
  status: TaskStatus;
  priority: Priority;
  dueDate: string | null;
  completedAt: string | null;
  attachmentUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export const tasksService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await apiClient.get('/task');
      return extractDataArray<Task>(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
      return [];
    }
  },

  getTaskById: async (id: number): Promise<Task | null> => {
    try {
      const response = await apiClient.get(`/task/${id}`);
      return extractDataObject<Task>(response.data);
    } catch (error) {
      console.error('Failed to fetch task', error);
      return null;
    }
  },

  createTask: async (data: any): Promise<Task> => {
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });
    const response = await apiClient.post('/task', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return extractDataObject<Task>(response.data) || response.data;
  },

  updateTaskStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    const response = await apiClient.patch(`/task/${id}`, { status });
    return extractDataObject<Task>(response.data) || response.data;
  },

  updateTaskPriority: async (id: number, priority: Priority): Promise<Task> => {
    const response = await apiClient.patch(`/task/${id}`, { priority });
    return extractDataObject<Task>(response.data) || response.data;
  },

  deleteTask: async (id: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/task/${id}`);
    return { success: response.data?.success ?? true };
  },
};
