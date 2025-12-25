'use client';

import AdminLayout from '@/components/AdminLayout';
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Download } from 'lucide-react';
import { useState } from 'react';

interface ChartDataPoint {
  label: string;
  value: number;
}

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('7days');

  // Mock analytics data
  const dailyRevenue: ChartDataPoint[] = [
    { label: 'Mon', value: 1250 },
    { label: 'Tue', value: 1890 },
    { label: 'Wed', value: 1650 },
    { label: 'Thu', value: 2100 },
    { label: 'Fri', value: 2890 },
    { label: 'Sat', value: 3200 },
    { label: 'Sun', value: 2450 },
  ];

  const categoryRevenue: ChartDataPoint[] = [
    { label: 'Electronics', value: 8500 },
    { label: 'Accessories', value: 5200 },
    { label: 'Power', value: 3900 },
    { label: 'Protection', value: 2800 },
    { label: 'Cases', value: 2100 },
  ];

  const conversionFunnel = [
    { stage: 'Visitors', count: 45000, percentage: 100 },
    { stage: 'Product Views', count: 28500, percentage: 63 },
    { stage: 'Add to Cart', count: 12300, percentage: 27 },
    { stage: 'Checkout', count: 8900, percentage: 20 },
    { stage: 'Purchase', count: 6240, percentage: 14 },
  ];

  const topProducts = [
    { name: 'Wireless Headphones Pro', sales: 342, revenue: 22230 },
    { name: 'USB-C Fast Charger', sales: 528, revenue: 10560 },
    { name: 'Premium Phone Case', sales: 421, revenue: 5047 },
    { name: 'Screen Protector Pack', sales: 612, revenue: 3060 },
    { name: 'Portable Power Bank', sales: 287, revenue: 10045 },
  ];

  const customerMetrics = [
    { label: 'New Customers', value: 342, change: 12 },
    { label: 'Repeat Customers', value: 1847, change: 8 },
    { label: 'Avg. LTV', value: '$342.50', change: 15 },
    { label: 'Churn Rate', value: '2.3%', change: -1 },
  ];

  const trafficMetrics = [
    { label: 'Page Views', value: '45,234', change: 22 },
    { label: 'Unique Visitors', value: '28,145', change: 18 },
    { label: 'Bounce Rate', value: '32.4%', change: -3 },
    { label: 'Avg. Session', value: '4m 32s', change: 5 },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: '$15,430',
      change: 23,
      icon: <DollarSign size={24} className="text-green-600" />,
    },
    {
      label: 'Total Orders',
      value: '342',
      change: 18,
      icon: <ShoppingCart size={24} className="text-blue-600" />,
    },
    {
      label: 'Active Customers',
      value: '2,189',
      change: 12,
      icon: <Users size={24} className="text-purple-600" />,
    },
    {
      label: 'Conversion Rate',
      value: '14.2%',
      change: 5,
      icon: <TrendingUp size={24} className="text-orange-600" />,
    },
  ];

  const getMaxValue = (data: ChartDataPoint[]) => Math.max(...data.map((d) => d.value));
  const maxDailyRevenue = getMaxValue(dailyRevenue);
  const maxCategoryRevenue = getMaxValue(categoryRevenue);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Real-time sales, traffic, and customer insights</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 bg-white outline-none"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="1year">Last Year</option>
            </select>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
              <Download size={20} /> Export
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-600 font-semibold">{stat.label}</p>
                {stat.icon}
              </div>
              <p className="text-3xl font-black text-gray-900 mb-2">{stat.value}</p>
              <p className={`text-sm font-bold ${stat.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}% vs last period
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row 1: Daily Revenue & Category Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Daily Revenue Chart */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 size={20} className="text-blue-600" />
              Daily Revenue
            </h3>
            <div className="space-y-4">
              {dailyRevenue.map((day, idx) => {
                const barHeight = (day.value / maxDailyRevenue) * 100;
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-gray-700">{day.label}</p>
                      <p className="text-sm font-bold text-gray-900">${day.value.toLocaleString()}</p>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${barHeight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Revenue Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Revenue by Category</h3>
            <div className="space-y-3">
              {categoryRevenue.map((category, idx) => {
                const barHeight = (category.value / maxCategoryRevenue) * 100;
                const colors = ['bg-purple-500', 'bg-blue-500', 'bg-teal-500', 'bg-orange-500', 'bg-pink-500'];
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-700">{category.label}</p>
                      <p className="text-sm font-bold text-gray-900">${category.value.toLocaleString()}</p>
                    </div>
                    <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[idx]} transition-all duration-500`}
                        style={{ width: `${barHeight}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <div className="pt-2 border-t border-gray-200 mt-3">
                <p className="text-sm text-gray-600">
                  Total: <span className="font-bold text-gray-900">${categoryRevenue.reduce((sum, c) => sum + c.value, 0).toLocaleString()}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2: Conversion Funnel & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="space-y-3">
              {conversionFunnel.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold text-gray-700">{stage.stage}</p>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{stage.count.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">{stage.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Top Products</h3>
            <div className="space-y-2">
              {topProducts.map((product, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} sales</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">${product.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer & Traffic Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Metrics */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-purple-600" />
              Customer Metrics
            </h3>
            <div className="space-y-4">
              {customerMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                    <p
                      className={`text-xs font-bold ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Metrics */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-orange-600" />
              Traffic Metrics
            </h3>
            <div className="space-y-4">
              {trafficMetrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">{metric.label}</p>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                    <p
                      className={`text-xs font-bold ${
                        metric.change >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <h4 className="font-bold text-green-900 mb-2">💰 Revenue Insight</h4>
            <p className="text-sm text-green-800">
              Revenue is up 23% this week. Friday&apos;s peak suggests weekend shopping trend.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 p-6">
            <h4 className="font-bold text-blue-900 mb-2">📊 Conversion Insight</h4>
            <p className="text-sm text-blue-800">
              Conversion rate improved to 14.2%. Cart abandonment remains at 29%.
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
            <h4 className="font-bold text-orange-900 mb-2">👥 Customer Insight</h4>
            <p className="text-sm text-orange-800">
              12% increase in new customers. Repeat customer rate at 84%.
            </p>
          </div>
        </div>

        {/* Export Section */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Generate Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { title: 'Daily Sales Report', format: 'PDF' },
              { title: 'Monthly Analytics', format: 'CSV' },
              { title: 'Customer Report', format: 'Excel' },
              { title: 'Traffic Analysis', format: 'PDF' },
            ].map((report, idx) => (
              <button
                key={idx}
                className="p-4 bg-white border border-gray-300 rounded-lg hover:border-gray-400 hover:shadow-sm transition text-left"
              >
                <p className="font-semibold text-gray-900 text-sm">{report.title}</p>
                <p className="text-xs text-gray-600 mt-1">📥 {report.format}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
