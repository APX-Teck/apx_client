import { useState, useEffect } from 'react';
import { rolesService, Role } from '@/services/admin/roles.service';

export const useRolesLogic = (initialRoles: Role[]) => {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formattedName = formData.name.toUpperCase().replace(/\s+/g, '_');
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
      alert(error?.response?.data?.message || error.message || 'Failed to save role');
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
    setFormData,
    isSubmitting,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleDelete,
    isLoading,
  };
};
