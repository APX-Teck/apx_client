'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { publicPaymentService } from '@/services/public/payment.service';
import { toast } from 'react-hot-toast';
import { useRazorpay } from 'react-razorpay';

export function usePaymentCheckoutLogic(orderId: string) {
  const { Razorpay } = useRazorpay();
  const [isProcessing, setIsProcessing] = useState(false);
  const [justPaid, setJustPaid] = useState(false);

  const {
    data: payment,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['payment', orderId],
    queryFn: () => publicPaymentService.getPaymentByOrderId(orderId),
    enabled: !!orderId,
    retry: 1,
  });

  const handlePayment = () => {
    if (!payment || !orderId) {
      toast.error('Payment details not available');
      return;
    }

    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_T0yqvDRsvH5arl';

    const options = {
      key: razorpayKey,
      amount: Math.round(payment.negotiatedAmount * 100), // Amount in paise
      currency: 'INR' as any,
      name: 'APX Teck',
      description: `Payment for ${payment.service?.name || 'Service'}`,
      image: '/logo.png', // Fallback to APX Teck logo if available
      order_id: orderId, // The Razorpay Order ID passed in URL
      handler: function (response: any) {
        setIsProcessing(true);
        toast.success('Payment successful! Verifying...', { duration: 4000 });
        
        publicPaymentService.verifyPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }).then(() => {
          setJustPaid(true);
          refetch().then(() => setIsProcessing(false));
        }).catch(() => {
          // Fallback to refetch, maybe webhook processed it
          setJustPaid(true);
          refetch().then(() => setIsProcessing(false));
        });
      },
      prefill: {
        name: payment.customer?.fullName || '',
        email: payment.customer?.email || '',
        contact: payment.customer?.phone || '',
      },
      theme: {
        color: '#6366f1', // Indigo-500
      },
    };

    try {
      const rzp1 = new Razorpay(options);
      
      rzp1.on('payment.failed', function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      
      rzp1.open();
    } catch (error) {
      console.error('Razorpay initialization failed', error);
      toast.error('Could not initialize payment gateway.');
    }
  };

  const isPaid = payment?.status === 'PAID';
  const isCancelled = payment?.status === 'CANCELLED';

  return {
    payment,
    isLoading,
    isError,
    isProcessing,
    justPaid,
    isPaid,
    isCancelled,
    handlePayment,
  };
}
