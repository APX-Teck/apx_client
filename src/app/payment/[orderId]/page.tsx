"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRazorpay } from "react-razorpay";
import { CreditCard, CheckCircle, AlertCircle, RefreshCcw } from "lucide-react";
import axios from "axios";

const NEXT_PUBLIC_NODEJS_API_URL = process.env.NEXT_PUBLIC_NODEJS_API_URL || "http://localhost:8090/api/v1";
const NEXT_PUBLIC_RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function CheckoutPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const { Razorpay } = useRazorpay();

  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"IDLE" | "PROCESSING" | "SUCCESS" | "FAILED">("IDLE");

  useEffect(() => {
    if (!orderId) return;

    const fetchPaymentDetails = async () => {
      try {
        const { data } = await axios.get(`${NEXT_PUBLIC_NODEJS_API_URL}/payment/order/${orderId}`);
        if (data.success && data.data) {
          setPaymentData(data.data);
          if (data.data.status === "PAID") {
            setStatus("SUCCESS");
          }
        } else {
          setError("Invoice not found.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch invoice details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [orderId]);

  const handlePayment = () => {
    if (!paymentData || !NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      setError("Payment configuration is missing.");
      return;
    }

    setStatus("PROCESSING");

    const options: any = {
      key: NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: Math.round(paymentData.negotiatedAmount * 100),
      currency: "INR",
      name: "APX Teck",
      description: `Payment for ${paymentData.service?.name}`,
      order_id: orderId as string,
      handler: function (response: any) {
        // The webhook handles the actual backend capture. We just show success.
        setStatus("SUCCESS");
      },
      prefill: {
        name: paymentData.customer?.fullName,
        email: paymentData.customer?.email,
        contact: paymentData.customer?.phone,
      },
      theme: {
        color: "#2563eb",
      },
      modal: {
        ondismiss: function () {
          setStatus("IDLE");
        },
      },
    };

    const rzp = new Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      setStatus("FAILED");
      setError(response.error.description || "Payment failed.");
    });
    rzp.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400">Loading your invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white p-4">
        <div className="bg-[#161b22] border border-gray-800 rounded-xl max-w-md w-full p-8 text-center space-y-4 shadow-2xl">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h1 className="text-2xl font-bold">Oops!</h1>
          <p className="text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-6 flex items-center justify-center gap-2 px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg mx-auto transition-colors"
          >
            <RefreshCcw size={16} /> Try Again
          </button>
        </div>
      </div>
    );
  }

  if (status === "SUCCESS" || paymentData?.status === "PAID") {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white p-4">
        <div className="bg-[#161b22] border border-green-900/50 rounded-xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Thank you, {paymentData.customer?.fullName}. Your payment of <span className="text-white font-medium">₹{paymentData.negotiatedAmount}</span> for {paymentData.service?.name} has been received.</p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-white p-4 font-sans">
      <div className="bg-[#161b22] border border-gray-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-center">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mx-auto mb-3">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Complete Your Payment</h1>
          <p className="text-blue-100 text-sm mt-1">Invoice for Req #{paymentData.serviceRequestId}</p>
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Billed To</p>
            <p className="font-medium text-lg">{paymentData.customer?.fullName}</p>
            <p className="text-sm text-gray-500">{paymentData.customer?.email}</p>
          </div>

          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Service</span>
              <span className="font-medium">{paymentData.service?.name}</span>
            </div>
            
            {paymentData.invoiceNote && (
              <div className="flex justify-between items-start mb-4">
                <span className="text-gray-400">Note</span>
                <span className="text-sm text-right max-w-[60%]">{paymentData.invoiceNote}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-4 border-t border-gray-800 mt-2">
              <span className="text-gray-300 font-medium">Amount Payable</span>
              <div className="text-right">
                {paymentData.suggestedAmount && Number(paymentData.suggestedAmount) > Number(paymentData.negotiatedAmount) && (
                  <span className="line-through text-gray-500 text-sm mr-2">₹{paymentData.suggestedAmount}</span>
                )}
                <span className="text-2xl font-bold text-green-400">₹{paymentData.negotiatedAmount}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={status === "PROCESSING"}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 rounded-xl font-bold text-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20"
          >
            {status === "PROCESSING" ? (
              <>
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              "Pay Now Securely"
            )}
          </button>
          
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
              Payments are secured and encrypted by <span className="font-semibold">Razorpay</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
