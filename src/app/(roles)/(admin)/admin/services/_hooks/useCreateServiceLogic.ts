import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { servicesAdminService } from '@/services/admin/services.service';

export const useCreateServiceLogic = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    timeline: '',
    isActive: true,
    sortOrder: 0,
  });

  const [formErrors, setFormErrors] = useState<{ name?: string }>({});
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

    if (name === 'name') {
      setFormErrors((prev) => ({ ...prev, name: undefined }));
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

    if (!formData.name.trim()) {
      setFormErrors({ name: 'Service Name is required.' });
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.slug) submitData.append('slug', formData.slug);
      if (formData.description) submitData.append('description', formData.description);
      if (formData.price) submitData.append('price', formData.price);
      if (formData.timeline) submitData.append('timeline', formData.timeline);
      submitData.append('isActive', formData.isActive.toString());
      submitData.append('sortOrder', formData.sortOrder.toString());

      if (thumbnailFile) {
        submitData.append('thumbnail', thumbnailFile);
      }

      await servicesAdminService.createService(submitData);
      router.push('/admin/services');
      router.refresh();
    } catch (error) {
      console.error('Failed to create service', error);
      alert('Failed to create service. Please check the inputs and try again.');
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    previewImage,
    formData,
    formErrors,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    router,
  };
};
