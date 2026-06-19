import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioService, Portfolio } from '@/services/admin/portfolio.service';

type ToastState = { message: string; type: 'success' | 'error' | 'loading' } | null;

export const usePortfolioLogic = (initialPortfolios: Portfolio[]) => {
  const router = useRouter();

  const [portfolios, setPortfolios] = useState<Portfolio[]>(initialPortfolios);
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<ToastState>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPortfolios = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await portfolioService.getAllPortfoliosAdmin({ limit: 100 });
      setPortfolios(data || []);
    } catch (error) {
      setToast({ message: 'Failed to fetch portfolios.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    setPortfolios(initialPortfolios);
    if (!initialPortfolios || initialPortfolios.length === 0) {
      fetchPortfolios();
    }
  }, [initialPortfolios, fetchPortfolios]);

  const handleDelete = async (id: number) => {
    if (
      window.confirm(
        'Are you sure you want to delete this portfolio item? This action cannot be undone.'
      )
    ) {
      try {
        setToast({ message: 'Deleting portfolio...', type: 'loading' });
        await portfolioService.deletePortfolio(id);
        setToast({ message: 'Portfolio deleted successfully', type: 'success' });
        fetchPortfolios();
      } catch (error) {
        setToast({ message: 'Failed to delete portfolio', type: 'error' });
      }
    }
  };

  const handleTogglePublish = async (id: number, currentStatus: boolean) => {
    try {
      setToast({ message: 'Updating status...', type: 'loading' });
      await portfolioService.togglePublish(id);
      setToast({
        message: `Portfolio is now ${!currentStatus ? 'Published' : 'Draft'}`,
        type: 'success',
      });
      fetchPortfolios();
    } catch (error) {
      setToast({ message: 'Failed to update publish status', type: 'error' });
    }
  };

  const navigateToCreate = () => router.push('/admin/portfolio/create');
  const navigateToEdit = (id: number) => router.push(`/admin/portfolio/${id}/edit`);
  const navigateToPublic = (slug: string) => router.push(`/portfolio/${slug}`);

  const filteredPortfolios = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return portfolios.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.clientName.toLowerCase().includes(term) ||
        p.serviceType.toLowerCase().includes(term)
    );
  }, [portfolios, searchTerm]);

  return {
    portfolios,
    filteredPortfolios,
    searchTerm,
    setSearchTerm,
    toast,
    setToast,
    isLoading,
    handleDelete,
    handleTogglePublish,
    navigateToCreate,
    navigateToEdit,
    navigateToPublic,
  };
};
