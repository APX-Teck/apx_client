import { useState, useEffect } from 'react';
import { z } from 'zod';
import { rolesService, Role } from '@/services/admin/roles.service';

const roleSchema = z.object({
  name: z.string()
    .min(3, 'Role name must be at least 3 characters')
    .max(50, 'Role name cannot exceed 50 characters')
    .regex(/^[A-Z_]+$/, 'Role name can only contain uppercase letters and underscores'),
  description: z.string().optional(),
});

export const useRolesLogic = (initialRoles: Role[]) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(initialRoles.length === 0);

  const fetchRoles = async () => {
    try {
      setIsLoading(true);
      const result = await rolesService.getRoles();
      setRoles(result);
    } catch (error) {
      console.error('Failed to load roles', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialRoles.length === 0) {
      fetchRoles();
    }
  }, [initialRoles.length]);

  const handleOpenModal = (mode: 'CREATE' | 'EDIT', role?: Role) => {
    setModalMode(mode);
    setErrors({});
    setServerError('');
    if (mode === 'EDIT' && role) {
      setSelectedRole(role);
      setFormData({ name: role.name, description: role.description || '' });
    } else {
      setSelectedRole(null);
      setFormData({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setServerError('');
  };

  const handleFormDataChange = (newData: { name: string; description: string }) => {
    const updatedData = { ...newData, name: newData.name.toUpperCase().replace(/\s+/g, '_') };
    setFormData(updatedData);
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const validationResult = roleSchema.safeParse(formData);
    if (!validationResult.success) {
      const flatErrors = validationResult.error.flatten().fieldErrors;
      const fieldErrors: Record<string, string> = {};
      for (const key in flatErrors) {
        const errorArray = flatErrors[key as keyof typeof flatErrors];
        if (errorArray && errorArray.length > 0) {
          fieldErrors[key] = errorArray[0];
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      const formattedName = formData.name;
      if (modalMode === 'CREATE') {
        await rolesService.createRole({ name: formattedName, description: formData.description });
      } else if (modalMode === 'EDIT' && selectedRole) {
        await rolesService.updateRole(selectedRole.id, {
          name: formattedName,
          description: formData.description,
        });
      }
      handleCloseModal();
      fetchRoles();
    } catch (error: any) {
      setServerError(error?.response?.data?.message || error.message || 'Failed to save role');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (
      window.confirm(`Are you sure you want to delete the role "${name}"? This cannot be undone.`)
    ) {
      try {
        await rolesService.deleteRole(id);
        fetchRoles();
      } catch (error: any) {
        alert(error?.response?.data?.message || error.message || 'Failed to delete role');
      }
    }
  };

  return {
    roles,
    isModalOpen,
    modalMode,
    selectedRole,
    formData,
    setFormData: handleFormDataChange,
    errors,
    serverError,
    isSubmitting,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isLoading,
  };
};
