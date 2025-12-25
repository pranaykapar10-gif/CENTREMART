'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, Filter, MoreVertical, Eye } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Order {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  total_amount: number;
  shipping_address_line1: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  created_at: string;
  updated_at: string;
  customer_notes: string;
  admin_notes: string;
  tracking_number?: string;
  name?: string;
  email?: string;
  phone?: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, paymentFilter, searchTerm]);

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', limit.toString());
      if (statusFilter) params.append('status', statusFilter);
      if (paymentFilter) params.append('payment_status', paymentFilter);
      if (searchTerm) params.append('search', searchTerm);

      const res = await fetch(`/api/orders/admin/all?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setTotalOrders(data.pagination?.total || 0);
      setTotalPages(data.pagination?.pages || 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'pending':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200';
      case 'refunded':
        return 'bg-gray-50 text-gray-700 border border-gray-200';
      case 'failed':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
  const paymentStatuses = ['pending', 'paid', 'refunded', 'failed'];

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
            <p className="text-3xl font-black text-gray-900">{totalOrders}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
          {/* Search */}
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or location..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>

          {/* Status Filters */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={18} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Order Status:</span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(statusFilter === status ? '' : status);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                    statusFilter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-700">Payment Status:</span>
              {paymentStatuses.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setPaymentFilter(paymentFilter === status ? '' : status);
                    setPage(1);
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                    paymentFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Results Info */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{orders.length}</span> of{' '}
              <span className="font-bold">{totalOrders}</span> orders
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-600">Loading orders...</div>
          ) : orders.length > 0 ? (
            <>
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Payment</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Fulfillment</th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`}>
                          <p className="font-bold text-blue-600 hover:text-blue-800 cursor-pointer">
                            {order.order_number}
                          </p>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <p className="font-semibold text-gray-900">{order.shipping_city}, {order.shipping_state}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-gray-900">
                        ${order.total_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getPaymentStatusColor(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-3 py-1 rounded-full text-xs font-bold capitalize bg-gray-50 text-gray-700">
                          {order.fulfillment_status || 'pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Link href={`/admin/orders/${order.id}`}>
                          <button className="p-1 hover:bg-gray-200 rounded transition" title="View">
                            <Eye size={18} className="text-gray-600" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page <span className="font-bold">{page}</span> of <span className="font-bold">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
