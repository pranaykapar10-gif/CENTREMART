'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Menu, X, ShoppingCart, Search, Heart, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [showCategories, setShowCategories] = useState(false);
  const { items } = useCart();
  const itemCount = items.length;

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/products/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">EC</span>
            </div>
            <span className="hidden sm:inline font-bold text-xl text-gray-900 dark:text-gray-100">EcoStore</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Shop
            </Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button 
                onMouseEnter={() => setShowCategories(true)}
                className="flex items-center gap-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
              >
                Categories
                <ChevronDown size={16} />
              </button>
              
              {showCategories && (
                <div 
                  onMouseLeave={() => setShowCategories(false)}
                  className="absolute top-full left-0 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl py-2 z-50"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.id}`}
                        className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <p className="px-4 py-2 text-sm text-gray-500">No categories found</p>
                  )}
                </div>
              )}
            </div>

            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition">
              Contact
            </Link>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search - Desktop */}
            <div className="hidden lg:flex items-center">
              <input
                type="text"
                placeholder="Search products..."
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-64 transition"
              />
              <Search className="w-5 h-5 text-gray-400 dark:text-gray-500 -ml-8" />
            </div>

            {/* Wishlist */}
            <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <Heart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 dark:bg-red-700 rounded-full">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link href="/login" className="hidden sm:flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
              <User className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">Sign In</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="py-3 px-0 space-y-2">
              <Link href="/shop" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                Shop
              </Link>
              
              <div className="px-4 py-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/shop?category=${cat.id}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link href="/about" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                About
              </Link>
              <Link href="/contact" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                Contact
              </Link>
              <Link href="/login" className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition">
                Sign In
              </Link>
            </div>
            <div className="px-4 py-3">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
