'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { PaymentsHeader } from './PaymentsHeader';
import { PaymentsSummary } from './PaymentsSummary';
import { PaymentsTable } from './PaymentsTable';
import { usePaymentsLogic } from '../_hooks/usePaymentsLogic';
import { Payment } from '../types';
import { useAuth } from '@/providers/AuthProvider';
import { InvoiceModal } from './modals/InvoiceModal';
import { useState } from 'react';

interface PaymentsManagerProps {
  initialPayments: Payment[];
}

export default function PaymentsManager({ initialPayments }: PaymentsManagerProps) {
  const { payments, isLoading, amountDue, lastPayment } = usePaymentsLogic(initialPayments);
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8 pb-12">
      <PaymentsHeader />
      <PaymentsSummary isLoading={isLoading} amountDue={amountDue} lastPayment={lastPayment} onViewInvoice={setSelectedPayment} />
      <PaymentsTable isLoading={isLoading} payments={payments} onViewInvoice={setSelectedPayment} />
      {selectedPayment && (
        <InvoiceModal
          payment={selectedPayment}
          user={user}
          onClose={() => setSelectedPayment(null)}
        />
      )}
    </motion.div>
  );
}
