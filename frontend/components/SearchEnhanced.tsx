'use client';

import { useState, useCallback, useMemo } from 'react';
import { Search, X, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import Image from 'next/image';

interface SearchResult {
  id: string;
  name: string;
  category?: string;
  image?: string;
  price?: number;
}

interface SearchProps {
  onSearch: (query: string) => Promise<SearchResult[]>;
  recentSearches?: string[];
  trendingSearches?: string[];
  onSelectResult?: (result: SearchResult) => void;
}

/**
 * Enhanced Search Component with Autocomplete
 */
export function SearchEnhanced({
  onSearch,
  recentSearches = [],
  trendingSearches = [],
  onSelectResult,
}: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSelectResult = useCallback(
    (result: SearchResult) => {
      onSelectResult?.(result);
      setQuery('');
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [onSelectResult]
  );

  const handleSearch = useCallback(
    async (value: string) => {
      setQuery(value);
      if (value.trim()) {
        setIsLoading(true);
        try {
          const searchResults = await onSearch(value);
          setResults(searchResults);
          setSelectedIndex(-1);
          setIsOpen(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setIsOpen(true);
      }
    },
    [onSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter') setIsOpen(true);
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0) {
            handleSelectResult(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
        default:
          break;
      }
    },
    [isOpen, results, selectedIndex, handleSelectResult]
  );

  const displayResults = useMemo(() => {
    if (query.trim()) {
      return results;
    }
    if (recentSearches.length > 0) {
      return [];
    }
    return [];
  }, [query, results, recentSearches]);

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          placeholder="Search products, categories..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 rounded-xl focus:outline-none focus:border-primary-600 dark:focus:border-primary-500 focus-ring transition-all duration-200"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-950 border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down z-50"
          role="listbox"
          aria-label="Search results"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="p-8 flex items-center justify-center gap-3" role="status" aria-live="polite">
              <div className="animate-spin w-5 h-5 border-2 border-primary-300 dark:border-primary-900 border-t-primary-600 dark:border-t-primary-400 rounded-full" aria-hidden="true" />
              <span className="text-gray-600 dark:text-gray-400">Searching...</span>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && displayResults.length > 0 && (
            <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto scrollbar-hide">
              {displayResults.map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full px-4 py-3 flex items-center gap-4 transition-all duration-150 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 ${
                    selectedIndex === index
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  {result.image && (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
                      <Image
                        src={result.image}
                        alt={`${result.name} - product image`}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {result.name}
                    </p>
                    {result.category && (
                      <p className="text-xs text-gray-600">{result.category}</p>
                    )}
                  </div>
                  {result.price && (
                    <p className="font-bold text-primary-600 flex-shrink-0">
                      ${result.price.toFixed(2)}
                    </p>
                  )}
                  <ChevronRight
                    size={16}
                    className="text-gray-400 flex-shrink-0"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-gray-400" />
                <p className="text-sm font-semibold text-gray-700">Recent</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Searches */}
          {!query && trendingSearches.length > 0 && (
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={16} className="text-primary-600" />
                <p className="text-sm font-semibold text-gray-700">Trending</p>
              </div>
              <div className="space-y-2">
                {trendingSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleSearch(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && displayResults.length === 0 && query.trim() && (
            <div className="p-8 text-center">
              <Search size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 text-sm">No products found for &quot;{query}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Search Filter Sidebar
 */
export function SearchFilters({
  categories = [],
  onCategoryChange,
  onPriceChange,
  onSortChange,
}: {
  categories?: string[];
  onCategoryChange?: (category: string) => void;
  onPriceChange?: (min: number, max: number) => void;
  onSortChange?: (sort: string) => void;
}) {
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedSort, setSelectedSort] = useState('relevance');

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-base p-6 space-y-6">
      {/* Sort */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Sort By</h3>
        <div className="space-y-2">
          {sortOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="sort"
                value={option.value}
                checked={selectedSort === option.value}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  onSortChange?.(e.target.value);
                }}
                className="w-4 h-4 text-primary-600 border-gray-300 focus-ring cursor-pointer"
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Price Range</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                Min
              </label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPriceRange({ ...priceRange, min: value });
                  onPriceChange?.(value, priceRange.max);
                }}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-2 block">
                Max
              </label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 1000;
                  setPriceRange({ ...priceRange, max: value });
                  onPriceChange?.(priceRange.min, value);
                }}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus-ring"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Categories</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  onChange={() => onCategoryChange?.(category)}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus-ring cursor-pointer"
                />
                <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                  {category}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
