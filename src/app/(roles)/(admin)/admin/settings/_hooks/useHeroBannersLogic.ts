import { useState, useEffect } from 'react';
import { heroBannersService } from '@/services/admin/heroBanners.service';
import { HeroBanner } from '@/app/types/home.types';
import { ToastState } from '../_components/SettingsManager';

export const useHeroBannersLogic = (
  initialBanners: HeroBanner[],
  setToast: (toast: ToastState) => void
) => {
  const [banners, setBanners] = useState<HeroBanner[]>(initialBanners);
  const [isLoadingBanners, setIsLoadingBanners] = useState(!initialBanners || initialBanners.length === 0);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  const [bannerForm, setBannerForm] = useState({
    mediaType: 'IMAGE' as 'IMAGE' | 'VIDEO',
    title: '',
    subtitle: '',
    ctaText: '',
    ctaLink: '',
    sortOrder: 0,
    isActive: true,
  });

  const [bannerFile, setBannerFile] = useState<File | null>(null);

  const fetchBanners = async () => {
    try {
      setIsLoadingBanners(true);
      const res = await heroBannersService.getBanners();
      setBanners(res.data || []);
    } catch (error) {
      setToast({ message: 'Failed to load banners', type: 'error' });
    } finally {
      setIsLoadingBanners(false);
    }
  };

  useEffect(() => {
    if (!initialBanners || initialBanners.length === 0) {
      fetchBanners();
    }
  }, [initialBanners]);

  const openCreateModal = () => {
    setEditingBanner(null);
    setBannerForm({
      mediaType: 'IMAGE',
      title: '',
      subtitle: '',
      ctaText: '',
      ctaLink: '',
      sortOrder: banners.length > 0 ? Math.max(...banners.map((b) => b.sortOrder)) + 1 : 0,
      isActive: true,
    });
    setBannerFile(null);
    setIsBannerModalOpen(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setBannerForm({
      mediaType: banner.mediaType || 'IMAGE',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      ctaText: banner.ctaText || '',
      ctaLink: banner.ctaLink || '',
      sortOrder: banner.sortOrder || 0,
      isActive: banner.isActive,
    });
    setBannerFile(null);
    setIsBannerModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setToast({
        message: editingBanner ? 'Updating banner...' : 'Creating banner...',
        type: 'loading',
      });
      const formData = new FormData();
      formData.append('mediaType', bannerForm.mediaType);
      if (bannerForm.title) formData.append('title', bannerForm.title);
      if (bannerForm.subtitle) formData.append('subtitle', bannerForm.subtitle);
      if (bannerForm.ctaText) formData.append('ctaText', bannerForm.ctaText);
      if (bannerForm.ctaLink) formData.append('ctaLink', bannerForm.ctaLink);
      formData.append('sortOrder', bannerForm.sortOrder.toString());
      formData.append('isActive', bannerForm.isActive.toString());
      if (bannerFile) formData.append('media', bannerFile);

      if (editingBanner) await heroBannersService.updateBanner(editingBanner.id, formData);
      else await heroBannersService.createBanner(formData);

      setToast({ message: 'Banner saved successfully', type: 'success' });
      setIsBannerModalOpen(false);
      fetchBanners();
    } catch (error: any) {
      setToast({ message: error.response?.data?.message || 'Operation failed', type: 'error' });
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Delete this banner permanently?')) {
      try {
        setToast({ message: 'Deleting...', type: 'loading' });
        await heroBannersService.deleteBanner(id);
        setToast({ message: 'Banner deleted', type: 'success' });
        fetchBanners();
      } catch (error) {
        setToast({ message: 'Failed to delete', type: 'error' });
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      setToast({ message: 'Updating status...', type: 'loading' });
      await heroBannersService.toggleBannerActive(id);
      setToast({ message: 'Status updated', type: 'success' });
      fetchBanners();
    } catch (error) {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  return {
    banners,
    isLoadingBanners,
    isBannerModalOpen,
    setIsBannerModalOpen,
    editingBanner,
    bannerForm,
    setBannerForm,
    bannerFile,
    setBannerFile,
    openCreateModal,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleToggleActive,
  };
};
