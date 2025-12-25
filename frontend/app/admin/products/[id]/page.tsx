'use client';

import AdminLayout from '@/components/AdminLayout';
import { Save, Upload, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminProductDetail() {
  const [formData, setFormData] = useState({
    name: 'Wireless Headphones Pro',
    sku: 'WHP-001',
    category: 'Electronics',
    price: 129.99,
    costPrice: 65.0,
    stock: 45,
    status: 'Active',
    description: 'Premium wireless headphones with noise cancellation and 40-hour battery life.',
    shortDescription: 'High-quality wireless headphones with ANC',
    images: ['🎧'],
    specifications: [
      { key: 'Battery Life', value: '40 hours' },
      { key: 'Weight', value: '250g' },
      { key: 'Driver Size', value: '40mm' },
    ],
    tags: ['headphones', 'wireless', 'audio'],
    seoTitle: 'Premium Wireless Headphones Pro',
    seoDescription: 'Buy premium wireless headphones with noise cancellation',
  });

  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showSpecForm, setShowSpecForm] = useState(false);
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddSpec = () => {
    if (newSpec.key && newSpec.value) {
      setFormData({
        ...formData,
        specifications: [...formData.specifications, { ...newSpec }],
      });
      setNewSpec({ key: '', value: '' });
      setShowSpecForm(false);
    }
  };

  const handleRemoveSpec = (index: number) => {
    setFormData({
      ...formData,
      specifications: formData.specifications.filter((_, i) => i !== index),
    });
  };

  const profit = formData.price - formData.costPrice;
  const profitMargin = ((profit / formData.price) * 100).toFixed(1);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Edit Product</h1>
            <p className="text-gray-600 mt-1">Manage product details and inventory</p>
          </div>
          <button
            onClick={handleSave}
            className={`font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 ${
              saved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save size={20} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Cases">Cases</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  rows={4}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Pricing</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Regular Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Profit</p>
                    <p className="text-2xl font-bold text-green-600">${profit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Profit Margin</p>
                    <p className="text-2xl font-bold text-green-600">{profitMargin}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Inventory</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Specifications</h2>
                <button
                  onClick={() => setShowSpecForm(!showSpecForm)}
                  className="text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  <Plus size={18} />
                </button>
              </div>

              {showSpecForm && (
                <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Key (e.g., Battery Life)"
                    value={newSpec.key}
                    onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g., 40 hours)"
                    value={newSpec.value}
                    onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded outline-none focus:border-blue-500 text-sm"
                  />
                  <button
                    onClick={handleAddSpec}
                    className="px-3 py-2 bg-blue-600 text-white rounded font-bold text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {formData.specifications.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{spec.key}</p>
                      <p className="text-sm text-gray-600">{spec.value}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1 hover:bg-red-100 rounded transition"
                    >
                      <Trash2 size={18} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* SEO */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">SEO Settings</h2>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  maxLength={60}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seoTitle.length}/60</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  maxLength={160}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                  rows={2}
                />
                <p className="text-xs text-gray-500 mt-1">{formData.seoDescription.length}/160</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Product Images</h2>

              <div className="space-y-3">
                {formData.images.map((image, idx) => (
                  <div key={idx} className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-5xl">
                      {image}
                    </div>
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowImageUpload(!showImageUpload)}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-bold text-gray-600 hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center gap-2"
              >
                <Upload size={18} /> Add Image
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Tags</h2>

              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((_, i) => i !== idx),
                      })
                    }
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold hover:bg-blue-200 transition flex items-center gap-2"
                  >
                    {tag} <X size={14} />
                  </button>
                ))}
              </div>

              <input
                type="text"
                placeholder="Add tag..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                    setFormData({
                      ...formData,
                      tags: [...formData.tags, (e.target as HTMLInputElement).value],
                    });
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Status</h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <p className="font-semibold text-gray-900">Current Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      formData.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : formData.status === 'Draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {formData.status}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">In Stock</p>
                    <p className="text-sm text-gray-600">{formData.stock} units</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      formData.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {formData.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
