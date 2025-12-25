'use client';

import { useState } from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign, BarChart3, Activity, AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

/**
 * Enhanced Admin Dashboard Component
 */
export function AdminDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<string>('revenue');

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Welcome back, Admin</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            icon: DollarSign,
            label: 'Total Revenue',
            value: '$125,430',
            change: '+12.5%',
            gradient: 'from-emerald-600 to-green-600',
            metric: 'revenue',
          },
          {
            icon: ShoppingCart,
            label: 'Total Orders',
            value: '2,847',
            change: '+8.2%',
            gradient: 'from-blue-600 to-cyan-600',
            metric: 'orders',
          },
          {
            icon: Users,
            label: 'Total Customers',
            value: '8,923',
            change: '+15.3%',
            gradient: 'from-purple-600 to-pink-600',
            metric: 'customers',
          },
          {
            icon: Activity,
            label: 'Conversion Rate',
            value: '3.24%',
            change: '+2.1%',
            gradient: 'from-orange-600 to-yellow-600',
            metric: 'conversion',
          },
        ].map((metric, index) => {
          const Icon = metric.icon;
          const isSelected = selectedMetric === metric.metric;

          return (
            <button
              key={metric.metric}
              onClick={() => setSelectedMetric(metric.metric)}
              className={`p-6 rounded-2xl cursor-pointer transition-all hover-lift animate-slide-up ${
                isSelected
                  ? `bg-gradient-to-br ${metric.gradient} text-white shadow-lg dark:shadow-gray-950 scale-105`
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  size={24}
                  className={isSelected ? 'text-white/80' : 'text-gray-400 dark:text-gray-500'}
                />
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
                  }`}
                >
                  {metric.change}
                </span>
              </div>

              <p className={`text-sm mb-2 ${isSelected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'}`}>
                {metric.label}
              </p>
              <p className={`text-3xl font-bold ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                {metric.value}
              </p>
            </button>
          );
        })}
      </div>

      {/* Charts and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-base border border-gray-200 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Revenue Trend</h2>
              <p className="text-gray-600">Last 7 days</p>
            </div>
            <BarChart3 size={24} className="text-primary-600" />
          </div>

          {/* Simplified Bar Chart */}
          <div className="flex items-end justify-between h-48 gap-2">
            {[65, 59, 80, 81, 56, 55, 75].map((value, index) => (
              <div
                key={index}
                className="flex-1 bg-gradient-primary rounded-lg hover:opacity-80 transition-opacity cursor-pointer group animate-slide-up relative"
                style={{
                  height: `${value}%`,
                  animationDelay: `${index * 50}ms`,
                }}
                title={`Day ${index + 1}: $${value}K`}
              >
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold whitespace-nowrap">
                  ${value}K
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-around text-center text-xs text-gray-600">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
          {[
            { label: 'Pending Orders', value: '24', color: 'warning' },
            { label: 'Low Stock Items', value: '8', color: 'error' },
            { label: 'Active Users', value: '1,245', color: 'success' },
          ].map((stat, index) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg bg-${stat.color}-50 border-l-4 border-${stat.color}-600 animate-slide-down`}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-base border border-gray-200 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
          <Link href="/admin/orders" className="text-primary-600 hover:text-primary-700 font-bold flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-bold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((order, index) => (
                <tr
                  key={order}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors animate-slide-down"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="py-4 px-4 font-mono font-bold text-gray-900">
                    #ORD-{String(order).padStart(4, '0')}
                  </td>
                  <td className="py-4 px-4 text-gray-600">Customer {order}</td>
                  <td className="py-4 px-4 font-bold text-gray-900">${(150 + order * 50).toFixed(2)}</td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order % 2 === 0
                          ? 'bg-success-100 text-success-700'
                          : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {order % 2 === 0 ? 'Shipped' : 'Processing'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">Dec {10 + order}, 2024</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-4 animate-slide-up">
        <div className="flex items-center gap-3 p-4 bg-warning-50 border-l-4 border-warning-600 rounded-lg">
          <AlertCircle size={20} className="text-warning-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">Low Inventory Alert</p>
            <p className="text-sm text-gray-600">8 products are running low on stock</p>
          </div>
          <Link href="/admin/inventory" className="ml-auto text-warning-600 hover:text-warning-700 font-bold">
            Review
          </Link>
        </div>

        <div className="flex items-center gap-3 p-4 bg-error-50 border-l-4 border-error-600 rounded-lg">
          <AlertCircle size={20} className="text-error-600 flex-shrink-0" />
          <div>
            <p className="font-bold text-gray-900">Failed Payments</p>
            <p className="text-sm text-gray-600">3 recent payment failures require attention</p>
          </div>
          <Link href="/admin/payments" className="ml-auto text-error-600 hover:text-error-700 font-bold">
            Review
          </Link>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8 border-t border-gray-200 animate-slide-up">
        {[
          { label: 'Product Management', href: '/admin/products' },
          { label: 'User Management', href: '/admin/users' },
          { label: 'Analytics', href: '/admin/analytics' },
        ].map((action, index) => (
          <Link
            key={action.label}
            href={action.href}
            className="p-4 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg border border-primary-200 hover:shadow-lg transition-all animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="font-bold text-primary-900 flex items-center gap-2">
              {action.label} <ChevronRight size={16} />
            </p>
          </Link>
        ))}

        <div className="col-span-1 md:col-span-3 flex items-center gap-4">
          <button
            onClick={async () => {
              try {
                toast.loading('Triggering snapshot build...');
                const res = await fetch('/api/admin/force-rebuild', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'x-admin-token': process.env.NEXT_PUBLIC_ADMIN_FORCE_TOKEN || '' },
                });
                const data = await res.json();
                if (data.ok) {
                  toast.dismiss();
                  toast.success('Snapshot build queued successfully');
                } else {
                  toast.dismiss();
                  toast.error('Snapshot build failed');
                }
              } catch (e) {
                toast.dismiss();
                toast.error('Snapshot build request failed');
              }
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            Force Refresh Now
          </button>
          <p className="text-sm text-gray-600">Force a snapshot build and publish diffs to CDN (admin only).</p>
        </div>
      </div>
    </div>
  );
}
