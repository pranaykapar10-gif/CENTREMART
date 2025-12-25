'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, MoreVertical, Eye, Mail, Phone } from 'lucide-react';
import { useState } from 'react';

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock customers data
  const allCustomers = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567',
      joinDate: '2023-06-15',
      orders: 12,
      totalSpent: 1524.99,
      status: 'Active',
      avatar: '👨',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+1 (555) 234-5678',
      joinDate: '2023-08-22',
      orders: 8,
      totalSpent: 745.5,
      status: 'Active',
      avatar: '👩',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+1 (555) 345-6789',
      joinDate: '2023-09-10',
      orders: 15,
      totalSpent: 2156.0,
      status: 'Active',
      avatar: '👨',
    },
    {
      id: 4,
      name: 'Alice Williams',
      email: 'alice@example.com',
      phone: '+1 (555) 456-7890',
      joinDate: '2024-01-05',
      orders: 2,
      totalSpent: 145.99,
      status: 'Active',
      avatar: '👩',
    },
    {
      id: 5,
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      phone: '+1 (555) 567-8901',
      joinDate: '2023-07-14',
      orders: 6,
      totalSpent: 834.75,
      status: 'Inactive',
      avatar: '👨',
    },
    {
      id: 6,
      name: 'Diana Prince',
      email: 'diana@example.com',
      phone: '+1 (555) 678-9012',
      joinDate: '2023-05-20',
      orders: 21,
      totalSpent: 3245.5,
      status: 'Active',
      avatar: '👩',
    },
    {
      id: 7,
      name: 'Eve Johnson',
      email: 'eve@example.com',
      phone: '+1 (555) 789-0123',
      joinDate: '2023-10-03',
      orders: 4,
      totalSpent: 456.25,
      status: 'Active',
      avatar: '👩',
    },
    {
      id: 8,
      name: 'Frank Miller',
      email: 'frank@example.com',
      phone: '+1 (555) 890-1234',
      joinDate: '2023-11-28',
      orders: 9,
      totalSpent: 987.6,
      status: 'Active',
      avatar: '👨',
    },
    {
      id: 9,
      name: 'Grace Lee',
      email: 'grace@example.com',
      phone: '+1 (555) 901-2345',
      joinDate: '2024-01-02',
      orders: 1,
      totalSpent: 89.99,
      status: 'Active',
      avatar: '👩',
    },
    {
      id: 10,
      name: 'Henry Davis',
      email: 'henry@example.com',
      phone: '+1 (555) 012-3456',
      joinDate: '2023-04-18',
      orders: 34,
      totalSpent: 4892.15,
      status: 'Active',
      avatar: '👨',
    },
  ];

  // Filter customers
  const filteredCustomers = allCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  // Sort customers
  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
    } else if (sortBy === 'oldest') {
      return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
    } else if (sortBy === 'spent-high') {
      return b.totalSpent - a.totalSpent;
    } else if (sortBy === 'spent-low') {
      return a.totalSpent - b.totalSpent;
    } else if (sortBy === 'orders') {
      return b.orders - a.orders;
    }
    return 0;
  });

  // Calculate summary stats
  const totalCustomers = allCustomers.length;
  const activeCustomers = allCustomers.filter((c) => c.status === 'Active').length;
  const totalRevenue = allCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const avgOrderValue = totalRevenue / allCustomers.reduce((sum, c) => sum + c.orders, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Customers</h1>
            <p className="text-gray-600 mt-1">Manage and view customer profiles</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
            + Export
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Customers</p>
            <p className="text-3xl font-black text-gray-900">{totalCustomers}</p>
            <p className="text-xs text-green-600 font-bold mt-2">+5 this month</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Active Customers</p>
            <p className="text-3xl font-black text-gray-900">{activeCustomers}</p>
            <p className="text-xs text-blue-600 font-bold mt-2">{Math.round((activeCustomers / totalCustomers) * 100)}% of total</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Revenue</p>
            <p className="text-3xl font-black text-gray-900">${(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="text-xs text-green-600 font-bold mt-2">Lifetime value</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Avg Order Value</p>
            <p className="text-3xl font-black text-gray-900">${avgOrderValue.toFixed(0)}</p>
            <p className="text-xs text-purple-600 font-bold mt-2">Per transaction</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{sortedCustomers.length}</span> of{' '}
              <span className="font-bold">{totalCustomers}</span> customers
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold text-gray-900 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="spent-high">Highest Spending</option>
              <option value="spent-low">Lowest Spending</option>
              <option value="orders">Most Orders</option>
            </select>
          </div>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Joined</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Orders</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCustomers.length > 0 ? (
                sortedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{customer.avatar}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{customer.name}</p>
                          <p className="text-xs text-gray-500">ID: {customer.id.toString().padStart(4, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <a href={`mailto:${customer.email}`} className="text-sm text-blue-600 hover:underline">
                            {customer.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone size={16} className="text-gray-400" />
                          <a href={`tel:${customer.phone}`} className="text-sm text-gray-600">
                            {customer.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {new Date(customer.joinDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                        {customer.orders}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">${customer.totalSpent.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          customer.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {customer.status}
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
                              View Profile
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              View Orders
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              Send Email
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 border-t border-gray-200">
                              Block Customer
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-600 font-semibold">No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {sortedCustomers.length > 0 && (
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
