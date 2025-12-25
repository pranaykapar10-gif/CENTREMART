'use client';

import AdminLayout from '@/components/AdminLayout';
import { TrendingUp, ShoppingCart, Users, DollarSign, RefreshCw, Database } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [snapshotVersion, setSnapshotVersion] = useState<number | null>(null);
  const [healthData, setHealthData] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('/api/admin/build-snapshot', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert('Sync successful!');
        // Refresh manifest
        const mres = await fetch('/api/data/manifest.json');
        const mdata = await mres.json();
        setSnapshotVersion(mdata.currentVersion);
      } else {
        alert(`Sync failed: ${data.error}`);
      }
    } catch (e) {
      alert('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Fetch manifest
    fetch('/api/data/manifest.json')
      .then(res => res.json())
      .then(data => setSnapshotVersion(data.currentVersion))
      .catch(() => setSnapshotVersion(null));

    // Fetch backend health
    fetch('/health')
      .then(res => res.json())
      .then(data => setHealthData(data))
      .catch(() => setHealthData(null));
  }, []);

  // Mock KPI data
  const kpis = [
    {
      label: 'Total Revenue',
      value: '$24,580',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Total Orders',
      value: '1,284',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Customers',
      value: '892',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Avg Order Value',
      value: '$89.50',
      change: '+3.2%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  // Mock chart data
  const revenueData = [
    { day: 'Mon', revenue: 2400 },
    { day: 'Tue', revenue: 1398 },
    { day: 'Wed', revenue: 9800 },
    { day: 'Thu', revenue: 3908 },
    { day: 'Fri', revenue: 4800 },
    { day: 'Sat', revenue: 3800 },
    { day: 'Sun', revenue: 4300 },
  ];

  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue));

  // Mock top products
  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 145, revenue: '$8,700' },
    { id: 2, name: 'USB-C Cable', sales: 234, revenue: '$3,510' },
    { id: 3, name: 'Phone Case', sales: 189, revenue: '$4,731' },
    { id: 4, name: 'Screen Protector', sales: 267, revenue: '$2,140' },
    { id: 5, name: 'Power Bank', sales: 112, revenue: '$5,040' },
  ];

  // Mock recent orders
  const recentOrders = [
    { id: 'ORD-001', customer: 'John Doe', total: '$124.99', status: 'Delivered' },
    { id: 'ORD-002', customer: 'Jane Smith', total: '$89.50', status: 'Processing' },
    { id: 'ORD-003', customer: 'Bob Johnson', total: '$256.00', status: 'Shipped' },
    { id: 'ORD-004', customer: 'Alice Williams', total: '$45.99', status: 'Pending' },
    { id: 'ORD-005', customer: 'Charlie Brown', total: '$199.99', status: 'Delivered' },
  ];

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
          </div>
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm">
            <Database className="w-4 h-4 text-blue-600" />
            <div className="text-sm">
              <span className="text-gray-500">Snapshot Version: </span>
              <span className="font-mono font-bold">
                {snapshotVersion ? new Date(snapshotVersion).toLocaleTimeString() : 'Loading...'}
              </span>
            </div>
            <div className="text-xs text-gray-400 ml-2 border-l pl-2">
              Updates every 5m
            </div>
          </div>
        </div>

        {/* Sync Button */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last Snapshot</p>
              <p className="font-mono text-xs font-bold text-blue-600">
                {snapshotVersion ? new Date(snapshotVersion).toLocaleString() : 'Loading...'}
              </p>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, idx) => {
            const Icon = kpi.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold mb-1">{kpi.label}</p>
                    <p className="text-3xl font-black text-gray-900">{kpi.value}</p>
                    <p className="text-xs text-green-600 font-bold mt-2">{kpi.change} from last month</p>
                  </div>
                  <div className={`${kpi.bgColor} p-3 rounded-lg`}>
                    <Icon size={24} className={kpi.iconColor} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Revenue Trend</h2>
            <div className="flex items-end justify-around h-64 gap-2">
              {revenueData.map((data) => {
                const height = (data.revenue / maxRevenue) * 100;
                return (
                  <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-blue-400 to-blue-600 rounded-t-lg transition hover:opacity-80 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: '20px' }}
                    />
                    <p className="text-xs font-semibold text-gray-600">{data.day}</p>
                    <p className="text-xs text-gray-500">${(data.revenue / 1000).toFixed(1)}k</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Status Pie */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Order Status</h2>
            <div className="space-y-4">
              {[
                { label: 'Delivered', count: 456, color: 'bg-green-500' },
                { label: 'Processing', count: 123, color: 'bg-yellow-500' },
                { label: 'Shipped', count: 234, color: 'bg-blue-500' },
                { label: 'Pending', count: 89, color: 'bg-gray-500' },
              ].map((status) => (
                <div key={status.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${status.color}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{status.label}</p>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${status.color}`}
                        style={{
                          width: `${(status.count / 902) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">{status.count}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Top Products</h2>
            <div className="space-y-4">
              {topProducts.map((product, idx) => (
                <div key={product.id} className="flex items-center justify-between pb-4 last:pb-0 last:border-b-0 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-sm text-gray-600">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-xs text-gray-600">{product.sales} sales</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Orders</h2>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-semibold text-gray-900">{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="font-bold text-gray-900 w-20 text-right">{order.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
