'use client';

import { useState } from 'react';
import { Package, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

interface TrackingEvent {
  id: string;
  status: 'pending' | 'processing' | 'shipped' | 'out-for-delivery' | 'delivered';
  title: string;
  description: string;
  timestamp: Date;
  location?: string;
  carrier?: string;
  trackingNumber?: string;
}

interface OrderTrackingProps {
  orderId: string;
  status: TrackingEvent['status'];
  events: TrackingEvent[];
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

/**
 * Timeline step component
 */
function TimelineStep({
  event,
  isCompleted,
  isCurrent,
  isLast,
}: {
  event: TrackingEvent;
  isCompleted: boolean;
  isCurrent: boolean;
  isLast: boolean;
}) {
  const statusIcons: Record<string, React.ReactNode> = {
    pending: <Clock size={20} className="text-gray-400" />,
    processing: <Package size={20} className="text-primary-600" />,
    shipped: <Truck size={20} className="text-secondary-600" />,
    'out-for-delivery': <Truck size={20} className="text-warning-600" />,
    delivered: <CheckCircle size={20} className="text-success-600" />,
  };

  const bgColor = isCompleted
    ? 'bg-success-600'
    : isCurrent
    ? 'bg-primary-600'
    : 'bg-gray-300';

  return (
    <div className="flex gap-6 pb-8 last:pb-0">
      {/* Timeline Line */}
      <div className="flex flex-col items-center gap-2">
        {/* Icon Circle */}
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
            isCompleted || isCurrent ? `${bgColor}` : 'bg-gray-200'
          } text-white`}
        >
          {statusIcons[event.status]}
        </div>

        {/* Connecting Line */}
        {!isLast && (
          <div
            className={`h-12 w-1 transition-all duration-500 ${
              isCompleted ? 'bg-success-600' : 'bg-gray-200'
            }`}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pt-1">
        <div className="flex items-center justify-between mb-2">
          <h4
            className={`font-bold text-lg transition-colors ${
              isCompleted || isCurrent ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {event.title}
          </h4>
          <span
            className={`text-sm font-semibold transition-colors ${
              isCompleted || isCurrent ? 'text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {event.timestamp.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-3">{event.description}</p>

        {/* Location & Carrier Info */}
        {(event.location || event.carrier) && (
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
            {event.location && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary-600 flex-shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            {event.carrier && (
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-secondary-600 flex-shrink-0" />
                <span>{event.carrier}</span>
              </div>
            )}
          </div>
        )}

        {event.trackingNumber && (
          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tracking Number</p>
            <p className="font-mono font-bold text-gray-900 dark:text-gray-100 select-all">
              {event.trackingNumber}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Enhanced Order Tracking Component
 */
export function OrderTracking({
  orderId,
  status,
  events,
  estimatedDelivery,
  actualDelivery,
}: OrderTrackingProps) {
  const statusLabels: Record<string, string> = {
    pending: 'Order Placed',
    processing: 'Processing',
    shipped: 'Shipped',
    'out-for-delivery': 'Out for Delivery',
    delivered: 'Delivered',
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-700',
    processing: 'bg-primary-100 text-primary-700',
    shipped: 'bg-secondary-100 text-secondary-700',
    'out-for-delivery': 'bg-warning-100 text-warning-700',
    delivered: 'bg-success-100 text-success-700',
  };

  const progressPercentage = ((events.filter((e) => e.id).length - 1) / 4) * 100;

  return (
    <div className="space-y-6">
      {/* Status Card */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 border border-primary-200">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {statusLabels[status]}
            </h2>
            <p className="text-gray-600">
              Order ID: <span className="font-mono font-bold">{orderId}</span>
            </p>
          </div>
          <div className={`px-6 py-3 rounded-full font-bold ${statusColors[status]}`}>
            {statusLabels[status]}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary-600 to-secondary-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Delivery Estimate */}
        <div className="grid grid-cols-2 gap-4">
          {estimatedDelivery && (
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
                Estimated Delivery
              </p>
              <p className="text-lg font-bold text-gray-900">
                {estimatedDelivery.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
          {actualDelivery && (
            <div className="bg-white rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">
                Delivered
              </p>
              <p className="text-lg font-bold text-success-600">
                {actualDelivery.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-base p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-8">Tracking Timeline</h3>

        <div className="space-y-4">
          {events.map((event, index) => {
            const isCompleted = index < events.findIndex((e) => e.id === events[0].id) + 1;
            const isCurrent =
              status === event.status ||
              events.findIndex((e) => e.status === status) === index;

            return (
              <div key={event.id} className="animate-slide-down" style={{
                animationDelay: `${index * 100}ms`,
              }}>
                <TimelineStep
                  event={event}
                  isCompleted={isCompleted}
                  isCurrent={isCurrent}
                  isLast={index === events.length - 1}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Delivery Info */}
        <div className="bg-white rounded-2xl shadow-base p-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary-600" />
            Delivery Address
          </h4>
          <p className="text-gray-600">123 Main Street</p>
          <p className="text-gray-600">New York, NY 10001</p>
          <p className="text-gray-600">United States</p>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-base p-6">
          <h4 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
            <Package size={20} className="text-secondary-600" />
            Carrier Info
          </h4>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Carrier:</span> FedEx
          </p>
          <p className="text-gray-600 mb-2">
            <span className="font-semibold">Tracking #:</span> 1Z999AA1012345678
          </p>
          <button className="mt-4 text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            Track on Carrier Website →
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Order Tracking Search Page
 */
export function OrderTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<OrderTrackingProps | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setSearchResults({
      orderId: searchQuery || 'ORD-123456',
      status: 'shipped',
      events: [
        {
          id: '1',
          status: 'pending',
          title: 'Order Placed',
          description: 'Your order has been received and is being prepared for shipment.',
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          location: 'Warehouse, CA',
        },
        {
          id: '2',
          status: 'processing',
          title: 'Processing',
          description: 'Your order is being processed and packed.',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          location: 'Distribution Center, CA',
        },
        {
          id: '3',
          status: 'shipped',
          title: 'Shipped',
          description: 'Your package is on its way!',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          carrier: 'FedEx',
          trackingNumber: '1Z999AA1012345678',
        },
        {
          id: '4',
          status: 'out-for-delivery',
          title: 'Out for Delivery',
          description: 'Your package is out for delivery today.',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          location: 'Local Delivery Center, NY',
        },
      ],
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    });

    setIsSearching(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Search Form */}
      <div className="bg-white rounded-2xl shadow-base p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-600 mb-6">
          Enter your order number to see real-time tracking information
        </p>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter order number (e.g., ORD-123456)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-600 focus-ring transition-all"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold hover-lift transition-all disabled:opacity-75"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results */}
      {searchResults && <OrderTracking {...searchResults} />}
    </div>
  );
}
