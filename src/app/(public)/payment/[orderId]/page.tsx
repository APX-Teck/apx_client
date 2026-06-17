import { Metadata } from 'next';
import { PaymentClient } from './PaymentClient';

export async function generateMetadata({ params }: { params: { orderId: string } }): Promise<Metadata> {
  // Can be extended to fetch metadata from server based on orderId
  return {
    title: `Payment Checkout | APXTeck`,
    description: 'Secure payment checkout for APXTeck services.',
  };
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  // If orderId comes as an array somehow (catch-all), take the first
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;

  return (
    <div className="min-h-screen bg-[url('/grid-bg.svg')] bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent dark:from-indigo-500/20 dark:via-purple-500/10 dark:to-transparent pointer-events-none blur-3xl"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-50 dark:opacity-30 mix-blend-multiply"></div>

      {/* Render the Client Orchestrator */}
      <PaymentClient orderId={orderId} />
    </div>
  );
}
