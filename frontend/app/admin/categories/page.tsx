'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, MoreVertical, Plus } from 'lucide-react';
import { useState } from 'react';

export default function AdminCategories() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '', icon: '📦' });

  // Mock categories data
  const [categories, setCategories] = useState([
    {
      id: 1,
      name: 'Electronics',
      slug: 'electronics',
      icon: '📱',
      description: 'Phones, tablets, and electronic gadgets',
      products: 24,
      status: 'Active',
    },
    {
      id: 2,
      name: 'Accessories',
      slug: 'accessories',
      icon: '🎧',
      description: 'Phone cases, chargers, and more',
      products: 45,
      status: 'Active',
    },
    {
      id: 3,
      name: 'Cables & Chargers',
      slug: 'cables-chargers',
      icon: '🔌',
      description: 'USB cables, power adapters, and charging solutions',
      products: 18,
      status: 'Active',
    },
    {
      id: 4,
      name: 'Screen Protectors',
      slug: 'screen-protectors',
      icon: '🛡️',
      description: 'Tempered glass and screen protection',
      products: 12,
      status: 'Active',
    },
    {
      id: 5,
      name: 'Power Banks',
      slug: 'power-banks',
      icon: '🔋',
      description: 'Portable charging solutions',
      products: 8,
      status: 'Active',
    },
    {
      id: 6,
      name: 'Stands & Holders',
      slug: 'stands-holders',
      icon: '📐',
      description: 'Phone and tablet stands',
      products: 6,
      status: 'Inactive',
    },
  ]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        icon: formData.icon,
        description: formData.description,
        products: 0,
        status: 'Active',
      };
      setCategories([...categories, newCategory]);
      setFormData({ name: '', slug: '', description: '', icon: '📦' });
      setShowModal(false);
    }
  };

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const handleToggleStatus = (id: number) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id
          ? {
              ...cat,
              status: cat.status === 'Active' ? 'Inactive' : 'Active',
            }
          : cat
      )
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-1">Manage product categories and organization</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2"
          >
            <Plus size={20} /> Add Category
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl">{category.icon}</div>
                  <div className="relative group">
                    <button className="p-1 hover:bg-gray-200 rounded transition">
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>
                    <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                      <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                        Edit
                      </button>
                      <button
                        onClick={() => handleToggleStatus(category.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900"
                      >
                        {category.status === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 border-t border-gray-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-xs text-gray-500 mb-3">/{category.slug}</p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{category.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Products</p>
                    <p className="text-lg font-bold text-gray-900">{category.products}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      category.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {category.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 font-semibold">No categories found</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Category</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Icon</label>
                  <input
                    type="text"
                    maxLength={2}
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-2xl text-center outline-none focus:border-blue-500"
                    placeholder="📦"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    placeholder="e.g., Electronics"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                    placeholder="Category description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ name: '', slug: '', description: '', icon: '📦' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-bold text-gray-900 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCategory}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Add Category
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
