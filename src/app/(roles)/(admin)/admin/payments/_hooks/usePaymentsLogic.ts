import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService, Payment } from '@/services/admin/payments.service';
import { requestsService } from '@/services/admin/requests.service';
import toast from 'react-hot-toast';

interface InitialData {
  payments: Payment[];
  total: number;
  page: number;
}

export function usePaymentsLogic(initialPaymentsData: InitialData, initialRequestsData: any[]) {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modals state
  const [isMarkPaidOpen, setIsMarkPaidOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [amountPaidInput, setAmountPaidInput] = useState('');
  const [transactionIdInput, setTransactionIdInput] = useState('');

  const [isCreateLinkOpen, setIsCreateLinkOpen] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string>('');
  const [createNegotiatedAmount, setCreateNegotiatedAmount] = useState('');
  const [createSuggestedAmount, setCreateSuggestedAmount] = useState('');
  const [createInvoiceNote, setCreateInvoiceNote] = useState('');

  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [invoicePayment, setInvoicePayment] = useState<Payment | null>(null);

  // Queries
  const {
    data: paymentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['payments'],
    queryFn: () => paymentsService.getPayments(),
    initialData: initialPaymentsData?.payments?.length > 0 ? initialPaymentsData : undefined,
  });

  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['serviceRequests'],
    queryFn: () => requestsService.getRequests(),
    initialData: initialRequestsData?.length > 0 ? initialRequestsData : undefined,
  });

  const payments = paymentsData?.payments || [];

  const filteredPayments = useMemo(() => {
    if (!searchTerm) return payments;
    const lowerTerm = searchTerm.toLowerCase();
    return payments.filter(
      (p) =>
        p.id.toString().includes(lowerTerm) ||
        p.customer.fullName.toLowerCase().includes(lowerTerm) ||
        p.service.name.toLowerCase().includes(lowerTerm)
    );
  }, [payments, searchTerm]);

  // Mutations
  const sendInvoiceMutation = useMutation({
    mutationFn: (id: number) => paymentsService.sendInvoiceEmail(id),
    onSuccess: () => toast.success('Invoice sent to customer successfully'),
    onError: () => toast.error('Failed to send invoice email'),
  });

  const resendMutation = useMutation({
    mutationFn: (id: number) => paymentsService.resendInvoiceLink(id),
    onSuccess: () => toast.success('Payment link resent'),
    onError: () => toast.error('Failed to resend payment link'),
  });

  const markPaidMutation = useMutation({
    mutationFn: ({
      id,
      amountPaid,
      transactionId,
    }: {
      id: number;
      amountPaid: number;
      transactionId?: string;
    }) => paymentsService.markAsPaid(id, { amountPaid, transactionId }),
    onMutate: async ({ id, amountPaid, transactionId }) => {
      await queryClient.cancelQueries({ queryKey: ['payments'] });
      const previousPayments = queryClient.getQueryData<{
        payments: Payment[];
        total: number;
        page: number;
      }>(['payments']);

      if (previousPayments) {
        queryClient.setQueryData(['payments'], {
          ...previousPayments,
          payments: previousPayments.payments.map((p) =>
            p.id === id
              ? {
                  ...p,
                  status: 'PAID',
                  amountPaid: amountPaid.toString(),
                  transactionId: transactionId || null,
                }
              : p
          ),
        });
      }
      return { previousPayments };
    },
    onSuccess: () => {
      toast.success('Payment marked as paid');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      closeMarkPaidDialog();
    },
    onError: (err, newTodo, context) => {
      if (context?.previousPayments) {
        queryClient.setQueryData(['payments'], context.previousPayments);
      }
      toast.error('Failed to mark as paid');
    },
  });

  const createPaymentMutation = useMutation({
    mutationFn: (payload: {
      customerId: number;
      serviceRequestId: number;
      suggestedAmount?: number;
      negotiatedAmount: number;
      invoiceNote?: string;
    }) => paymentsService.createPaymentLink(payload),
    onSuccess: () => {
      toast.success('Payment link created successfully');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      setIsCreateLinkOpen(false);
      setSelectedRequestId('');
      setCreateNegotiatedAmount('');
      setCreateSuggestedAmount('');
      setCreateInvoiceNote('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create payment link');
    },
  });

  // Handlers
  const openInvoiceDialog = (payment: Payment) => {
    setInvoicePayment(payment);
    setIsInvoiceOpen(true);
  };

  const openMarkPaidDialog = (payment: Payment) => {
    setSelectedPayment(payment);
    setAmountPaidInput(payment.negotiatedAmount);
    setTransactionIdInput('');
    setIsMarkPaidOpen(true);
  };

  const closeMarkPaidDialog = () => {
    setIsMarkPaidOpen(false);
    setSelectedPayment(null);
  };

  const handleConfirmMarkPaid = () => {
    if (!selectedPayment) return;
    markPaidMutation.mutate({
      id: selectedPayment.id,
      amountPaid: Number(amountPaidInput),
      transactionId: transactionIdInput || undefined,
    });
  };

  const handleCreatePaymentLink = () => {
    if (!selectedRequestId || !createNegotiatedAmount) {
      toast.error('Service Request and Negotiated Amount are required');
      return;
    }

    const request = requestsData?.find((r: any) => r.id.toString() === selectedRequestId);
    if (!request || !request.customerId) {
      toast.error('Could not determine customer for this request');
      return;
    }

    createPaymentMutation.mutate({
      customerId: request.customerId,
      serviceRequestId: Number(selectedRequestId),
      suggestedAmount: createSuggestedAmount ? Number(createSuggestedAmount) : undefined,
      negotiatedAmount: Number(createNegotiatedAmount),
      invoiceNote: createInvoiceNote || undefined,
    });
  };

  return {
    // State
    searchTerm,
    setSearchTerm,
    viewMode,
    setViewMode,
    isMarkPaidOpen,
    setIsMarkPaidOpen,
    selectedPayment,
    setSelectedPayment,
    amountPaidInput,
    setAmountPaidInput,
    transactionIdInput,
    setTransactionIdInput,
    isCreateLinkOpen,
    setIsCreateLinkOpen,
    selectedRequestId,
    setSelectedRequestId,
    createNegotiatedAmount,
    setCreateNegotiatedAmount,
    createSuggestedAmount,
    setCreateSuggestedAmount,
    createInvoiceNote,
    setCreateInvoiceNote,
    isInvoiceOpen,
    setIsInvoiceOpen,
    invoicePayment,
    setInvoicePayment,

    // Data
    payments,
    filteredPayments,
    requestsData,
    isLoading,
    isError,
    isLoadingRequests,

    // Mutations
    sendInvoiceMutation,
    resendMutation,
    markPaidMutation,
    createPaymentMutation,

    // Handlers
    openInvoiceDialog,
    openMarkPaidDialog,
    closeMarkPaidDialog,
    handleConfirmMarkPaid,
    handleCreatePaymentLink,
  };
}
