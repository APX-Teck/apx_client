'use client';

import React from 'react';
import { Payment } from '@/services/admin/payments.service';
import { Toaster } from 'react-hot-toast';
import { usePaymentsLogic } from '../_hooks/usePaymentsLogic';

import { PaymentsHeader } from './PaymentsHeader';
import { PaymentsSummary } from './PaymentsSummary';
import { PaymentsTable } from './PaymentsTable';

import { MarkPaidDialog } from './modals/MarkPaidDialog';
import { CreatePaymentLinkDialog } from './modals/CreatePaymentLinkDialog';
import { InvoicePrintModal } from './modals/InvoicePrintModal';

interface Props {
  initialPaymentsData: {
    payments: Payment[];
    total: number;
    page: number;
  };
  initialRequestsData: any[];
}

export function PaymentsClientWrapper({ initialPaymentsData, initialRequestsData }: Props) {
  const logic = usePaymentsLogic(initialPaymentsData, initialRequestsData);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      {/* Header with Actions */}
      <PaymentsHeader onOpenCreateLink={() => logic.setIsCreateLinkOpen(true)} />

      {/* Summary Stats */}
      <PaymentsSummary payments={logic.payments} />

      {/* Main Content */}
      <PaymentsTable
        payments={logic.filteredPayments}
        resendPending={logic.resendMutation.isPending}
        resendVariables={logic.resendMutation.variables ?? null}
        onResend={(id) => logic.resendMutation.mutate(id)}
        onMarkPaid={logic.openMarkPaidDialog}
        onOpenInvoice={logic.openInvoiceDialog}
        setSearchTerm={logic.setSearchTerm}
        isLoading={logic.isLoading}
      />

      {/* Modals */}
      <MarkPaidDialog
        isOpen={logic.isMarkPaidOpen}
        payment={logic.selectedPayment}
        amountPaidInput={logic.amountPaidInput}
        transactionIdInput={logic.transactionIdInput}
        isPending={logic.markPaidMutation.isPending}
        onClose={logic.closeMarkPaidDialog}
        onConfirm={logic.handleConfirmMarkPaid}
        setAmountPaidInput={logic.setAmountPaidInput}
        setTransactionIdInput={logic.setTransactionIdInput}
      />

      <CreatePaymentLinkDialog
        isOpen={logic.isCreateLinkOpen}
        requestsData={logic.requestsData}
        selectedRequestId={logic.selectedRequestId}
        createNegotiatedAmount={logic.createNegotiatedAmount}
        createSuggestedAmount={logic.createSuggestedAmount}
        createInvoiceNote={logic.createInvoiceNote}
        isPending={logic.createPaymentMutation.isPending}
        onClose={() => logic.setIsCreateLinkOpen(false)}
        onConfirm={logic.handleCreatePaymentLink}
        setSelectedRequestId={logic.setSelectedRequestId}
        setCreateNegotiatedAmount={logic.setCreateNegotiatedAmount}
        setCreateSuggestedAmount={logic.setCreateSuggestedAmount}
        setCreateInvoiceNote={logic.setCreateInvoiceNote}
      />

      <InvoicePrintModal
        isOpen={logic.isInvoiceOpen}
        payment={logic.invoicePayment}
        isSending={logic.sendInvoiceMutation.isPending}
        onClose={() => logic.setIsInvoiceOpen(false)}
        onSendInvoice={(id) => logic.sendInvoiceMutation.mutate(id)}
      />
    </div>
  );
}
