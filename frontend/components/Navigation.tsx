'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useCart();

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-950 sticky top-0 z-50 transition-colors duration-300" role="navigation" aria-label="Main">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-purple-600 dark:text-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded px-2 py-1">
            Store
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded px-2 py-1">
              Home
            </Link>
            <Link href="/shop" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded px-2 py-1">
              Shop
            </Link>
            <Link href="/login" className="text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded px-2 py-1">
              Login
            </Link>
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              aria-label={`Cart with ${items.length} items`}
            >
              Cart
              {items.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 dark:bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center" aria-label={`${items.length} items in cart`}>
                  {items.length}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-slate-700 dark:text-slate-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400 rounded p-1"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? '✕' : '☰'}
          </button>
          <div className="md:hidden">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2" id="mobile-menu">
            <Link
              href="/"
              className="block text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="block text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            >
              Shop
            </Link>
            <Link
              href="/login"
              className="block text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            >
              Login
            </Link>
            <Link
              href="/cart"
              className="block bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600"
            >
              Cart ({items.length})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
