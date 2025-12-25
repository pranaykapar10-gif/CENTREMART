'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, X, Heart, Star, TrendingUp, Clock, Zap } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  stock: number;
  trending: boolean;
  new: boolean;
  discount?: number;
}

interface SearchFilters {
  searchQuery: string;
  categories: string[];
  priceRange: [number, number];
  ratings: number[];
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest' | 'trending';
  inStock: boolean;
}

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: '',
    categories: [],
    priceRange: [0, 500],
    ratings: [],
    sortBy: 'relevance',
    inStock: false,
  });

  const [showFilters, setShowFilters] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>(['wireless headphones', 'charger', 'phone case']);
  const [savedSearches, setSavedSearches] = useState<string[]>(['budget tech under $50', 'premium audio']);

  // Mock product database
  const allProducts: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      category: 'Audio',
      price: 129.99,
      rating: 4.8,
      reviews: 234,
      image: '🎧',
      stock: 45,
      trending: true,
      new: false,
      discount: 10,
    },
    {
      id: 2,
      name: 'USB-C Fast Charger',
      category: 'Chargers',
      price: 49.99,
      rating: 4.5,
      reviews: 156,
      image: '🔌',
      stock: 156,
      trending: false,
      new: true,
    },
    {
      id: 3,
      name: 'Premium Phone Case',
      category: 'Cases',
      price: 24.99,
      rating: 4.3,
      reviews: 89,
      image: '📱',
      stock: 8,
      trending: false,
      new: false,
    },
    {
      id: 4,
      name: 'Screen Protector Pack',
      category: 'Protection',
      price: 14.99,
      rating: 4.1,
      reviews: 67,
      image: '🛡️',
      stock: 0,
      trending: false,
      new: false,
    },
    {
      id: 5,
      name: 'Portable Power Bank',
      category: 'Power',
      price: 79.99,
      rating: 4.6,
      reviews: 112,
      image: '🔋',
      stock: 67,
      trending: true,
      new: false,
    },
    {
      id: 6,
      name: 'Desk Phone Stand',
      category: 'Accessories',
      price: 19.99,
      rating: 4.2,
      reviews: 45,
      image: '📐',
      stock: 203,
      trending: false,
      new: true,
    },
    {
      id: 7,
      name: 'Wireless Mouse',
      category: 'Peripherals',
      price: 39.99,
      rating: 4.4,
      reviews: 98,
      image: '🖱️',
      stock: 34,
      trending: false,
      new: false,
    },
    {
      id: 8,
      name: 'Laptop Cooling Pad',
      category: 'Accessories',
      price: 44.99,
      rating: 4.7,
      reviews: 76,
      image: '❄️',
      stock: 12,
      trending: true,
      new: false,
    },
    {
      id: 9,
      name: 'USB Hub 7-Port',
      category: 'Connectivity',
      price: 34.99,
      rating: 4.2,
      reviews: 52,
      image: '🔗',
      stock: 89,
      trending: false,
      new: false,
    },
    {
      id: 10,
      name: 'Wireless Charger Pad',
      category: 'Chargers',
      price: 29.99,
      rating: 4.6,
      reviews: 134,
      image: '⚡',
      stock: 76,
      trending: true,
      new: true,
    },
    {
      id: 11,
      name: 'Phone Gimbal Stabilizer',
      category: 'Video',
      price: 99.99,
      rating: 4.4,
      reviews: 88,
      image: '📹',
      stock: 23,
      trending: false,
      new: false,
    },
    {
      id: 12,
      name: 'Cable Organizer Set',
      category: 'Accessories',
      price: 9.99,
      rating: 4.0,
      reviews: 34,
      image: '🧩',
      stock: 156,
      trending: false,
      new: false,
    },
  ];

  const categories = ['Audio', 'Chargers', 'Cases', 'Protection', 'Power', 'Accessories', 'Peripherals', 'Connectivity', 'Video'];

  // Advanced search algorithm with relevance scoring
  const calculateRelevanceScore = useCallback(
    (product: Product, query: string): number => {
      if (!query.trim()) return 0;

      const q = query.toLowerCase();
      const name = product.name.toLowerCase();
      const category = product.category.toLowerCase();

      let score = 0;

      // Exact match
      if (name === q) score += 100;
      // Starts with query
      else if (name.startsWith(q)) score += 80;
      // Contains full query
      else if (name.includes(q)) score += 60;
      // Word match
      else if (name.split(' ').some((word) => word.startsWith(q))) score += 40;
      // Category match
      else if (category.includes(q)) score += 20;

      // Boost for trending and new products
      if (product.trending) score += 15;
      if (product.new) score += 10;

      // Boost for high ratings
      if (product.rating >= 4.5) score += 8;

      // Penalize out of stock
      if (product.stock === 0) score -= 20;

      return score;
    },
    []
  );

  // Smart search & filter logic
  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Apply search with relevance scoring
    if (filters.searchQuery.trim()) {
      results = results
        .map((product) => ({
          product,
          score: calculateRelevanceScore(product, filters.searchQuery),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ product }) => product);
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      results = results.filter((p) => filters.categories.includes(p.category));
    }

    // Apply price range filter
    results = results.filter((p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

    // Apply rating filter
    if (filters.ratings.length > 0) {
      results = results.filter((p) => filters.ratings.some((r) => Math.floor(p.rating) === r));
    }

    // Apply stock filter
    if (filters.inStock) {
      results = results.filter((p) => p.stock > 0);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        results.sort((a, b) => (b.new ? 1 : 0) - (a.new ? 1 : 0));
        break;
      case 'trending':
        results.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
        break;
      case 'relevance':
      default:
        // Already sorted by relevance if search query exists
        break;
    }

    return results;
  }, [filters, calculateRelevanceScore]);

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query }));
    if (query.trim() && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev].slice(0, 5));
    }
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleRatingToggle = (rating: number) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating) ? prev.ratings.filter((r) => r !== rating) : [...prev.ratings, rating],
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      categories: [],
      priceRange: [0, 500],
      ratings: [],
      sortBy: 'relevance',
      inStock: false,
    });
  };

  const hasActiveFilters =
    filters.categories.length > 0 ||
    filters.ratings.length > 0 ||
    filters.inStock ||
    filters.sortBy !== 'relevance' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 500;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-black text-gray-900">Smart Product Search</h1>
          <p className="text-gray-600 mt-2">AI-powered search with intelligent filtering and recommendations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div
            className={`${
              showFilters ? 'w-80' : 'w-0'
            } transition-all duration-300 overflow-hidden flex-shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Recent Searches */}
              {!filters.searchQuery && recentSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Recent Searches</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 hover:text-gray-900 transition flex items-center gap-2"
                      >
                        <Clock size={14} /> {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Searches */}
              {savedSearches.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3">Saved Searches</h3>
                  <div className="space-y-2">
                    {savedSearches.map((search, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSearch(search)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 rounded-lg text-sm text-blue-600 hover:text-blue-700 transition font-semibold"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        priceRange: [prev.priceRange[0], parseInt(e.target.value)],
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <label key={category} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.categories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Ratings */}
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Rating</h3>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.ratings.includes(rating)}
                        onChange={() => handleRatingToggle(rating)}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">& up</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => setFilters((prev) => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700 font-semibold">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="space-y-4 mb-6">
              {/* Search Bar */}
              <div className="relative">
                <div className="relative bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <Search size={20} className="absolute left-4 top-3.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products, brands, or features... AI-powered results"
                    value={filters.searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-transparent outline-none text-gray-900 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-semibold text-gray-900 hover:bg-gray-50 transition lg:hidden"
                >
                  <Filter size={18} /> Filters
                </button>

                <div className="flex-1 mx-4 hidden md:block">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-bold">{filteredProducts.length}</span> of{' '}
                    <span className="font-bold">{allProducts.length}</span> results
                  </p>
                </div>

                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters((prev) => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white font-semibold text-gray-900 outline-none focus:border-blue-500"
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rating</option>
                  <option value="newest">Newest</option>
                  <option value="trending">Trending</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Link key={product.id} href={`/product/${product.id}`}>
                      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition cursor-pointer h-full flex flex-col relative">
                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex gap-2 flex-wrap">
                          {product.new && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                              New
                            </span>
                          )}
                          {product.trending && (
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-bold flex items-center gap-1">
                              <TrendingUp size={12} /> Trending
                            </span>
                          )}
                          {product.discount && (
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
                              -{product.discount}%
                            </span>
                          )}
                        </div>

                        {/* Image */}
                        <div className="w-full h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-5xl mb-4 mt-8">
                          {product.image}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                          <p className="text-xs text-gray-600 mb-3">{product.category}</p>

                          {/* Rating */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  size={14}
                                  className={
                                    i < Math.floor(product.rating)
                                      ? 'text-yellow-500 fill-yellow-500'
                                      : 'text-gray-300'
                                  }
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-600">({product.reviews})</span>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-2xl font-black text-blue-600">${product.price.toFixed(2)}</p>
                            {product.discount && (
                              <p className="text-xs text-gray-500 line-through">
                                ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {product.stock === 0 ? (
                              <span className="text-xs font-bold text-red-600 px-2 py-1 bg-red-50 rounded">
                                Out of Stock
                              </span>
                            ) : product.stock < 10 ? (
                              <span className="text-xs font-bold text-orange-600 px-2 py-1 bg-orange-50 rounded">
                                Low Stock
                              </span>
                            ) : (
                              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                                <Heart size={20} className="text-gray-400 hover:text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                    Previous
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm font-semibold">1</button>
                  <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition">
                    Next
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <Search size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-600 font-semibold mb-2">No products found</p>
                <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filters</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
