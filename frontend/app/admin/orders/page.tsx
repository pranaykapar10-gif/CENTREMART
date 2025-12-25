'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, Filter, MoreVertical, Eye } from 'lucide-react';
import { useState } from 'react';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');

  // Mock orders data
  const allOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      customer: 'John Doe',
      email: 'john@example.com',
      total: 124.99,
      items: 3,
      status: 'Delivered',
      paymentStatus: 'Paid',
      fulfillment: 'Completed',
    },
    {
      id: 'ORD-002',
      date: '2024-01-14',
      customer: 'Jane Smith',
      email: 'jane@example.com',
      total: 89.5,
      items: 2,
      status: 'Processing',
      paymentStatus: 'Paid',
      fulfillment: 'Pending',
    },
    {
      id: 'ORD-003',
      date: '2024-01-14',
      customer: 'Bob Johnson',
      email: 'bob@example.com',
      total: 256.0,
      items: 5,
      status: 'Shipped',
      paymentStatus: 'Paid',
      fulfillment: 'In Transit',
    },
    {
      id: 'ORD-004',
      date: '2024-01-13',
      customer: 'Alice Williams',
      email: 'alice@example.com',
      total: 45.99,
      items: 1,
      status: 'Pending',
      paymentStatus: 'Pending',
      fulfillment: 'Pending',
    },
    {
      id: 'ORD-005',
      date: '2024-01-13',
      customer: 'Charlie Brown',
      email: 'charlie@example.com',
      total: 199.99,
      items: 4,
      status: 'Delivered',
      paymentStatus: 'Paid',
      fulfillment: 'Completed',
    },
    {
      id: 'ORD-006',
      date: '2024-01-12',
      customer: 'Diana Prince',
      email: 'diana@example.com',
      total: 312.5,
      items: 6,
      status: 'Shipped',
      paymentStatus: 'Paid',
      fulfillment: 'In Transit',
    },
    {
      id: 'ORD-007',
      date: '2024-01-12',
      customer: 'Eve Johnson',
      email: 'eve@example.com',
      total: 67.3,
      items: 2,
      status: 'Delivered',
      paymentStatus: 'Paid',
      fulfillment: 'Completed',
    },
    {
      id: 'ORD-008',
      date: '2024-01-11',
      customer: 'Frank Miller',
      email: 'frank@example.com',
      total: 145.75,
      items: 3,
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      fulfillment: 'Cancelled',
    },
  ];

  // Filter orders
  let filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort orders
  if (sortBy === 'newest') {
    filteredOrders = filteredOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (sortBy === 'oldest') {
    filteredOrders = filteredOrders.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } else if (sortBy === 'highest') {
    filteredOrders = filteredOrders.sort((a, b) => b.total - a.total);
  } else if (sortBy === 'lowest') {
    filteredOrders = filteredOrders.sort((a, b) => a.total - b.total);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'Pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'Refunded':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const getFulfillmentColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700';
      case 'In Transit':
        return 'bg-blue-50 text-blue-700';
      case 'Pending':
        return 'bg-gray-50 text-gray-700';
      case 'Cancelled':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  const statuses = ['All', 'Delivered', 'Shipped', 'Processing', 'Pending', 'Cancelled'];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-gray-900">{filteredOrders.length}</p>
            <p className="text-sm text-gray-600">Active Orders</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={18} className="text-gray-600" />
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sort and Results */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredOrders.length}</span> of{' '}
              <span className="font-bold">{allOrders.length}</span> orders
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold text-gray-900 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Total</option>
              <option value="lowest">Lowest Total</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Order</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Items</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Payment</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Fulfillment</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer">{order.id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{order.customer}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                        {order.items}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getFulfillmentColor(order.fulfillment)}`}>
                        {order.fulfillment}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded transition" title="View">
                          <Eye size={18} className="text-gray-600" />
                        </button>
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-200 rounded transition">
                            <MoreVertical size={18} className="text-gray-600" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              View Details
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              Send Invoice
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              Print Shipping Label
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 border-t border-gray-200">
                              Cancel Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <p className="text-gray-600 font-semibold">No orders found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Page <span className="font-bold">1</span> of <span className="font-bold">1</span>
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                Previous
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded-lg text-sm font-semibold text-gray-900">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
