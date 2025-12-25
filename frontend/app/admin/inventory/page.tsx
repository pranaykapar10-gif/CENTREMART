'use client';

import AdminLayout from '@/components/AdminLayout';
import { Search, AlertCircle, TrendingDown, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface InventoryItem {
  id: number;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  reorderQty: number;
  unitCost: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'overstock';
  lastRestock: string;
  supplier: string;
}

export default function AdminInventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('status');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock inventory data
  const inventory: InventoryItem[] = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      sku: 'WHP-001',
      category: 'Electronics',
      currentStock: 45,
      minStock: 20,
      maxStock: 100,
      reorderQty: 50,
      unitCost: 65.0,
      status: 'in-stock',
      lastRestock: '2024-01-10',
      supplier: 'TechSupplies Inc',
    },
    {
      id: 2,
      name: 'USB-C Fast Charger',
      sku: 'UFC-002',
      category: 'Accessories',
      currentStock: 12,
      minStock: 30,
      maxStock: 150,
      reorderQty: 100,
      unitCost: 20.0,
      status: 'low-stock',
      lastRestock: '2023-12-28',
      supplier: 'Global Tech',
    },
    {
      id: 3,
      name: 'Premium Phone Case',
      sku: 'PPC-003',
      category: 'Cases',
      currentStock: 0,
      minStock: 25,
      maxStock: 80,
      reorderQty: 50,
      unitCost: 8.5,
      status: 'out-of-stock',
      lastRestock: '2023-12-15',
      supplier: 'CaseWorld',
    },
    {
      id: 4,
      name: 'Screen Protector Pack',
      sku: 'SPP-004',
      category: 'Protection',
      currentStock: 245,
      minStock: 50,
      maxStock: 200,
      reorderQty: 100,
      unitCost: 5.0,
      status: 'overstock',
      lastRestock: '2024-01-08',
      supplier: 'Protection Plus',
    },
    {
      id: 5,
      name: 'Portable Power Bank',
      sku: 'PPB-005',
      category: 'Power',
      currentStock: 67,
      minStock: 30,
      maxStock: 120,
      reorderQty: 60,
      unitCost: 35.0,
      status: 'in-stock',
      lastRestock: '2024-01-05',
      supplier: 'Energy Solutions',
    },
    {
      id: 6,
      name: 'Desk Phone Stand',
      sku: 'DPS-006',
      category: 'Accessories',
      currentStock: 8,
      minStock: 15,
      maxStock: 60,
      reorderQty: 40,
      unitCost: 7.5,
      status: 'low-stock',
      lastRestock: '2023-11-20',
      supplier: 'Stand Experts',
    },
  ];

  const filteredInventory = inventory
    .filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'status') {
        const statusOrder = { 'out-of-stock': 0, 'low-stock': 1, overstock: 2, 'in-stock': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      } else if (sortBy === 'stock-low') {
        return a.currentStock - b.currentStock;
      } else if (sortBy === 'stock-high') {
        return b.currentStock - a.currentStock;
      }
      return 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'overstock':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'out-of-stock':
        return '⚠️';
      case 'low-stock':
        return '⚡';
      case 'overstock':
        return '📦';
      default:
        return '✅';
    }
  };

  const stats = {
    totalItems: inventory.length,
    inStock: inventory.filter((i) => i.status === 'in-stock').length,
    lowStock: inventory.filter((i) => i.status === 'low-stock').length,
    outOfStock: inventory.filter((i) => i.status === 'out-of-stock').length,
    overstock: inventory.filter((i) => i.status === 'overstock').length,
  };

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.currentStock * item.unitCost, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">Real-time stock tracking and reorder management</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition flex items-center gap-2">
            <Plus size={20} /> Add Item
          </button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Items</p>
            <p className="text-3xl font-black text-gray-900">{stats.totalItems}</p>
          </div>

          <div className="bg-green-50 rounded-2xl border border-green-200 p-6 shadow-sm">
            <p className="text-sm text-green-700 font-semibold mb-1">In Stock</p>
            <p className="text-3xl font-black text-green-600">{stats.inStock}</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 shadow-sm">
            <p className="text-sm text-yellow-700 font-semibold mb-1">Low Stock</p>
            <p className="text-3xl font-black text-yellow-600">{stats.lowStock}</p>
          </div>

          <div className="bg-red-50 rounded-2xl border border-red-200 p-6 shadow-sm">
            <p className="text-sm text-red-700 font-semibold mb-1">Out of Stock</p>
            <p className="text-3xl font-black text-red-600">{stats.outOfStock}</p>
          </div>

          <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6 shadow-sm">
            <p className="text-sm text-blue-700 font-semibold mb-1">Inventory Value</p>
            <p className="text-2xl font-black text-blue-600">${(totalInventoryValue / 1000).toFixed(1)}k</p>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm space-y-4">
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

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: 'All Items', value: 'all' },
              { label: 'In Stock', value: 'in-stock' },
              { label: 'Low Stock', value: 'low-stock' },
              { label: 'Out of Stock', value: 'out-of-stock' },
              { label: 'Overstock', value: 'overstock' },
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filterStatus === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{filteredInventory.length}</span> items
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-1 text-sm font-semibold text-gray-900 outline-none"
            >
              <option value="status">Sort by Status</option>
              <option value="stock-low">Stock (Low to High)</option>
              <option value="stock-high">Stock (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">SKU</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Current Stock</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Min / Max</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Unit Cost</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Total Value</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Last Restock</th>
                <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => {
                const totalValue = item.currentStock * item.unitCost;
                const isNeedingReorder = item.currentStock <= item.minStock;

                return (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          item.currentStock > item.maxStock
                            ? 'bg-blue-100 text-blue-800'
                            : item.currentStock <= item.minStock
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.currentStock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600">
                      {item.minStock} / {item.maxStock}
                    </td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">${item.unitCost.toFixed(2)}</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900">${totalValue.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{getStatusIcon(item.status)}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(item.status)}`}>
                          {item.status === 'out-of-stock'
                            ? 'Out of Stock'
                            : item.status === 'low-stock'
                              ? 'Low Stock'
                              : item.status === 'overstock'
                                ? 'Overstock'
                                : 'In Stock'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(item.lastRestock).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {isNeedingReorder && (
                          <button
                            title="Reorder"
                            className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 transition"
                          >
                            <TrendingDown size={18} />
                          </button>
                        )}
                        <button
                          title="Edit"
                          className="p-1 hover:bg-gray-200 rounded transition"
                        >
                          <Edit2 size={18} className="text-gray-600" />
                        </button>
                        <button
                          title="Delete"
                          className="p-1 hover:bg-red-100 rounded transition"
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
        </div>

        {/* Reorder Alerts */}
        {inventory.filter((i) => i.currentStock <= i.minStock).length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <AlertCircle size={24} className="text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-900 mb-2">⚠️ Reorder Alerts</h3>
                <p className="text-sm text-yellow-800 mb-3">
                  {inventory.filter((i) => i.currentStock <= i.minStock).length} product
                  {inventory.filter((i) => i.currentStock <= i.minStock).length !== 1 ? 's' : ''} need reordering
                </p>
                <div className="space-y-2">
                  {inventory
                    .filter((i) => i.currentStock <= i.minStock)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            Current: {item.currentStock} | Reorder: {item.reorderQty} units | Supplier:{' '}
                            {item.supplier}
                          </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm hover:bg-blue-700 transition">
                          Create PO
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
