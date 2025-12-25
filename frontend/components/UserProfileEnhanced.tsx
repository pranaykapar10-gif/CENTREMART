'use client';

import { useState } from 'react';
import { Heart, MapPin, Settings, LogOut, Edit2, ChevronRight, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced User Profile Component
 */
export function UserProfile() {
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  const tabs = ['orders', 'addresses', 'wishlist'] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-2xl p-8 text-white space-y-6 animate-slide-down">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 dark:bg-white/10 rounded-full border-4 border-white flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>

            <div>
              <h1 className="text-3xl font-bold dark:text-gray-100">John Doe</h1>
              <p className="text-white/80 dark:text-white/70">john.doe@example.com</p>
            </div>
          </div>

          <Link
            href="/account/settings"
            className="p-3 bg-white/20 dark:bg-white/10 rounded-lg hover:bg-white/30 dark:hover:bg-white/20 transition-all"
          >
            <Settings size={24} />
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Total Orders', value: '12' },
            { label: 'Points', value: '1,250' },
            { label: 'Member Since', value: '2 years' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-white/80 dark:text-white/70 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold dark:text-gray-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-700 animate-slide-up">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 font-semibold text-lg capitalize transition-all animate-slide-down`}
            style={{
              animationDelay: `${index * 50}ms`,
              color: activeTab === tab ? '#3B82F6' : '#9CA3AF',
              borderBottom: activeTab === tab ? '3px solid #3B82F6' : 'none',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {[1, 2, 3].map((order, index) => (
              <Link
                key={order}
                href={`/orders/${order}`}
                className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg hover:border-primary-300 transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1">Order #ORD-{String(order).padStart(4, '0')}</p>
                  <p className="text-sm text-gray-600 mb-2">Placed on Dec {10 + order}, 2024</p>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-bold">
                      Delivered
                    </span>
                    <span className="text-sm text-gray-600">3 items</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-bold text-lg text-gray-900 mb-2">${(150 + order * 50).toFixed(2)}</p>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {[1, 2].map((address, index) => (
              <div
                key={address}
                className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-primary-600" />
                    <h3 className="font-bold text-gray-900">
                      {address === 1 ? 'Home' : 'Office'}
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit2 size={16} className="text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 size={16} className="text-error-600" />
                    </button>
                  </div>
                </div>

                <div className="text-gray-600 text-sm space-y-1">
                  <p>123 Main Street, Apt {100 + address}</p>
                  <p>New York, NY 10001</p>
                  <p>+1 (555) {100 + address}-0123</p>
                </div>

                {address === 1 && (
                  <div className="mt-3 inline-flex px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                    Default Address
                  </div>
                )}
              </div>
            ))}

            <button className="w-full py-3 border-2 border-primary-600 text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors animate-slide-up">
              + Add New Address
            </button>
          </div>
        )}

        {/* Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={item}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 relative group">
                  <button className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
                    <Heart size={16} className="fill-error-600 text-error-600" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">Wishlist Item {item}</h3>

                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={i < 4 ? 'fill-warning-500 text-warning-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Price</p>
                      <p className="font-bold text-lg text-primary-600">${(29.99 + item * 10).toFixed(2)}</p>
                    </div>
                    <button className="px-3 py-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors text-sm font-bold">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-gray-200">
        <Link
          href="/account/settings"
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div>
            <p className="font-bold text-gray-900">Account Settings</p>
            <p className="text-sm text-gray-600">Manage your preferences</p>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>

        <button className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left">
          <div>
            <p className="font-bold text-gray-900">Logout</p>
            <p className="text-sm text-gray-600">Sign out from your account</p>
          </div>
          <LogOut size={20} className="text-gray-400" />
        </button>
      </div>
    </div>
  );
}
