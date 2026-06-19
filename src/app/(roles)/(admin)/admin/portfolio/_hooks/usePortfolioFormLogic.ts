import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioService } from '@/services/admin/portfolio.service';

export const usePortfolioFormLogic = (initialData?: any, mode: 'create' | 'edit' = 'create', portfolioId?: number) => {
  const router = useRouter();
  const [isFetchingFallback, setIsFetchingFallback] = useState(false);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    clientName: initialData?.clientName || '',
    serviceType: initialData?.serviceType || '',
    problem: initialData?.problem || '',
    solution: initialData?.solution || '',
    results: initialData?.results || '',
    liveUrl: initialData?.liveUrl || '',
    isPublished: initialData?.isPublished ?? false,
    sortOrder: initialData?.sortOrder || 0,
    completedAt: initialData?.completedAt
      ? new Date(initialData.completedAt).toISOString().split('T')[0]
      : '',
  });

  useEffect(() => {
    if (mode === 'edit' && !initialData && portfolioId) {
      setIsFetchingFallback(true);
      portfolioService
        .getPortfolioByIdAdmin(portfolioId)
        .then((data) => {
          if (data) {
            setFormData({
              title: data.title || '',
              clientName: data.clientName || '',
              serviceType: data.serviceType || '',
              problem: data.problem || '',
              solution: data.solution || '',
              results: data.results || '',
              liveUrl: data.liveUrl || '',
              isPublished: data.isPublished ?? false,
              sortOrder: data.sortOrder || 0,
              completedAt: data.completedAt ? new Date(data.completedAt).toISOString().split('T')[0] : '',
            });
          }
        })
        .catch(console.error)
        .finally(() => setIsFetchingFallback(false));
    }
  }, [initialData, mode, portfolioId]);

  const [formErrors, setFormErrors] = useState<{ title?: string; clientName?: string; serviceType?: string }>({});

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [clientLogo, setClientLogo] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'loading';
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (['title', 'clientName', 'serviceType'].includes(name)) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { title?: string; clientName?: string; serviceType?: string } = {};
    if (!formData.title.trim()) errors.title = 'Project Title is required.';
    if (!formData.clientName.trim()) errors.clientName = 'Client Name is required.';
    if (!formData.serviceType.trim()) errors.serviceType = 'Service Type is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToast({ message: 'Please fill in all required fields.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setToast({ message: 'Saving portfolio...', type: 'loading' });

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          data.append(key, String(value));
        }
      });

      if (coverImage) data.append('coverImage', coverImage);
      if (clientLogo) data.append('clientLogo', clientLogo);
      galleryImages.forEach((file) => data.append('galleryImages', file));

      if (mode === 'create') {
        await portfolioService.createPortfolio(data);
      } else {
        await portfolioService.updatePortfolio(initialData.id, data, 'replace');
      }

      setToast({ message: 'Portfolio saved successfully!', type: 'success' });
      setTimeout(() => router.push('/admin/portfolio'), 1000);
    } catch (error: any) {
      setToast({
        message: error.response?.data?.message || 'Failed to save portfolio',
        type: 'error',
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return {
    formData,
    handleChange,
    setCoverImage,
    setClientLogo,
    setGalleryImages,
    isSubmitting,
    toast,
    formErrors,
    handleSubmit,
    handleCancel,
    isFetchingFallback,
  };
};
