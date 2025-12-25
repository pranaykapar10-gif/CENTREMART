'use client';

import { useParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Printer, Download, Truck, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.id as string;

  // Mock order details
  const order = {
    id: orderId,
    date: 'November 1, 2025',
    status: 'Delivered',
    trackingNumber: 'TRKABCD1234567890',
    estimatedDelivery: 'November 5, 2025',
    total: '$124.99',
    subtotal: '$110.00',
    shipping: '$9.99',
    tax: '$5.00',
    items: [
      { id: 1, name: 'Wireless Headphones', price: '$79.99', quantity: 1, emoji: '🎧' },
      { id: 2, name: 'Phone Case', price: '$19.99', quantity: 2, emoji: '📱' },
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States',
      phone: '+1 (555) 000-0000',
    },
    billingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States',
    },
    payment: {
      method: 'Visa ending in 4242',
      status: 'Paid',
    },
    timeline: [
      { status: 'Order Placed', date: 'Nov 1, 2025 10:00 AM', icon: '📦' },
      { status: 'Processing', date: 'Nov 1, 2025 2:30 PM', icon: '⚙️' },
      { status: 'Shipped', date: 'Nov 2, 2025 9:15 AM', icon: '🚚' },
      { status: 'Out for Delivery', date: 'Nov 5, 2025 8:00 AM', icon: '🚐' },
      { status: 'Delivered', date: 'Nov 5, 2025 2:45 PM', icon: '✓' },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/account" className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-block">
            ← Back to Account
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-gray-900">Order {order.id}</h1>
              <p className="text-gray-600 mt-1">Ordered on {order.date}</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 px-4 rounded-lg transition">
                <Download size={20} />
                Invoice
              </button>
              <button className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-900 font-bold py-2 px-4 rounded-lg transition">
                <Printer size={20} />
                Print
              </button>
            </div>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Status</p>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                  <CheckCircle size={20} className="text-green-600" />
                </span>
                <p className="text-lg font-bold text-green-600">{order.status}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Tracking Number</p>
              <p className="text-lg font-mono font-bold text-gray-900">{order.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Delivery Estimate</p>
              <p className="text-lg font-bold text-gray-900">{order.estimatedDelivery}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-black text-blue-600">{order.total}</p>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
            <Truck size={20} />
            Track Package
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Timeline</h2>
              <div className="space-y-6">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="text-2xl mb-2">{event.icon}</div>
                      <div className={`w-1 flex-1 ${idx < order.timeline.length - 1 ? 'bg-gray-300' : 'hidden'}`} />
                    </div>
                    <div className="pb-4">
                      <p className="font-bold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{item.emoji}</div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">${(parseFloat(item.price.slice(1)) * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">{order.shipping}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax</span>
                  <span className="font-semibold">{order.tax}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-4 border-t">
                  <span>Total</span>
                  <span>{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Shipping Address</h3>
              <p className="text-gray-700">{order.shippingAddress.name}</p>
              <p className="text-gray-700">{order.shippingAddress.street}</p>
              <p className="text-gray-700">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p className="text-gray-700 mt-3">{order.shippingAddress.phone}</p>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Billing Address</h3>
              <p className="text-gray-700">{order.billingAddress.name}</p>
              <p className="text-gray-700">{order.billingAddress.street}</p>
              <p className="text-gray-700">
                {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
              </p>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Payment Method</h3>
              <p className="text-gray-700 font-mono">{order.payment.method}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-100">
                  <CheckCircle size={16} className="text-green-600" />
                </span>
                <span className="text-sm font-semibold text-green-600">{order.payment.status}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition mb-2">
                Print Receipt
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-2 rounded-lg transition mb-2">
                Request Return
              </button>
              <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-2 rounded-lg transition">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
