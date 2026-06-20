import apiClient from '@/lib/axios';
import { Task } from '@/services/admin/tasks.service';
import { extractDataArray, extractPagination, extractDataObject } from '@/lib/api/responseParser';

export interface TasksResponse {
  success: boolean;
  message: string;
  data: {
    data: Task[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export const tasksService = {
  getMyTasks: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
  }): Promise<{ success: boolean; data: { data: Task[]; pagination: any } }> => {
    try {
      const response = await apiClient.get('/task/mine', { params });
      return {
        success: response.data?.success ?? true,
        data: {
          data: extractDataArray<Task>(response.data),
          pagination: extractPagination(response.data, 0),
        },
      };
    } catch (error) {
      console.error('Failed to fetch my tasks', error);
      return {
        success: false,
        data: { data: [], pagination: { total: 0, page: 1, totalPages: 1 } },
      };
    }
  },

  getMyTaskById: async (id: number): Promise<Task | null> => {
    try {
      const response = await apiClient.get(`/task/mine/${id}`);
      return extractDataObject<Task>(response.data);
    } catch (error) {
      console.error('Failed to fetch task details', error);
      return null;
    }
  },

  updateTaskStatus: async (
    id: number,
    status: Task['status']
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiClient.patch(`/task/mine/${id}/status`, { status });
      return { success: response.data.success, message: response.data.message };
    } catch (error: any) {
      console.error('Failed to update task status', error);
      throw error;
    }
  },
};
