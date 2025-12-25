'use client';

import { useState } from 'react';
import { Filter, Grid, List } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryPageProps {
  categoryName: string;
  categoryDescription?: string;
  bannerImage?: string;
  products: Array<{
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    rating: number;
    reviewCount: number;
    inStock: boolean;
  }>;
  subcategories?: string[];
}

/**
 * Enhanced Category Page
 */
export function CategoryPage({
  categoryName,
  categoryDescription,
  bannerImage,
  products,
  subcategories = [],
}: CategoryPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [showFilters, setShowFilters] = useState(true);

  const filteredProducts = selectedSubcategory
    ? products.slice(0, 8)
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return 0;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      {bannerImage && (
        <div className="relative h-96 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-2xl overflow-hidden group animate-fade-in">
          <Image
            src={bannerImage}
            alt={categoryName}
            width={1200}
            height={400}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-slide-up dark:text-gray-100">
                {categoryName}
              </h1>
              {categoryDescription && (
                <p className="text-xl md:text-2xl text-white/90 dark:text-gray-200 max-w-2xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                  {categoryDescription}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subcategories */}
      {subcategories.length > 0 && (
        <div className="animate-slide-down">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">
            Shop by Category
          </h3>
          <div className="flex flex-wrap gap-2">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(selectedSubcategory === sub ? null : sub)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedSubcategory === sub
                    ? 'bg-gradient-primary text-white dark:bg-gradient-to-r dark:from-primary-700 dark:to-secondary-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Filters */}
        <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-base dark:shadow-gray-950 p-6 sticky top-4 space-y-6 animate-slide-in-left">
            {/* Sort */}
            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-4">Sort By</h3>
              <div className="space-y-2">
                {[
                  { value: 'relevance', label: 'Most Relevant' },
                  { value: 'price-low', label: 'Price: Low to High' },
                  { value: 'price-high', label: 'Price: High to Low' },
                  { value: 'rating', label: 'Top Rated' },
                  { value: 'newest', label: 'Newest' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="sort"
                      value={option.value}
                      checked={sortBy === option.value}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-4 h-4 text-primary-600 border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus-ring cursor-pointer"
                    />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Price</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Min Price
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-2 block">
                    Max Price
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="flex gap-2 text-sm">
                  <span className="font-semibold text-gray-900">${priceRange.min}</span>
                  <span className="text-gray-600">to</span>
                  <span className="font-semibold text-gray-900">${priceRange.max}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-base animate-slide-down">
            <p className="text-gray-600 font-medium">
              Showing {sortedProducts.length} products
            </p>

            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-primary-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list'
                      ? 'bg-white text-primary-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Mobile Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-600"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group bg-white rounded-2xl shadow-base hover:shadow-lg transition-all overflow-hidden animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="aspect-square bg-gray-100 overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {product.originalPrice && (
                      <div className="absolute top-3 right-3 bg-gradient-error text-white px-3 py-1 rounded-full text-xs font-bold">
                        Sale
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i < Math.floor(product.rating)
                              ? '★ text-warning-500'
                              : '★ text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-gray-600 ml-1">
                        ({product.reviewCount})
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-lg text-gray-900">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {sortedProducts.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="group flex gap-4 bg-white rounded-xl p-4 shadow-base hover:shadow-lg transition-all animate-slide-down"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-32 h-32 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        High-quality product with great features
                      </p>

                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${
                              i < Math.floor(product.rating)
                                ? '★ text-warning-500'
                                : '★ text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-gray-600 ml-2">
                          ({product.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover-lift transition-all">
                        Add
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {sortedProducts.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-2xl font-bold text-gray-900 mb-2">No products found</p>
              <p className="text-gray-600">Try adjusting your filters or sort options</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
