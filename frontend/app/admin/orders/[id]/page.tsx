'use client';

import AdminLayout from '@/components/AdminLayout';
import { Download, Printer, Package, Copy, RefreshCw, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export default function AdminOrderDetail() {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock order data
  const order = {
    id: 'ORD-001',
    date: '2024-01-15',
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
    },
    status: 'Shipped',
    paymentStatus: 'Paid',
    fulfillmentStatus: 'In Transit',
    items: [
      {
        id: 1,
        name: 'Wireless Headphones Pro',
        sku: 'WHP-001',
        quantity: 1,
        price: 129.99,
        total: 129.99,
      },
      {
        id: 2,
        name: 'USB-C Fast Charger',
        sku: 'UFC-002',
        quantity: 2,
        price: 49.99,
        total: 99.98,
      },
    ],
    subtotal: 229.97,
    shipping: 10.0,
    tax: 24.0,
    discount: 0,
    total: 263.97,
    paymentMethod: 'Credit Card (Visa ending in 4242)',
    shippingMethod: 'Express Shipping (2-3 days)',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: '2024-01-18',
    addresses: {
      shipping: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA',
      },
      billing: {
        name: 'John Doe',
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA',
      },
    },
    timeline: [
      { status: 'Order Placed', date: '2024-01-15 10:30 AM', icon: '📋' },
      { status: 'Processing', date: '2024-01-15 02:15 PM', icon: '⚙️' },
      { status: 'Shipped', date: '2024-01-16 09:45 AM', icon: '📦' },
      { status: 'In Transit', date: '2024-01-17 08:20 AM', icon: '🚚' },
    ],
  };

  const [orderStatus, setOrderStatus] = useState(order.status);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Order {order.id}</h1>
            <p className="text-gray-600 mt-1">
              Placed on {new Date(order.date).toLocaleDateString()} by {order.customer.name}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition flex items-center gap-2">
              <Download size={18} /> Invoice
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition flex items-center gap-2">
              <Printer size={18} /> Print
            </button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-2">Order Status</p>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-2">Payment Status</p>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 outline-none focus:border-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-2">Fulfillment Status</p>
            <div className="flex items-center gap-2">
              <Package size={20} className="text-blue-600" />
              <p className="font-bold text-gray-900">{order.fulfillmentStatus}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'overview', label: 'Order Overview' },
              { id: 'timeline', label: 'Timeline' },
              { id: 'customer', label: 'Customer' },
              { id: 'notes', label: 'Notes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-bold border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Items */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                      >
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                          <p className="font-bold text-gray-900">${item.total.toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-bold text-gray-900">${order.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Shipping</p>
                      <p className="font-bold text-gray-900">${order.shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-600">Tax</p>
                      <p className="font-bold text-gray-900">${order.tax.toFixed(2)}</p>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <p>Discount</p>
                        <p>-${order.discount.toFixed(2)}</p>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2 flex justify-between">
                      <p className="font-bold text-gray-900">Total</p>
                      <p className="text-2xl font-black text-gray-900">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Shipping Address</h4>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">{order.addresses.shipping.name}</p>
                      <p>{order.addresses.shipping.street}</p>
                      <p>
                        {order.addresses.shipping.city}, {order.addresses.shipping.state}{' '}
                        {order.addresses.shipping.zip}
                      </p>
                      <p>{order.addresses.shipping.country}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Billing Address</h4>
                    <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                      <p className="font-semibold text-gray-900">{order.addresses.billing.name}</p>
                      <p>{order.addresses.billing.street}</p>
                      <p>
                        {order.addresses.billing.city}, {order.addresses.billing.state}{' '}
                        {order.addresses.billing.zip}
                      </p>
                      <p>{order.addresses.billing.country}</p>
                    </div>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Payment Method</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Shipping Method</h4>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">{order.shippingMethod}</p>
                    </div>
                  </div>
                </div>

                {/* Tracking */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-3">Tracking Information</h4>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700">Tracking Number</p>
                      <p className="font-mono font-bold text-blue-900">{order.trackingNumber}</p>
                      <p className="text-sm text-blue-600 mt-1">Est. Delivery: {order.estimatedDelivery}</p>
                    </div>
                    <button className="p-2 hover:bg-blue-100 rounded transition">
                      <Copy size={18} className="text-blue-600" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl">{event.icon}</span>
                      {idx < order.timeline.length - 1 && (
                        <div className="w-1 h-16 bg-blue-200 my-2" />
                      )}
                    </div>
                    <div className="pb-4">
                      <p className="font-bold text-gray-900">{event.status}</p>
                      <p className="text-sm text-gray-600">{event.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Customer Tab */}
            {activeTab === 'customer' && (
              <div className="space-y-4">
                <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Customer Name</p>
                    <p className="font-bold text-gray-900">{order.customer.name}</p>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">View Profile</button>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <a href={`mailto:${order.customer.email}`} className="font-bold text-blue-600 hover:underline">
                      {order.customer.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Phone size={20} className="text-gray-400" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Phone</p>
                    <a href={`tel:${order.customer.phone}`} className="font-bold text-blue-600 hover:underline">
                      {order.customer.phone}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Tab */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <textarea
                  placeholder="Add internal notes about this order..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  rows={5}
                />
                <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Mark as Fulfilled
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition flex items-center justify-center gap-2">
            <Mail size={18} /> Send Email to Customer
          </button>
          <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg font-bold hover:bg-red-50 transition flex items-center justify-center gap-2">
            <RefreshCw size={18} /> Request Return
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
