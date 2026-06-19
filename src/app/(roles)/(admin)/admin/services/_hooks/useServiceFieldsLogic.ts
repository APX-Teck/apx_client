import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { servicesAdminService } from '@/services/admin/services.service';
import { Service, ServiceField } from '@/app/types/service.types';

export const useServiceFieldsLogic = (
  initialService: Service | null,
  initialFields: ServiceField[] | null,
  serviceId: string
) => {
  const router = useRouter();

  const [service, setService] = useState<Service | null>(initialService);
  const [fields, setFields] = useState<ServiceField[]>(initialFields || []);
  const [isLoading, setIsLoading] = useState(!initialService);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fieldLabel: '',
    fieldKey: '',
    fieldType: 'TEXT',
    isRequired: true,
    isActive: true,
    placeholder: '',
    options: [] as string[],
  });
  const [newOption, setNewOption] = useState('');

  const refreshFields = async () => {
    try {
      const [serviceData, fieldsData] = await Promise.all([
        servicesAdminService.getServiceById(serviceId),
        servicesAdminService.getServiceFields(serviceId)
      ]);
      setService(serviceData as unknown as Service);
      const sortedFields = [...(fieldsData || [])].sort((a, b) => a.sortOrder - b.sortOrder);
      setFields(sortedFields as unknown as ServiceField[]);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!initialService) {
      refreshFields();
    }
  }, [initialService]);

  const handleGenerateKey = (label: string) => {
    return label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');
  };

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData((prev) => ({
      ...prev,
      fieldLabel: val,
      fieldKey: !editingFieldId ? handleGenerateKey(val) : prev.fieldKey,
    }));
  };

  const openAddModal = () => {
    setFormData({
      fieldLabel: '',
      fieldKey: '',
      fieldType: 'TEXT',
      isRequired: true,
      isActive: true,
      placeholder: '',
      options: [],
    });
    setEditingFieldId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (field: ServiceField) => {
    let parsedOptions: string[] = [];
    if (Array.isArray(field.options)) {
      parsedOptions = field.options;
    } else if (typeof field.options === 'string') {
      try {
        parsedOptions = JSON.parse(field.options);
      } catch (e) {}
    }

    setFormData({
      fieldLabel: field.fieldLabel,
      fieldKey: field.fieldKey,
      fieldType: field.fieldType,
      isRequired: field.isRequired,
      isActive: field.isActive,
      placeholder: field.placeholder || '',
      options: parsedOptions,
    });
    setEditingFieldId(field.id);
    setIsModalOpen(true);
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFormData((prev) => ({
        ...prev,
        options: [...prev.options, newOption.trim()],
      }));
      setNewOption('');
    }
  };

  const removeOption = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index),
    }));
  };

  const handleSaveField = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.fieldType === 'DROPDOWN' && formData.options.length === 0) {
      alert('Please add at least one option for the dropdown field.');
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        sortOrder: editingFieldId ? undefined : fields.length,
      };

      if (editingFieldId) {
        await servicesAdminService.updateServiceField(editingFieldId, payload);
      } else {
        await servicesAdminService.createServiceField(serviceId, payload);
      }

      setIsModalOpen(false);
      await refreshFields();
    } catch (error) {
      console.error('Failed to save field', error);
      alert('Failed to save field. Please check your inputs.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this field? This will remove it from the questionnaire.'
      )
    ) {
      try {
        await servicesAdminService.deleteServiceField(id);
        await refreshFields();
      } catch (error) {
        console.error('Failed to delete field', error);
        alert('Failed to delete field.');
      }
    }
  };

  const moveField = async (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === fields.length - 1)
    )
      return;

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;

    newFields.forEach((f, i) => {
      f.sortOrder = i;
    });

    setFields(newFields);

    try {
      const payload = newFields.map((f) => ({ id: f.id, sortOrder: f.sortOrder }));
      await servicesAdminService.reorderServiceFields(payload);
    } catch (error) {
      console.error('Failed to reorder fields', error);
      await refreshFields();
    }
  };

  return {
    service,
    fields,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    isSaving,
    editingFieldId,
    formData,
    setFormData,
    newOption,
    setNewOption,
    handleLabelChange,
    openAddModal,
    openEditModal,
    addOption,
    removeOption,
    handleSaveField,
    handleDelete,
    moveField,
    router,
  };
};
