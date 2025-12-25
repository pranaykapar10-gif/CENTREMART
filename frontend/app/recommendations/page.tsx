'use client';

import Link from 'next/link';
import { Star, TrendingUp, Heart, Zap, Flame, Award } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  discount?: number;
  badge?: string;
}

export default function RecommendationsPage() {
  // Mock product data with different categories
  const trendingProducts: Product[] = [
    {
      id: 1,
      name: 'Wireless Headphones Pro',
      price: 129.99,
      rating: 4.8,
      reviews: 234,
      image: '🎧',
      discount: 10,
      badge: 'Top Seller',
    },
    {
      id: 5,
      name: 'Portable Power Bank',
      price: 79.99,
      rating: 4.6,
      reviews: 112,
      image: '🔋',
      badge: 'Trending',
    },
    {
      id: 8,
      name: 'Laptop Cooling Pad',
      price: 44.99,
      rating: 4.7,
      reviews: 76,
      image: '❄️',
      badge: 'Best Value',
    },
    {
      id: 10,
      name: 'Wireless Charger Pad',
      price: 29.99,
      rating: 4.6,
      reviews: 134,
      image: '⚡',
      badge: 'New',
    },
  ];

  const premiumProducts: Product[] = [
    {
      id: 11,
      name: 'Premium Phone Gimbal',
      price: 99.99,
      rating: 4.4,
      reviews: 88,
      image: '📹',
      badge: 'Premium',
    },
    {
      id: 1,
      name: 'Wireless Headphones Pro Max',
      price: 199.99,
      rating: 4.9,
      reviews: 145,
      image: '🎧',
      discount: 15,
    },
  ];

  const budgetProducts: Product[] = [
    {
      id: 4,
      name: 'Screen Protector Pack',
      price: 14.99,
      rating: 4.1,
      reviews: 67,
      image: '🛡️',
      badge: 'Budget',
    },
    {
      id: 12,
      name: 'Cable Organizer Set',
      price: 9.99,
      rating: 4.0,
      reviews: 34,
      image: '🧩',
    },
    {
      id: 6,
      name: 'Desk Phone Stand',
      price: 19.99,
      rating: 4.2,
      reviews: 45,
      image: '📐',
      badge: 'New',
    },
    {
      id: 3,
      name: 'Premium Phone Case',
      price: 24.99,
      rating: 4.3,
      reviews: 89,
      image: '📱',
    },
  ];

  const complementaryProducts: Product[] = [
    { id: 2, name: 'USB-C Fast Charger', price: 49.99, rating: 4.5, reviews: 156, image: '🔌' },
    { id: 9, name: 'USB Hub 7-Port', price: 34.99, rating: 4.2, reviews: 52, image: '🔗' },
    { id: 7, name: 'Wireless Mouse', price: 39.99, rating: 4.4, reviews: 98, image: '🖱️' },
  ];

  const ProductCard = ({ product, highlight = false }: { product: Product; highlight?: boolean }) => (
    <Link href={`/product/${product.id}`}>
      <div
        className={`rounded-2xl border shadow-sm hover:shadow-lg transition cursor-pointer h-full flex flex-col p-6 ${
          highlight ? 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300' : 'bg-white border-gray-200'
        }`}
      >
        {/* Badge */}
        {product.badge && (
          <div className="mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800">
              ⭐ {product.badge}
            </span>
          </div>
        )}

        {/* Image */}
        <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-4xl mb-4">
          {product.image}
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 text-sm">{product.name}</h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={i < Math.floor(product.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600">({product.reviews})</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <p className="text-lg font-black text-blue-600">${product.price.toFixed(2)}</p>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Heart size={16} className="text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-black text-gray-900">Personalized Recommendations</h1>
          <p className="text-gray-600 mt-2">
            Discover products handpicked just for you based on trending items, ratings, and your preferences
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Trending Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-red-100 rounded-full">
              <Flame size={24} className="text-red-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">🔥 Trending Now</h2>
              <p className="text-sm text-gray-600">Most popular items this week</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} highlight={true} />
            ))}
          </div>
        </section>

        {/* Premium Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-100 rounded-full">
              <Award size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">👑 Premium Selection</h2>
              <p className="text-sm text-gray-600">Top-rated premium products</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {premiumProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Budget-Friendly Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-green-100 rounded-full">
              <Zap size={24} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">💰 Budget-Friendly Picks</h2>
              <p className="text-sm text-gray-600">Great quality without breaking the bank</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {budgetProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Complementary Section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-gray-900">🎯 Often Bought Together</h2>
              <p className="text-sm text-gray-600">Products frequently purchased together</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {complementaryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* AI Insights Card */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-black mb-6">🤖 AI-Powered Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-2">Smart Matching</h3>
              <p className="text-blue-100">
                Our AI analyzes your preferences and browsing history to suggest perfect matches
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Real-time Trends</h3>
              <p className="text-blue-100">
                See what&apos;s trending right now based on community purchases and ratings
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Quality Assured</h3>
              <p className="text-blue-100">
                Only recommend products with 4+ star ratings from verified customers
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Can&apos;t find what you&apos;re looking for?</h2>
          <Link href="/search">
            <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition">
              Go to Advanced Search
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
