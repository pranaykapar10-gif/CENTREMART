'use client';

import Link from 'next/link';
import { Smartphone, Headphones, Zap, Shield } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  product_count?: number;
}

export default function CategoryGrid() {
  const categories: Category[] = [
    {
      id: 1,
      name: 'Smartphones',
      slug: 'smartphones',
      icon: <Smartphone className="w-16 h-16" />,
      color: 'from-blue-500 to-blue-600',
      description: 'Latest models & accessories',
      product_count: 245,
    },
    {
      id: 2,
      name: 'Audio',
      slug: 'audio',
      icon: <Headphones className="w-16 h-16" />,
      color: 'from-purple-500 to-purple-600',
      description: 'Headphones & speakers',
      product_count: 128,
    },
    {
      id: 3,
      name: 'Power',
      slug: 'power',
      icon: <Zap className="w-16 h-16" />,
      color: 'from-amber-500 to-amber-600',
      description: 'Chargers & power banks',
      product_count: 87,
    },
    {
      id: 4,
      name: 'Protection',
      slug: 'protection',
      icon: <Shield className="w-16 h-16" />,
      color: 'from-green-500 to-green-600',
      description: 'Cases & screen protectors',
      product_count: 156,
    },
  ];

  return (
    <section className="py-24 px-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-2">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Find what you&apos;re looking for</p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl cursor-pointer h-64">
                {/* Background Gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-90 group-hover:opacity-100 transition-all duration-300`}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-6 text-white text-center">
                  {/* Icon */}
                  <div className="mb-4 transform group-hover:scale-110 group-hover:-translate-y-2 transition-transform duration-300">
                    {category.icon}
                  </div>

                  {/* Category Name */}
                  <h3 className="text-2xl font-black mb-2 group-hover:scale-105 transition-transform duration-300">
                    {category.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/80 mb-3">{category.description}</p>

                  {/* Product Count & CTA */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <p className="text-xs text-white/70 mb-3">{category.product_count} products</p>
                    <span className="inline-block px-4 py-2 bg-white text-gray-900 rounded-full font-bold text-sm hover:scale-105 transition-transform">
                      Browse →
                    </span>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-3 right-3 w-20 h-20 bg-white/10 rounded-full blur-lg group-hover:scale-150 transition-transform duration-300" />
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
          <Link
            href="/shop"
            className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors hover:scale-105 transform duration-300"
          >
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
