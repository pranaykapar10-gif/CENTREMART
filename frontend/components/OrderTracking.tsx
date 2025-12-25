'use client';

import { useState } from 'react';
import { MapPin, Package, Truck, CheckCircle2, Clock } from 'lucide-react';

export interface OrderTrackingEvent {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'in-transit' | 'delivered' | 'cancelled';
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
  carrier?: string;
  trackingNumber?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderTrackingEvent['status'];
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  totalPrice: number;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  events: OrderTrackingEvent[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  carrier?: string;
  trackingNumber?: string;
}

/**
 * Order Tracking Timeline Component
 */
export function OrderTrackingTimeline({ order }: { order: Order }) {
  const statusOrder = ['pending', 'processing', 'shipped', 'in-transit', 'delivered'];
  const currentStatusIndex = statusOrder.indexOf(order.status);

  const statusInfo: Record<OrderTrackingEvent['status'], { icon: React.ComponentType<{ size?: number; className?: string }>; color: string; label: string }> = {
    pending: { icon: Clock, color: 'gray', label: 'Pending' },
    processing: { icon: Package, color: 'blue', label: 'Processing' },
    shipped: { icon: Truck, color: 'purple', label: 'Shipped' },
    'in-transit': { icon: MapPin, color: 'orange', label: 'In Transit' },
    delivered: { icon: CheckCircle2, color: 'green', label: 'Delivered' },
    cancelled: { icon: CheckCircle2, color: 'red', label: 'Cancelled' },
  };

  return (
    <div className="space-y-6">
      {/* Progress Timeline */}
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          {statusOrder.map((status, index) => {
            const info = statusInfo[status as OrderTrackingEvent['status']];
            const Icon = info.icon;
            const isActive = index <= currentStatusIndex;
            const isCurrent = index === currentStatusIndex;

            return (
              <div
                key={status}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition ${
                    isActive
                      ? `bg-${info.color}-100 border-2 border-${info.color}-600`
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  <Icon
                    size={24}
                    className={
                      isActive
                        ? `text-${info.color}-600`
                        : 'text-gray-400'
                    }
                  />
                </div>
                <p
                  className={`text-sm font-medium text-center ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {info.label}
                </p>
                {isCurrent && (
                  <span className="text-xs text-blue-600 font-semibold mt-1">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
            style={{
              width: `${(currentStatusIndex / (statusOrder.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Estimated Delivery */}
      {order.estimatedDelivery && !order.actualDelivery && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>Estimated Delivery:</strong>{' '}
            {new Date(order.estimatedDelivery).toLocaleDateString()}
          </p>
        </div>
      )}

      {order.actualDelivery && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            <strong>Delivered:</strong>{' '}
            {new Date(order.actualDelivery).toLocaleDateString()}
          </p>
        </div>
      )}

      {/* Events Timeline */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-gray-900">Tracking History</h3>

        {order.events.map((event, index) => {
          const info = statusInfo[event.status];

          return (
            <div key={event.id} className="flex gap-4">
              {/* Timeline Line */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    index === 0
                      ? `bg-${info.color}-100 border-${info.color}-600`
                      : `bg-gray-100 border-gray-300`
                  }`}
                >
                  {index === 0 && (
                    <div className={`w-2 h-2 bg-${info.color}-600 rounded-full`} />
                  )}
                </div>
                {index < order.events.length - 1 && (
                  <div className="w-0.5 h-12 bg-gray-200 my-2" />
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 pb-4">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {event.title}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    {event.description}
                  </p>

                  {event.location && (
                    <p className="text-sm text-gray-500">
                      <MapPin size={14} className="inline mr-1" />
                      {event.location}
                    </p>
                  )}

                  {event.carrier && (
                    <div className="mt-2 text-xs text-gray-500">
                      <p>
                        <strong>Carrier:</strong> {event.carrier}
                      </p>
                      {event.trackingNumber && (
                        <p>
                          <strong>Tracking:</strong> {event.trackingNumber}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Order Tracking Page Component
 */
export function OrderTrackingPage() {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderNumber, setOrderNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/orders/${orderNumber}`, {
        credentials: 'include',
      });

      if (!response.ok) {
        setError('Order not found');
        setOrder(null);
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err) {
      setError('Failed to fetch order');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Track Your Order</h1>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <form onSubmit={handleTrackOrder} className="flex gap-4">
            <input
              type="text"
              placeholder="Enter order number"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition"
            >
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-8">
            {/* Order Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="font-bold text-lg text-gray-900">
                    #{order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <p className="font-bold text-lg text-blue-600 capitalize">
                    {order.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="font-bold text-lg text-gray-900">
                    ${order.totalPrice.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Carrier</p>
                  <p className="font-bold text-lg text-gray-900">
                    {order.carrier || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-4">
                  Items Ordered
                </h3>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between py-2 border-b border-gray-200 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <OrderTrackingTimeline order={order} />
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="font-bold text-lg text-gray-900 mb-4">
                Shipping Address
              </h3>
              <address className="not-italic text-gray-700">
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city},{' '}
                  {order.shippingAddress.state} {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </address>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
