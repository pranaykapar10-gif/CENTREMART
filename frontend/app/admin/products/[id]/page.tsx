'use client';

import AdminLayout from '@/components/AdminLayout';
import { ArrowLeft, Save, Upload, Package, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminProductEdit() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<{id: number, name: string}[]>([]);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    stock_quantity: 0,
    category_id: '',
    status: 'active',
    image_url: '',
    sku: '',
  });

  useEffect(() => {
    fetchCategories();
    if (productId !== 'new') {
      fetchProduct();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/products/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      if (!res.ok) throw new Error('Failed to fetch product');
      const data = await res.json();
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || 0,
        stock_quantity: data.stock_quantity || 0,
        category_id: data.category_id || '',
        status: data.status || 'active',
        image_url: data.image_url || '',
        sku: data.sku || '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching product');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('accessToken');
      const method = productId === 'new' ? 'POST' : 'PUT';
      const url = productId === 'new' ? '/api/products' : `/api/products/${productId}`;

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save product');
      }

      alert('Product saved successfully');
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><div className="py-12 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900">
                {productId === 'new' ? 'Add New Product' : `Edit Product: ${formData.name}`}
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200 disabled:opacity-50"
            >
              <Save size={20} /> {saving ? 'Saving...' : 'Save Product'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder="e.g. Wireless Headphones Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder="Describe your product..."
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Pricing & Inventory</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      required
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                  placeholder="e.g. WHP-001"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Organization</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition bg-white"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Product Image</h2>
              <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-4 text-center">
                {formData.image_url ? (
                  <img src={formData.image_url} alt="Preview" className="w-full h-full object-contain" />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <p className="text-sm text-gray-500">Enter image URL below</p>
                  </>
                )}
              </div>
              <input
                type="text"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
