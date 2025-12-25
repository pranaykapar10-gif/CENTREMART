'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, MoreVertical, Copy, Star } from 'lucide-react';
import { useState } from 'react';

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Mock products data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      sku: 'WHP-001',
      category: 'Electronics',
      price: 129.99,
      stock: 45,
      status: 'Active',
      rating: 4.8,
      sales: 234,
      image: '🎧',
    },
    {
      id: 2,
      name: 'USB-C Fast Charger',
      sku: 'UFC-002',
      category: 'Accessories',
      price: 49.99,
      stock: 156,
      status: 'Active',
      rating: 4.5,
      sales: 456,
      image: '🔌',
    },
    {
      id: 3,
      name: 'Premium Phone Case',
      sku: 'PPC-003',
      category: 'Cases',
      price: 24.99,
      stock: 8,
      status: 'Low Stock',
      rating: 4.3,
      sales: 189,
      image: '📱',
    },
    {
      id: 4,
      name: 'Screen Protector Pack',
      sku: 'SPP-004',
      category: 'Accessories',
      price: 14.99,
      stock: 0,
      status: 'Out of Stock',
      rating: 4.1,
      sales: 267,
      image: '🛡️',
    },
    {
      id: 5,
      name: 'Portable Power Bank',
      sku: 'PPB-005',
      category: 'Electronics',
      price: 79.99,
      stock: 67,
      status: 'Active',
      rating: 4.6,
      sales: 112,
      image: '🔋',
    },
    {
      id: 6,
      name: 'Desk Phone Stand',
      sku: 'DPS-006',
      category: 'Accessories',
      price: 19.99,
      stock: 203,
      status: 'Active',
      rating: 4.2,
      sales: 98,
      image: '📐',
    },
    {
      id: 7,
      name: 'Wireless Mouse',
      sku: 'WM-007',
      category: 'Electronics',
      price: 39.99,
      stock: 34,
      status: 'Active',
      rating: 4.4,
      sales: 145,
      image: '🖱️',
    },
    {
      id: 8,
      name: 'Laptop Cooling Pad',
      sku: 'LCP-008',
      category: 'Electronics',
      price: 44.99,
      stock: 12,
      status: 'Low Stock',
      rating: 4.7,
      sales: 67,
      image: '❄️',
    },
  ];

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (id: number) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = () => {
    if (selectedProducts.size === filteredProducts.length) {
      setSelectedProducts(new Set());
      setShowBulkActions(false);
    } else {
      setSelectedProducts(new Set(filteredProducts.map((p) => p.id)));
      setShowBulkActions(true);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Low Stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'Out of Stock':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition">
            + Add Product
          </button>
        </div>

        {/* Bulk Actions Bar */}
        {showBulkActions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-blue-900">
              {selectedProducts.size} product{selectedProducts.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-2">
              <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-1 px-3 rounded transition">
                Duplicate
              </button>
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded transition">
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.size === filteredProducts.length && filteredProducts.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Price</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Rating</th>
                <th className="px-6 py-4 text-right text-sm font-bold text-gray-700">Sales</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{product.image}</span>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">${product.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-bold ${product.stock > 20 ? 'bg-green-100 text-green-800' : product.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(product.status)}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">{product.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">{product.sales}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 hover:bg-gray-200 rounded transition" title="Duplicate">
                          <Copy size={18} className="text-gray-600" />
                        </button>
                        <div className="relative group">
                          <button className="p-1 hover:bg-gray-200 rounded transition">
                            <MoreVertical size={18} className="text-gray-600" />
                          </button>
                          <div className="hidden group-hover:block absolute right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              Edit
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-semibold text-gray-900">
                              View Details
                            </button>
                            <button className="block w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-semibold text-red-600 border-t border-gray-200">
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <p className="text-gray-600 font-semibold">No products found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredProducts.length}</span> of{' '}
              <span className="font-bold">{products.length}</span> products
            </p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Previous
              </button>
              <button className="px-3 py-1 bg-gray-200 rounded-lg text-sm font-semibold text-gray-900">1</button>
              <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
