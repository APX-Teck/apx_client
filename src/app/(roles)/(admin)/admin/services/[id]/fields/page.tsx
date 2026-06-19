import React from 'react';
import { servicesAdminService } from '@/services/admin/services.service';
import { ServiceFieldsClient } from '../../_components/ServiceFieldsClient';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Service, ServiceField } from '@/app/types/service.types';

export default async function ServiceFieldsBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const serviceId = resolvedParams.id;

  let service = null;
  let fields: ServiceField[] = [];

  try {
    const [serviceData, fieldsData] = await Promise.all([
      servicesAdminService.getServiceById(serviceId),
      servicesAdminService.getServiceFields(serviceId),
    ]);

    service = serviceData as unknown as Service;

    if (fieldsData) {
      const sortedFields = [...fieldsData].sort((a, b) => a.sortOrder - b.sortOrder);
      fields = sortedFields as unknown as ServiceField[];
    }
  } catch (error) {
    console.error('Failed to fetch service fields data:', error);
  }

  if (!service) {
    // If SSR fails (missing auth), return the Client component with null so it can fetch securely.
    return (
      <ServiceFieldsClient initialService={null as any} initialFields={[]} serviceId={serviceId} />
    );
  }

  return (
    <ServiceFieldsClient initialService={service} initialFields={fields} serviceId={serviceId} />
  );
}
