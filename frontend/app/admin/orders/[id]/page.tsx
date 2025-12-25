'use client';

import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Phone, Mail, Printer, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_name: string;
  sku: string;
  image_url?: string;
}

interface OrderDetail {
  id: number;
  order_number: string;
  user_id: number;
  status: string;
  payment_status: string;
  fulfillment_status: string;
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  shipping_address_line1: string;
  shipping_address_line2?: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  billing_address_line1: string;
  billing_address_line2?: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: string;
  shipping_method?: string;
  tracking_number?: string;
  payment_method: string;
  transaction_id?: string;
  customer_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
  name?: string;
  email?: string;
  phone?: string;
  items: OrderItem[];
}

export default function AdminOrderDetail() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  // Form states for updates
  const [formData, setFormData] = useState({
    status: '',
    payment_status: '',
    fulfillment_status: '',
    tracking_number: '',
    admin_notes: '',
  });

  useEffect(() => {
    fetchOrderDetail();
  }, [orderId]);

  const fetchOrderDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      const res = await fetch(`/api/orders/admin/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await res.json();
      setOrder(data);
      setFormData({
        status: data.status,
        payment_status: data.payment_status,
        fulfillment_status: data.fulfillment_status,
        tracking_number: data.tracking_number || '',
        admin_notes: data.admin_notes || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!order) return;

    setUpdating(true);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated');
        setUpdating(false);
        return;
      }

      const res = await fetch(`/api/orders/admin/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to update order');
      }

      const data = await res.json();
      setOrder(data.order);
      alert('Order updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error updating order');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12">Loading order details...</div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error || 'Order not found'}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Back Button & Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">{order.order_number}</h1>
              <p className="text-gray-600 mt-1">
                Ordered on {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700">
              <Printer size={18} /> Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-gray-700">
              <Download size={18} /> Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Status</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Order Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Payment Status</label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Fulfillment</label>
                  <select
                    value={formData.fulfillment_status}
                    onChange={(e) => setFormData({ ...formData, fulfillment_status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 outline-none"
                  >
                    <option value="unfulfilled">Unfulfilled</option>
                    <option value="partial">Partial</option>
                    <option value="fulfilled">Fulfilled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tracking & Notes */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping & Notes</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Tracking Number</label>
                  <input
                    type="text"
                    value={formData.tracking_number}
                    onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })}
                    placeholder="Enter tracking number..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Admin Notes</label>
                  <textarea
                    value={formData.admin_notes}
                    onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                    placeholder="Add internal notes..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                  />
                </div>
                <button
                  onClick={handleUpdateOrder}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold disabled:opacity-50"
                >
                  {updating ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-3">
                {order.items && order.items.length > 0 ? (
                  order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.product_name}</p>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          {item.quantity} × ${item.unit_price.toFixed(2)}
                        </p>
                        <p className="font-bold text-gray-900">${item.total_price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No items in this order</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Totals */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-gray-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.shipping_cost > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">${order.shipping_cost.toFixed(2)}</span>
                  </div>
                )}
                {order.tax_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">${order.tax_amount.toFixed(2)}</span>
                  </div>
                )}
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-semibold">-${order.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-blue-600">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Customer</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-semibold text-gray-900">{order.name || 'N/A'}</p>
                </div>
                {order.email && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Mail size={16} /> Email
                    </p>
                    <a href={`mailto:${order.email}`} className="font-semibold text-blue-600 hover:text-blue-800">
                      {order.email}
                    </a>
                  </div>
                )}
                {order.phone && (
                  <div>
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone size={16} /> Phone
                    </p>
                    <a href={`tel:${order.phone}`} className="font-semibold text-blue-600 hover:text-blue-800">
                      {order.phone}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-semibold">{order.shipping_address_line1}</p>
                {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
                <p>
                  {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                </p>
                <p>{order.shipping_country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Payment</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Method</p>
                  <p className="font-semibold text-gray-900 capitalize">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                    order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

