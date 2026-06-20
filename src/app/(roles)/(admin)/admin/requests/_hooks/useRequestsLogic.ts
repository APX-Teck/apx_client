import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ServiceRequest, requestsService } from '@/services/admin/requests.service';

export const useRequestsLogic = (initialRequests: ServiceRequest[]) => {
  const router = useRouter();
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSort, setCurrentSort] = useState('newest');
  const [currentFilter, setCurrentFilter] = useState('ALL');
  const [isLoading, setIsLoading] = useState(initialRequests.length === 0);

  useEffect(() => {
    const fetchRequests = async () => {
      if (requests.length === 0) setIsLoading(true);
      try {
        const result = await requestsService.getRequests();
        if (result && result.length > 0) {
          setRequests(result);
        }
      } catch (error) {
        console.error('Failed to load requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    const term = searchTerm.toLowerCase();
    let result = requests.filter((req) => {
      const matchesSearch =
        req.customerName.toLowerCase().includes(term) ||
        String(req.id).toLowerCase().includes(term) ||
        req.serviceType.toLowerCase().includes(term);
      const matchesFilter = currentFilter === 'ALL' || req.status === currentFilter;
      return matchesSearch && matchesFilter;
    });

    result.sort((a, b) => {
      switch (currentSort) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'priority':
          const priorityWeights: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
          return (priorityWeights[b.priority] || 0) - (priorityWeights[a.priority] || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [requests, searchTerm, currentSort, currentFilter]);

  const handleExportCSV = () => {
    if (requests.length === 0) return;
    
    const headers = ['Request ID', 'Customer', 'Email', 'Service', 'Priority', 'Status', 'Assigned To', 'Date'];
    const csvRows = [headers.join(',')];
    
    filteredRequests.forEach(req => {
      const row = [
        req.id,
        `"${req.customerName}"`,
        `"${req.customerEmail}"`,
        `"${req.serviceType}"`,
        req.priority,
        req.status,
        `"${req.assignedTo || 'Unassigned'}"`,
        `"${new Date(req.createdAt).toLocaleDateString()}"`
      ];
      csvRows.push(row.join(','));
    });
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `requests_export_${new Date().getTime()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const navigateToCreate = () => router.push('/admin/requests/create');
  const navigateToManage = (id: string | number) => router.push(`/admin/requests/${id}`);

  return {
    requests,
    searchTerm,
    setSearchTerm,
    currentSort,
    setCurrentSort,
    currentFilter,
    setCurrentFilter,
    filteredRequests,
    navigateToCreate,
    navigateToManage,
    isLoading,
    handleExportCSV,
  };
};
