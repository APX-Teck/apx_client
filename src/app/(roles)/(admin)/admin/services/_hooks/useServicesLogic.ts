import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { servicesService, Service } from '@/services/admin/services.service';

export const useServicesLogic = (initialServices: Service[]) => {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>(initialServices);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'loading') => {
    setToast({ message, type });
    if (type !== 'loading') {
      setTimeout(() => setToast(null), 3000);
    }
  };

  const fetchServices = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await servicesService.getServices();
      setServices(data || []);
    } catch (error) {
      showToast('Failed to fetch services', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setServices(initialServices);
    if (!initialServices || initialServices.length === 0) {
      fetchServices();
    }
  }, [initialServices, fetchServices]);

  const handleDelete = async (id: number) => {
    if (
      window.confirm('Are you sure you want to delete this service? This action cannot be undone.')
    ) {
      try {
        showToast('Deleting service...', 'loading');
        await servicesService.deleteService(id);
        showToast('Service deleted successfully', 'success');
        fetchServices();
      } catch (error) {
        showToast('Failed to delete service', 'error');
      }
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      showToast('Updating status...', 'loading');
      await servicesService.toggleServiceActive(id, !currentStatus);
      showToast(`Service is now ${!currentStatus ? 'Active' : 'Inactive'}`, 'success');
      fetchServices();
    } catch (error) {
      showToast('Failed to update service status', 'error');
    }
  };

  const filteredServices = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return services.filter(
      (service) =>
        service.name.toLowerCase().includes(term) || service.slug.toLowerCase().includes(term)
    );
  }, [services, searchTerm]);

  const navigateToCreate = () => router.push('/admin/services/create');
  const navigateToManageFields = (id: number) => router.push(`/admin/services/${id}/fields`);
  const navigateToEdit = (id: number) => router.push(`/admin/services/${id}/edit`);

  return {
    services,
    isLoading,
    searchTerm,
    setSearchTerm,
    toast,
    setToast,
    filteredServices,
    handleDelete,
    handleToggleActive,
    navigateToCreate,
    navigateToManageFields,
    navigateToEdit,
  };
};
