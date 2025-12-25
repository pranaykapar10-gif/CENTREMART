'use client';

import { useState, useEffect } from 'react';
import { Package, ChevronRight, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import Link from 'next/link';

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  payment_status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="text-amber-500" size={20} />;
      case 'processing': return <Package className="text-blue-500" size={20} />;
      case 'shipped': return <Truck className="text-purple-500" size={20} />;
      case 'delivered': return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-gray-500" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-bold">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-gray-900">My Orders</h1>
          <Link href="/shop" className="text-blue-600 font-bold hover:underline">
            Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet. Start shopping to see them here!</p>
            <Link href="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:border-blue-300 transition group">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 p-3 rounded-xl group-hover:bg-blue-50 transition">
                      <Package className="text-gray-600 group-hover:text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Order #{order.order_number}</p>
                      <p className="text-lg font-bold text-gray-900">Rs. {order.total_amount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        {getStatusIcon(order.status)}
                        <span className="font-bold text-gray-900 capitalize">{order.status}</span>
                      </div>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <Link 
                      href={`/account/orders/${order.id}`}
                      className="bg-gray-50 hover:bg-blue-600 hover:text-white p-2 rounded-lg transition"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
