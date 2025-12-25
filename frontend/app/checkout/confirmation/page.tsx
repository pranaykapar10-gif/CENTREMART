'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Printer, Package, Truck, Mail } from 'lucide-react';

// Generate deterministic but unique IDs for confirmation page
const generateOrderNumber = () => `ORD-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
const generateTrackingNumber = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TRK';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

interface OrderDetails {
  orderNumber: string;
  date: string;
  estimatedDelivery: string;
  trackingNumber: string;
}

// Create static order details on mount
const createOrderDetails = (): OrderDetails => ({
  orderNumber: generateOrderNumber(),
  date: new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  trackingNumber: generateTrackingNumber(),
});

export default function ConfirmationPage() {
  const orderDetails = createOrderDetails();

  useEffect(() => {
    // Simulate sending confirmation email
    console.log('Confirmation email sent to customer email');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
            <CheckCircle size={56} className="text-green-600" />
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 text-lg">Thank you for your purchase</p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-6">
          {/* Order Number */}
          <div className="border-b pb-6 mb-6">
            <p className="text-gray-600 text-sm mb-2">Order Number</p>
            <p className="text-3xl font-black text-gray-900 font-mono">{orderDetails.orderNumber}</p>
            <p className="text-gray-600 text-sm mt-2">Order placed on {orderDetails.date}</p>
          </div>

          {/* Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <Package className="text-blue-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Status</p>
                <p className="font-bold text-gray-900">Processing</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Truck className="text-purple-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Est. Delivery</p>
                <p className="font-bold text-gray-900">{orderDetails.estimatedDelivery}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
              <Mail className="text-orange-600 flex-shrink-0" size={24} />
              <div>
                <p className="text-gray-600 text-sm">Email Sent</p>
                <p className="font-bold text-gray-900">Confirmation</p>
              </div>
            </div>
          </div>

          {/* Tracking Number */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-gray-600 text-sm mb-2">Tracking Number</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-mono font-bold text-gray-900">{orderDetails.trackingNumber}</p>
              <button
                onClick={() => navigator.clipboard.writeText(orderDetails.trackingNumber)}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Copy
              </button>
            </div>
          </div>

          {/* What&apos;s Next */}
          <div className="border-t pt-6">
            <h3 className="font-bold text-gray-900 mb-3">What&apos;s Next?</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>We&apos;ve sent a confirmation email with your order details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Your order is being processed and will be shipped soon</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>You&apos;ll receive a shipping notification with tracking details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Estimated delivery by {orderDetails.estimatedDelivery}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-700 text-sm mb-4">
            If you have any questions about your order, please don&apos;t hesitate to contact our support team.
          </p>
          <button className="text-blue-600 font-semibold hover:text-blue-700 text-sm">
            Contact Support
          </button>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg transition"
          >
            <Printer size={20} />
            Print Receipt
          </button>
          <Link
            href="/shop"
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Account Links */}
        <div className="text-center mt-8 space-y-2 text-sm">
          <p className="text-gray-600">
            You can track your order in{' '}
            <Link href="/account/orders" className="font-bold text-blue-600 hover:text-blue-700">
              My Orders
            </Link>
          </p>
          <p className="text-gray-600">
            View your{' '}
            <Link href="/account" className="font-bold text-blue-600 hover:text-blue-700">
              Account Settings
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
