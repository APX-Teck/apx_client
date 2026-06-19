import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceRequest, requestsService } from '@/services/admin/requests.service';

export const useRequestsLogic = (initialRequests: ServiceRequest[]) => {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(initialRequests.length === 0);

  useEffect(() => {
    if (initialRequests.length === 0) {
      const fetchRequests = async () => {
        setIsLoading(true);
        try {
          const result = await requestsService.getRequests();
          setRequests(result);
        } catch (error) {
          console.error('Failed to load requests', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRequests();
    }
  }, [initialRequests.length]);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return requests.filter(
      (req) =>
        req.customerName.toLowerCase().includes(term) ||
        String(req.id).toLowerCase().includes(term) ||
        req.serviceType.toLowerCase().includes(term)
    );
  }, [requests, searchTerm]);

  const navigateToCreate = () => router.push('/admin/requests/create');
  const navigateToManage = (id: string | number) => router.push(`/admin/requests/${id}`);

  return {
    requests,
    searchTerm,
    setSearchTerm,
    filteredRequests,
    navigateToCreate,
    navigateToManage,
    isLoading,
  };
};
