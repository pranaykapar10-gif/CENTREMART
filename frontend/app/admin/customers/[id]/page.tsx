'use client';

import AdminLayout from '@/components/AdminLayout';
import { Mail, Phone, MapPin, Calendar, ShoppingCart, TrendingUp, AlertCircle, Download } from 'lucide-react';
import { useState } from 'react';

export default function AdminCustomerDetail() {
  const [activeTab, setActiveTab] = useState('profile');

  // Mock customer data
  const customer = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    joinDate: '2023-06-15',
    lastOrder: '2024-01-08',
    avatar: '👨',
    status: 'Active',
    segment: 'Premium',
    orders: 12,
    totalSpent: 1524.99,
    avgOrderValue: 127.08,
    addresses: [
      {
        id: 1,
        type: 'Billing',
        street: '123 Main Street',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        country: 'USA',
        isDefault: true,
      },
      {
        id: 2,
        type: 'Shipping',
        street: '456 Oak Avenue',
        city: 'Oakland',
        state: 'CA',
        zip: '94607',
        country: 'USA',
        isDefault: false,
      },
    ],
  };

  // Mock order history
  const orderHistory = [
    {
      id: 'ORD-001',
      date: '2024-01-08',
      total: 156.99,
      status: 'Delivered',
      items: 3,
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ORD-002',
      date: '2023-12-15',
      total: 89.5,
      status: 'Delivered',
      items: 2,
      paymentMethod: 'PayPal',
    },
    {
      id: 'ORD-003',
      date: '2023-11-22',
      total: 234.75,
      status: 'Delivered',
      items: 4,
      paymentMethod: 'Credit Card',
    },
    {
      id: 'ORD-004',
      date: '2023-10-30',
      total: 112.4,
      status: 'Delivered',
      items: 2,
      paymentMethod: 'Credit Card',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{customer.avatar}</div>
            <div>
              <h1 className="text-4xl font-black text-gray-900">{customer.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-bold ${
                    customer.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {customer.status}
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-800">
                  {customer.segment}
                </span>
                <span className="text-sm text-gray-600">
                  Joined {new Date(customer.joinDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
            Send Message
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Orders</p>
            <p className="text-3xl font-black text-gray-900">{customer.orders}</p>
            <p className="text-xs text-blue-600 font-bold mt-2">Premium customer</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Spent</p>
            <p className="text-3xl font-black text-gray-900">${customer.totalSpent.toFixed(2)}</p>
            <p className="text-xs text-green-600 font-bold mt-2">Lifetime value</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Avg Order Value</p>
            <p className="text-3xl font-black text-gray-900">${customer.avgOrderValue.toFixed(2)}</p>
            <p className="text-xs text-purple-600 font-bold mt-2">Per transaction</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Last Order</p>
            <p className="text-xl font-black text-gray-900">{new Date(customer.lastOrder).toLocaleDateString()}</p>
            <p className="text-xs text-blue-600 font-bold mt-2">8 days ago</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'profile', label: 'Contact Info' },
              { id: 'addresses', label: 'Addresses' },
              { id: 'orders', label: 'Order History' },
              { id: 'activity', label: 'Activity' },
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
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-bold text-gray-900">{customer.email}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded">
                    Edit
                  </button>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <Phone size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-bold text-gray-900">{customer.phone}</p>
                  </div>
                  <button className="ml-auto px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded">
                    Edit
                  </button>
                </div>

                <div className="h-px bg-gray-200" />

                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="font-bold text-gray-900">{new Date(customer.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                {customer.addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border border-gray-200 rounded-lg p-4 flex items-start justify-between hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-600 mt-1" />
                      <div>
                        <p className="font-bold text-gray-900 flex items-center gap-2">
                          {address.type}
                          {address.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                              Default
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.street}
                          <br />
                          {address.city}, {address.state} {address.zip}
                          <br />
                          {address.country}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded">
                        Edit
                      </button>
                      <button className="px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50 rounded">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition">
                  + Add Address
                </button>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="space-y-3">
                {orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-bold text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{new Date(order.date).toLocaleDateString()} • {order.items} items</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <button className="ml-4 p-2 hover:bg-gray-200 rounded transition">
                      <Download size={18} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                  <ShoppingCart size={20} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-blue-900">Order Placed</p>
                    <p className="text-sm text-blue-700">Order ORD-001 placed for $156.99</p>
                    <p className="text-xs text-blue-600 mt-1">2024-01-08 10:30 AM</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                  <TrendingUp size={20} className="text-green-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-900">Loyalty Tier Updated</p>
                    <p className="text-sm text-green-700">Upgraded to Premium tier</p>
                    <p className="text-xs text-green-600 mt-1">2024-01-05 02:15 PM</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-bold text-yellow-900">Review Left</p>
                    <p className="text-sm text-yellow-700">Customer left 5-star review on Wireless Headphones Pro</p>
                    <p className="text-xs text-yellow-600 mt-1">2024-01-02 08:45 PM</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
