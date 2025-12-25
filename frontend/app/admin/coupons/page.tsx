'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, MoreVertical, Plus, Copy, ToggleRight, ToggleLeft } from 'lucide-react';
import { useState } from 'react';

export default function AdminCoupons() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    maxUses: '',
    expiryDate: '',
  });

  // Mock coupons data
  const [coupons, setCoupons] = useState([
    {
      id: 1,
      code: 'SAVE20',
      type: 'percentage',
      value: 20,
      maxUses: 100,
      timesUsed: 45,
      expiryDate: '2024-12-31',
      status: 'Active',
      minOrder: 50,
      description: 'Save 20% on all orders',
    },
    {
      id: 2,
      code: 'WELCOME10',
      type: 'fixed',
      value: 10,
      maxUses: 500,
      timesUsed: 234,
      expiryDate: '2024-12-31',
      status: 'Active',
      minOrder: 0,
      description: '$10 off for new customers',
    },
    {
      id: 3,
      code: 'SUMMER30',
      type: 'percentage',
      value: 30,
      maxUses: 50,
      timesUsed: 50,
      expiryDate: '2024-08-31',
      status: 'Expired',
      minOrder: 100,
      description: 'Summer sale - 30% off',
    },
    {
      id: 4,
      code: 'FREESHIP',
      type: 'fixed',
      value: 15,
      maxUses: 1000,
      timesUsed: 512,
      expiryDate: '2024-12-31',
      status: 'Active',
      minOrder: 30,
      description: 'Free shipping coupon',
    },
    {
      id: 5,
      code: 'BULK15',
      type: 'percentage',
      value: 15,
      maxUses: 200,
      timesUsed: 89,
      expiryDate: '2025-06-30',
      status: 'Active',
      minOrder: 250,
      description: 'Bulk order discount',
    },
  ]);

  const filteredCoupons = coupons.filter((coupon) =>
    coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCoupon = () => {
    if (formData.code.trim() && formData.value) {
      const newCoupon = {
        id: Math.max(...coupons.map((c) => c.id), 0) + 1,
        code: formData.code.toUpperCase(),
        type: formData.type as 'percentage' | 'fixed',
        value: parseInt(formData.value),
        maxUses: parseInt(formData.maxUses) || 0,
        timesUsed: 0,
        expiryDate: formData.expiryDate,
        status: 'Active',
        minOrder: 0,
        description: `${formData.type === 'percentage' ? formData.value + '%' : '$' + formData.value} off coupon`,
      };
      setCoupons([...coupons, newCoupon]);
      setFormData({ code: '', type: 'percentage', value: '', maxUses: '', expiryDate: '' });
      setShowModal(false);
    }
  };

  const handleToggleStatus = (id: number) => {
    setCoupons(
      coupons.map((coupon) =>
        coupon.id === id
          ? {
              ...coupon,
              status: coupon.status === 'Active' ? 'Inactive' : 'Active',
            }
          : coupon
      )
    );
  };

  const handleDeleteCoupon = (id: number) => {
    setCoupons(coupons.filter((coupon) => coupon.id !== id));
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Coupons</h1>
            <p className="text-gray-600 mt-1">Create and manage promotional coupons</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={20} /> Create Coupon
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by code or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Coupons List */}
        <div className="space-y-4">
          {filteredCoupons.length > 0 ? (
            filteredCoupons.map((coupon) => (
              <div key={coupon.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {coupon.code}
                      <span className="ml-2 text-sm px-2 py-1 bg-gray-100 text-gray-800 rounded">
                        {coupon.type === 'percentage' ? `${coupon.value}%` : `$${coupon.value}`}
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600">{coupon.description}</p>
                  </div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-200 rounded transition">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                      <button
                        onClick={() => handleCopyCode(coupon.code)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900"
                      >
                        <Copy size={16} /> Copy Code
                      </button>
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCoupon(coupon.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 border-t border-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 py-4 border-t border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Min Order</p>
                    <p className="text-lg font-bold text-gray-900">${coupon.minOrder}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Uses</p>
                    <p className="text-lg font-bold text-gray-900">
                      {coupon.timesUsed}/{coupon.maxUses || '∞'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Expires</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Usage Rate</p>
                    <p className="text-lg font-bold text-gray-900">
                      {coupon.maxUses > 0 ? Math.round((coupon.timesUsed / coupon.maxUses) * 100) : 0}%
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      coupon.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : coupon.status === 'Expired'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {coupon.status}
                  </span>
                  <button
                    onClick={() => handleToggleStatus(coupon.id)}
                    className="text-gray-600 hover:text-blue-600 transition"
                  >
                    {coupon.status === 'Active' ? (
                      <ToggleRight size={24} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={24} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-600 font-semibold">No coupons found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Coupon</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Coupon Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="e.g., SAVE20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      {formData.type === 'percentage' ? 'Percentage' : 'Amount'}
                    </label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                      placeholder={formData.type === 'percentage' ? '20' : '10'}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Max Uses (0 for unlimited)</label>
                  <input
                    type="number"
                    value={formData.maxUses}
                    onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ code: '', type: 'percentage', value: '', maxUses: '', expiryDate: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCoupon}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
