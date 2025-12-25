'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, Trash2, Edit, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  status: string;
  category_id: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
  discount_price?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateProductForm {
  name: string;
  description: string;
  short_description: string;
  price: string;
  cost_price: string;
  discount_price: string;
  category_id: string;
  stock_quantity: string;
  image_url: string;
  sku: string;
  brand: string;
  discount_percentage: string;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateProductForm>({
    name: '',
    description: '',
    short_description: '',
    price: '',
    cost_price: '',
    discount_price: '',
    category_id: '',
    stock_quantity: '',
    image_url: '',
    sku: '',
    brand: '',
    discount_percentage: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/products', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!formData.name || !formData.sku || !formData.price || !formData.category_id) {
      alert('Please fill all required fields');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Not authenticated');
        return;
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          short_description: formData.short_description,
          price: parseFloat(formData.price),
          cost_price: formData.cost_price ? parseFloat(formData.cost_price) : null,
          discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
          category_id: parseInt(formData.category_id),
          stock_quantity: parseInt(formData.stock_quantity) || 0,
          image_url: formData.image_url,
          sku: formData.sku,
          brand: formData.brand,
          discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await res.json();
      setProducts([newProduct, ...products]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        short_description: '',
        price: '',
        cost_price: '',
        discount_price: '',
        category_id: '',
        stock_quantity: '',
        image_url: '',
        sku: '',
        brand: '',
        discount_percentage: '',
      });
      alert('Product created successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error creating product');
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    setDeleting(productId);
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('Not authenticated');
        setDeleting(null);
        return;
      }

      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((p) => p.id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting product');
    } finally {
      setDeleting(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'text-red-600', label: 'Out of Stock' };
    if (stock < 10) return { color: 'text-yellow-600', label: 'Low Stock' };
    return { color: 'text-green-600', label: 'In Stock' };
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage your product catalog</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={20} /> Add Product
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-600">Loading products...</div>
          ) : filteredProducts.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">SKU</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const stockStatus = getStockStatus(product.stock_quantity);
                  return (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.category_id}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{product.sku}</td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-gray-900">${product.price.toFixed(2)}</p>
                        {product.discount_price && (
                          <p className="text-xs text-green-600">
                            Sale: ${product.discount_price.toFixed(2)}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className={`font-bold ${stockStatus.color}`}>{product.stock_quantity}</p>
                        <p className="text-xs text-gray-500">{stockStatus.label}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/products/${product.id}`}>
                            <button className="p-1 hover:bg-gray-200 rounded transition" title="Edit">
                              <Edit size={18} className="text-gray-600" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={deleting === product.id}
                            className="p-1 hover:bg-red-100 rounded transition disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 font-semibold">No products found</p>
            </div>
          )}
        </div>

        {/* Create Product Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Add New Product</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="e.g., Wireless Headphones"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="e.g., WH-001"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                    placeholder="Product description..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Category ID *
                    </label>
                    <input
                      type="number"
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                      placeholder="Brand name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 outline-none"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleCreateProduct}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Create Product
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
