'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, ChevronDown, Grid, List } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  category?: string;
  rating?: number;
  image_url?: string;
}

interface FilterState {
  category: string[];
  priceRange: [number, number];
  rating: number;
  searchTerm: string;
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    priceRange: [0, 500],
    rating: 0,
    searchTerm: '',
  });

  const categories = ['Audio', 'Power', 'Protection', 'Smartphones'];
  const priceRanges = [
    { label: 'Under $50', max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Over $200', min: 200 },
  ];

  useEffect(() => {
    const mockProducts: Product[] = Array.from({ length: 24 }, (_, i) => ({
      id: i + 1,
      name: `Premium Product ${i + 1}`,
      price: Math.random() * 400 + 20,
      discount_price: i % 3 === 0 ? Math.random() * 300 + 15 : undefined,
      category: categories[i % categories.length],
      rating: Math.random() * 2 + 3.5,
    }));
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  useEffect(() => {
    let result = [...products];

    // Search filter
    if (filters.searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (filters.category.length > 0) {
      result = result.filter((p) => filters.category.includes(p.category || ''));
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.discount_price || p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Rating filter
    if (filters.rating > 0) {
      result = result.filter((p) => (p.rating || 0) >= filters.rating);
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.discount_price || a.price) - (b.discount_price || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.discount_price || b.price) - (a.discount_price || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    setFilteredProducts(result);
  }, [filters, sortBy, products]);

  const toggleCategory = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category.includes(category)
        ? prev.category.filter((c) => c !== category)
        : [...prev.category, category],
    }));
  };

  const togglePriceRange = (range: { label: string; min?: number; max?: number }) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [range.min || 0, range.max || 500],
    }));
  };

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
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="w-5 h-5 rounded border-gray-300"
                        />
                        <span className="text-gray-700">{cat}</span>
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
                        onClick={() => togglePriceRange(range)}
                        className={`w-full text-left px-3 py-2 rounded ${
                          filters.priceRange[0] === (range.min || 0) &&
                          filters.priceRange[1] === (range.max || 500)
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
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Rating</h3>
                  <div className="space-y-2">
                    {[4.5, 4, 3.5, 3].map((rating) => (
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
                        <span>{'★'.repeat(Math.floor(rating))}</span>
                        <span className="text-sm">{rating}+</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Filters */}
                <button
                  onClick={() =>
                    setFilters({
                      category: [],
                      priceRange: [0, 500],
                      rating: 0,
                      searchTerm: '',
                    })
                  }
                  className="w-full mt-8 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}

          {/* Products Grid/List */}
          <div className="flex-1">
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-2xl font-bold text-gray-900 mb-2">No products found</p>
                <p className="text-gray-600">Try adjusting your filters</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="group bg-white rounded-lg overflow-hidden hover:shadow-xl transition border border-gray-200">
                      {/* Image */}
                      <div className="h-64 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden">
                        <span className="text-5xl">📦</span>
                        {product.discount_price && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -
                            {Math.round(
                              ((product.price - product.discount_price) / product.price) * 100
                            )}
                            %
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                        <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition">
                          {product.name}
                        </h3>

                        {product.rating && (
                          <div className="flex gap-1 my-2">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-black text-gray-900">
                            ${(product.discount_price || product.price).toFixed(2)}
                          </span>
                          {product.discount_price && (
                            <span className="text-sm line-through text-gray-400">
                              ${product.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/product/${product.id}`}>
                    <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition border border-gray-200 flex">
                      {/* Image */}
                      <div className="w-40 h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-4xl">📦</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 p-6 flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mt-2">Premium quality product with excellent features</p>
                        </div>

                        <div className="flex items-center gap-4">
                          {product.rating && (
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                          <div className="ml-auto">
                            <span className="text-2xl font-black text-gray-900">
                              ${(product.discount_price || product.price).toFixed(2)}
                            </span>
                            {product.discount_price && (
                              <span className="text-sm line-through text-gray-400 ml-2">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
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
