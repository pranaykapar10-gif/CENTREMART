'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ChevronDown, Grid, List, Loader2, Star } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  category_id?: number;
  rating?: number;
  image_url?: string;
  stock_quantity: number;
}

interface Category {
  id: number;
  name: string;
}

interface FilterState {
  category: number | null;
  priceRange: [number, number];
  rating: number;
  searchTerm: string;
  inStock: boolean;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    priceRange: [0, 1000],
    rating: 0,
    searchTerm: '',
    inStock: false,
  });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products/categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category.toString());
      if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 1000) params.append('maxPrice', filters.priceRange[1].toString());
      if (filters.searchTerm) params.append('search', filters.searchTerm);
      if (filters.rating > 0) params.append('rating', filters.rating.toString());
      if (filters.inStock) params.append('inStock', 'true');
      if (sortBy) params.append('sort', sortBy);

      const res = await fetch(`${API_URL}/api/products?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error('Fetch products error:', err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, API_URL]);

  useEffect(() => {
    fetchCategories();
  }, [API_URL]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const priceRanges = [
    { label: 'All Prices', min: 0, max: 1000 },
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200, max: 1000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-black text-gray-900 mb-4">Shop</h1>

          {/* Search & Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.searchTerm}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchTerm: e.target.value }))
                }
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-3">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>

              {/* View Mode */}
              <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>

              {/* Toggle Filters */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <div className="w-72 flex-shrink-0">
              <div className="bg-white rounded-lg p-6 sticky top-24">
                {/* Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === null}
                        onChange={() => setFilters(prev => ({ ...prev, category: null }))}
                        className="w-5 h-5 rounded-full border-gray-300"
                      />
                      <span className="text-gray-700">All Categories</span>
                    </label>
                    {categories.map((cat) => (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="category"
                          checked={filters.category === cat.id}
                          onChange={() => setFilters(prev => ({ ...prev, category: cat.id }))}
                          className="w-5 h-5 rounded-full border-gray-300"
                        />
                        <span className="text-gray-700">{cat.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <button
                        key={range.label}
                        onClick={() => setFilters(prev => ({ ...prev, priceRange: [range.min, range.max] }))}
                        className={`w-full text-left px-3 py-2 rounded ${
                          filters.priceRange[0] === range.min &&
                          filters.priceRange[1] === range.max
                            ? 'bg-blue-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {range.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Filter */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-2">
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() =>
                          setFilters((prev) => ({
                            ...prev,
                            rating: prev.rating === rating ? 0 : rating,
                          }))
                        }
                        className={`w-full text-left px-3 py-2 rounded flex items-center gap-2 ${
                          filters.rating === rating
                            ? 'bg-blue-100 text-blue-600 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-current' : ''}`} />
                          ))}
                        </div>
                        <span className="text-sm">& Up</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Status */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-gray-700">In Stock Only</span>
                  </label>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      category: null,
                      priceRange: [0, 1000],
                      rating: 0,
                      searchTerm: '',
                      inStock: false,
                    })
                  }
                  className="w-full mt-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {products.length} products
              </p>
              {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-600" />}
            </div>

            {products.length === 0 && !loading ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-gray-900 mb-2">No products found</p>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition border border-gray-200 h-full flex flex-col">
                      {/* Image */}
                      <div className="h-64 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        ) : (
                          <span className="text-5xl">📦</span>
                        )}
                        {product.discount_price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}%
                          </div>
                        )}
                        {product.stock_quantity <= 0 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="bg-white text-black px-4 py-1 rounded-full font-bold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">({product.rating || 0})</span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <span className="text-xl font-black text-blue-600">
                              ${(Number(product.discount_price) || Number(product.price)).toFixed(2)}
                            </span>
                            {product.discount_price && (
                              <span className="ml-2 text-sm line-through text-gray-400">${Number(product.price).toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {products.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`} className="block">
                    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition border border-gray-200 flex gap-6 p-4">
                      <div className="w-48 h-48 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {product.image_url ? (
                          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-4xl">📦</span>
                        )}
                      </div>
                      <div className="flex-1 py-2">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition">{product.name}</h3>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : ''}`} />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">({product.rating || 0})</span>
                        </div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-2xl font-black text-blue-600">
                            ${(Number(product.discount_price) || Number(product.price)).toFixed(2)}
                          </span>
                          {product.discount_price && (
                            <span className="text-lg line-through text-gray-400">${Number(product.price).toFixed(2)}</span>
                          )}
                        </div>
                        <div className="mt-4">
                          {product.stock_quantity > 0 ? (
                            <span className="text-green-600 text-sm font-semibold">In Stock</span>
                          ) : (
                            <span className="text-red-600 text-sm font-semibold">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
