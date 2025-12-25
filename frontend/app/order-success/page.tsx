'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  const orderId = searchParams.get('id');
  const status = searchParams.get('status');

  useEffect(() => {
    // Clear cart on successful order
    if (status !== 'failed') {
      clearCart();
    }
  }, [status, clearCart]);

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          {status === 'failed' ? 'Payment Failed' : 'Order Confirmed!'}
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          {status === 'failed' 
            ? 'There was an issue processing your payment. Please try again.' 
            : `Thank you for your purchase. Your order #${orderId || 'N/A'} has been placed successfully.`}
        </p>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8 text-left">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="text-blue-600" />
            What's Next?
          </h2>
          <ul className="space-y-4 text-gray-600">
            <li className="flex gap-3">
              <div className="bg-blue-50 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
              <p>You will receive an order confirmation email shortly.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-50 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
              <p>Our team will verify your order and start preparing it for shipment.</p>
            </li>
            <li className="flex gap-3">
              <div className="bg-blue-50 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
              <p>You can track your order status in your account dashboard.</p>
            </li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/shop" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition"
          >
            <ShoppingBag size={20} />
            Continue Shopping
          </Link>
          <Link 
            href="/account/orders" 
            className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-4 px-8 rounded-xl flex items-center justify-center gap-2 transition"
          >
            View My Orders
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
