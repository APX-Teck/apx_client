import { useEffect, useMemo, useState } from 'react';
import { isAxiosError } from 'axios';
import toast from 'react-hot-toast';
import { invoicesService } from '@/services/admin/invoices.service';
import { Invoice, InvoiceStatus } from '@/app/types/invoice.types';

export type InvoiceStatusFilter = 'ALL' | InvoiceStatus;

export function useInvoicesLogic(initialInvoices: Invoice[] = []) {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isLoading, setIsLoading] = useState(initialInvoices.length === 0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Client-side fallback when the server render couldn't fetch (e.g. no auth cookie during SSR)
  useEffect(() => {
    if (initialInvoices.length > 0) return;
    let cancelled = false;
    invoicesService.getInvoices({ limit: 100 }).then((data) => {
      if (cancelled) return;
      setInvoices(data);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [initialInvoices]);

  const filteredInvoices = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return invoices.filter(
      (invoice) =>
        (statusFilter === 'ALL' || invoice.status === statusFilter) &&
        (!term ||
          invoice.invoiceNumber.toLowerCase().includes(term) ||
          invoice.clientName.toLowerCase().includes(term) ||
          invoice.clientGSTIN?.toLowerCase().includes(term))
    );
  }, [invoices, searchTerm, statusFilter]);

  const updateStatus = async (invoice: Invoice, status: InvoiceStatus) => {
    if (
      status === 'CANCELLED' &&
      !window.confirm(`Cancel invoice ${invoice.invoiceNumber}? The PDF stays on record.`)
    ) {
      return;
    }
    setUpdatingId(invoice.id);
    try {
      const updated = await invoicesService.updateStatus(invoice.id, status);
      setInvoices((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      toast.success(`Invoice ${invoice.invoiceNumber} marked ${status.toLowerCase()}`);
    } catch (error) {
      toast.error(
        (isAxiosError(error) && error.response?.data?.message) || 'Failed to update invoice status'
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return {
    invoices,
    filteredInvoices,
    isLoading,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    updatingId,
    updateStatus,
  };
}
