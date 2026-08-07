import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { servicesAdminService } from '@/services/admin/services.service';
import { Service } from '@/app/types/service.types';

export const useEditServiceLogic = (initialService: Service, serviceId: string) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(
    initialService.thumbnailUrl || null
  );

  const [formData, setFormData] = useState({
    name: initialService.name || '',
    slug: initialService.slug || '',
    description: initialService.description || '',
    price: initialService.price ? String(initialService.price) : '',
    timeline: initialService.timeline || '',
    isActive: initialService.isActive ?? true,
    sortOrder: initialService.sortOrder || 0,
  });

  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === 'sortOrder') {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.description && formData.description.length > 5000) {
      alert('Description is too long! Please keep it under 5000 characters (Backend Limit).');
      setIsSubmitting(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.slug) submitData.append('slug', formData.slug);
      if (formData.description) submitData.append('description', formData.description.slice(0, 5000));
      if (formData.price) submitData.append('price', formData.price);
      if (formData.timeline) submitData.append('timeline', formData.timeline);
      submitData.append('isActive', formData.isActive.toString());
      submitData.append('sortOrder', formData.sortOrder.toString());

      if (thumbnailFile) {
        submitData.append('thumbnail', thumbnailFile);
      }

      await servicesAdminService.updateService(serviceId, submitData);
      router.push('/admin/services');
      router.refresh();
    } catch (error) {
      console.error('Failed to update service', error);
      alert('Failed to update service. Please check the inputs and try again.');
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    previewImage,
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    router,
  };
};
