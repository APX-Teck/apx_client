import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { tasksService, Priority } from '@/services/admin/tasks.service';
import apiClient from '@/lib/axios';

export const useCreateTaskLogic = (initialUsers: any[]) => {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToId: '',
    priority: 'MEDIUM' as Priority,
    dueDate: '',
  });

  const [formErrors, setFormErrors] = useState<{ title?: string; assignedToId?: string }>({});

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const response = await apiClient.get('/auth/getAllUsers?limit=100');
      const allUsers = response.data?.data?.data || [];
      const employees = allUsers.filter((u: any) => u.role?.name === 'EMPLOYEE');
      setUsers(employees);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (!initialUsers || initialUsers.length === 0) {
      fetchUsers();
    } else {
      setUsers(initialUsers.filter((u: any) => u.role?.name === 'EMPLOYEE'));
    }
  }, [initialUsers, fetchUsers]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear field error when user types
    if (e.target.name === 'title' || e.target.name === 'assignedToId') {
      setFormErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { title?: string; assignedToId?: string } = {};
    if (!formData.title) newErrors.title = 'Task Title is required.';
    if (!formData.assignedToId) newErrors.assignedToId = 'Please select a user to assign the task to.';
    
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setError('Please fix the errors below.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const payload: any = {
        title: formData.title,
        assignedToId: formData.assignedToId,
        priority: formData.priority,
      };

      if (formData.description) payload.description = formData.description;
      if (formData.dueDate) payload.dueDate = new Date(formData.dueDate).toISOString();

      await tasksService.createTask(payload);
      router.push('/admin/tasks');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to create task');
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => router.back();

  return {
    users,
    isLoadingUsers,
    formData,
    formErrors,
    isSubmitting,
    error,
    handleChange,
    handleSubmit,
    handleCancel,
  };
};
