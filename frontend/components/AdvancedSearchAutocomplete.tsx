'use client';

import { useState, useCallback, useMemo } from 'react';
import { Search, Zap, TrendingUp, Clock, X } from 'lucide-react';

interface SearchSuggestion {
  text: string;
  type: 'trending' | 'recent' | 'suggestion' | 'product';
  icon: string;
  searches?: number;
}

interface AutocompleteResult {
  suggestions: SearchSuggestion[];
  trending: SearchSuggestion[];
}

export function AdvancedSearchWithAutocomplete() {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Mock data
  const trendingSearches = useMemo(
    () => [
      { text: 'Wireless Headphones', type: 'trending' as const, icon: '🔥', searches: 1240 },
      { text: 'USB-C Charger', type: 'trending' as const, icon: '⚡', searches: 890 },
      { text: 'iPhone 15 Pro', type: 'trending' as const, icon: '📱', searches: 1560 },
      { text: 'Gaming Laptop', type: 'trending' as const, icon: '🎮', searches: 720 },
      { text: 'Smart Watch', type: 'trending' as const, icon: '⌚', searches: 650 },
    ],
    []
  );

  const generateSuggestions = useCallback(
    (searchQuery: string): AutocompleteResult => {
      if (!searchQuery.trim()) {
        return {
          suggestions: [],
          trending: trendingSearches.slice(0, 5),
        };
      }

      const lowerQuery = searchQuery.toLowerCase();

      // Smart suggestions based on query
      const suggestions: SearchSuggestion[] = [];

      // Exact trending matches
      trendingSearches.forEach((trend) => {
        if (trend.text.toLowerCase().includes(lowerQuery)) {
          suggestions.push(trend);
        }
      });

      // Product suggestions (mock)
      const productSuggestions = [
        { text: 'Wireless Earbuds Pro', type: 'product' as const, icon: '🎧' },
        { text: 'Wireless Phone Charger', type: 'product' as const, icon: '🔌' },
        { text: 'Wireless Keyboard', type: 'product' as const, icon: '⌨️' },
        { text: 'Wireless Mouse', type: 'product' as const, icon: '🖱️' },
      ];

      productSuggestions.forEach((product) => {
        if (
          product.text.toLowerCase().includes(lowerQuery) &&
          !suggestions.some((s) => s.text === product.text)
        ) {
          suggestions.push(product);
        }
      });

      return {
        suggestions: suggestions.slice(0, 8),
        trending: trendingSearches.slice(0, 3),
      };
    },
    [trendingSearches]
  );

  const { suggestions, trending } = useMemo(() => generateSuggestions(query), [query, generateSuggestions]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const allItems = [...suggestions, ...trending];

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < allItems.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allItems.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < allItems.length) {
          setQuery(allItems[selectedIndex].text);
          setShowSuggestions(false);
          setSelectedIndex(-1);
        } else if (query.trim()) {
          handleSearch(query);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      setShowSuggestions(false);
    }
  };

  const allSuggestions = [...suggestions, ...trending];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        {/* Search Input */}
        <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-2xl shadow-sm focus-within:border-blue-500 focus-within:shadow-lg transition">
          <Search size={24} className="text-gray-400 ml-4" />
          <input
            type="text"
            placeholder="Search products, brands, features... (Try: wireless, laptop, etc.)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onFocus={() => {
              setShowSuggestions(true);
              setSelectedIndex(-1);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 outline-none px-4 py-3 text-gray-900 placeholder:text-gray-500 font-medium text-lg"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setShowSuggestions(false);
              }}
              className="mr-2 p-2 hover:bg-gray-100 rounded-lg transition text-gray-500"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && allSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {/* Suggestions Section */}
            {suggestions.length > 0 && (
              <div>
                <p className="px-4 pt-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Suggestions
                </p>
                {suggestions.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(item.text);
                      handleSearch(item.text);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                      idx === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{item.text}</p>
                      {item.type === 'product' && (
                        <p className="text-xs text-gray-500">Exact product match</p>
                      )}
                    </div>
                    {item.type === 'trending' && (
                      <span className="text-xs font-bold text-orange-600 whitespace-nowrap">
                        {item.searches?.toLocaleString()} searches
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Trending Section */}
            {trending.length > 0 && (
              <div className={suggestions.length > 0 ? 'border-t border-gray-200' : ''}>
                <p className="px-4 pt-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <TrendingUp size={14} /> Trending Now
                </p>
                {trending.map((item, idx) => {
                  const globalIdx = suggestions.length + idx;
                  return (
                    <button
                      key={globalIdx}
                      onClick={() => {
                        setQuery(item.text);
                        handleSearch(item.text);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                        globalIdx === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.text}</p>
                      </div>
                      <span className="text-xs font-bold text-red-600 whitespace-nowrap">
                        {item.searches?.toLocaleString()} searches
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Tips */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-2 text-xs text-gray-600 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <Zap size={16} className="text-blue-600 flex-shrink-0" />
          <span>
            <strong>Pro Tip:</strong> Use quotes for exact phrases
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <TrendingUp size={16} className="text-purple-600 flex-shrink-0" />
          <span>
            <strong>Popular:</strong> See trending searches
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-600 p-3 bg-green-50 rounded-lg border border-green-200">
          <Clock size={16} className="text-green-600 flex-shrink-0" />
          <span>
            <strong>Filter:</strong> Use advanced filters
          </span>
        </div>
      </div>
    </div>
  );
}
