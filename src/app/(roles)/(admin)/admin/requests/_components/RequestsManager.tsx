'use client';

import React from 'react';
import { RequestsHeader } from './RequestsHeader';
import { RequestsTable } from './RequestsTable';
import { useRequestsLogic } from '../_hooks/useRequestsLogic';
import { ServiceRequest } from '@/services/admin/requests.service';

interface Props {
  initialRequests: ServiceRequest[];
}

export default function RequestsManager({ initialRequests }: Props) {
  const logic = useRequestsLogic(initialRequests);

  return (
    <div className="space-y-6">
      <RequestsHeader 
        navigateToCreate={logic.navigateToCreate} 
        onExportCSV={logic.handleExportCSV} 
      />
      <RequestsTable
        filteredRequests={logic.filteredRequests}
        searchTerm={logic.searchTerm}
        setSearchTerm={logic.setSearchTerm}
        currentSort={logic.currentSort}
        setCurrentSort={logic.setCurrentSort}
        currentFilter={logic.currentFilter}
        setCurrentFilter={logic.setCurrentFilter}
        navigateToManage={logic.navigateToManage}
        isLoading={logic.isLoading}
      />
    </div>
  );
}
