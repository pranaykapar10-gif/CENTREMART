'use client';

import { ChevronRight, Star, Zap, TrendingUp, Users, Award } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Home Page
 */
export function HomePage() {
  return (
    <div className="space-y-20">
      {/* Featured Categories */}
      <section className="space-y-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Explore Our Collections
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover curated collections handpicked for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Electronics', icon: '📱', gradient: 'from-blue-600 to-cyan-600' },
            { name: 'Fashion', icon: '👗', gradient: 'from-purple-600 to-pink-600' },
            { name: 'Home & Garden', icon: '🏠', gradient: 'from-green-600 to-emerald-600' },
            { name: 'Beauty', icon: '💄', gradient: 'from-rose-600 to-pink-600' },
            { name: 'Sports', icon: '⚽', gradient: 'from-orange-600 to-yellow-600' },
            { name: 'Books', icon: '📚', gradient: 'from-indigo-600 to-blue-600' },
          ].map((category, index) => (
            <Link
              key={category.name}
              href={`/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
              className={`group relative h-48 rounded-2xl overflow-hidden cursor-pointer animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-80 dark:opacity-60 group-hover:opacity-90 dark:group-hover:opacity-70 transition-opacity duration-300`} />

              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <h3 className="text-2xl font-bold">{category.name}</h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent dark:from-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-gradient-to-r from-error-600 to-warning-600 dark:from-error-700 dark:to-warning-700 rounded-2xl p-8 md:p-12 text-white space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <Zap size={32} className="fill-current" />
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">Flash Sale</h2>
            <p className="text-white/80 dark:text-white/70">Limited time offers - Up to 70% off</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white/10 dark:bg-white/5 backdrop-blur rounded-lg p-4 hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300">
              <div className="aspect-square bg-white/20 dark:bg-white/10 rounded-lg mb-3" />
              <p className="font-semibold text-sm mb-2 line-clamp-2">Featured Product</p>
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-lg">$19.99</span>
                <span className="text-sm text-white/70 line-through">$49.99</span>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/flash-sale"
          className="inline-flex items-center gap-2 text-white font-bold hover:gap-3 transition-all"
        >
          View All Deals <ChevronRight size={20} />
        </Link>
      </section>

      {/* Trending Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <TrendingUp className="text-primary-600 dark:text-primary-500" size={32} />
              Trending Now
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Most viewed products this week</p>
          </div>
          <Link
            href="/trending"
            className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300"
          >
            See All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item, index) => (
            <Link
              key={item}
              href={`/products/${item}`}
              className="group bg-white dark:bg-gray-800 rounded-2xl shadow-base dark:shadow-gray-950 hover:shadow-xl dark:hover:shadow-gray-900/50 overflow-hidden animate-slide-up transition-all"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square bg-gradient-to-br from-gray-200 dark:from-gray-700 to-gray-300 dark:to-gray-600 overflow-hidden relative">
                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-3 left-3 bg-primary-600 dark:bg-primary-700 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <TrendingUp size={12} /> Trending
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  Trending Product {item}
                </h3>

                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < 4 ? 'fill-warning-500 text-warning-500 dark:fill-warning-400 dark:text-warning-400' : 'text-gray-300 dark:text-gray-600'}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p className="font-bold text-lg text-primary-600 dark:text-primary-400">$39.99</p>
                  <button className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-800/50 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-3">
              <Award className="text-secondary-600 dark:text-secondary-400" size={32} />
              Best Sellers
            </h2>
            <p className="text-xl text-gray-600">Customer favorites</p>
          </div>
        </div>

        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item, index) => (
            <Link
              key={item}
              href={`/products/${item}`}
              className="group flex items-center gap-4 p-4 bg-white rounded-xl hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg group-hover:scale-110 transition-transform duration-300" />

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
                  Best Seller Product {item}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">High-quality product with excellent reviews</p>
              </div>

              <div className="flex-shrink-0 text-right">
                <p className="font-bold text-lg text-gray-900 mb-1">${(29 + item * 10).toFixed(2)}</p>
                <div className="flex items-center gap-1 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="fill-current" />
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
          Loved by Millions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Sarah Johnson', text: 'Amazing quality and fast shipping! Will definitely order again.' },
            { name: 'Mike Chen', text: 'Best prices I found online. Customer service was super helpful.' },
            { name: 'Emma Davis', text: 'The variety of products is incredible. Found exactly what I was looking for!' },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-base hover:shadow-lg transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-warning-500 text-warning-500" />
                ))}
              </div>

              <p className="text-gray-600 mb-4 italic">&quot;{testimonial.text}&quot;</p>

              <p className="font-semibold text-gray-900">{testimonial.name}</p>
              <p className="text-sm text-gray-600">Verified Customer</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white text-center">
          {[
            { icon: Users, number: '2M+', label: 'Happy Customers' },
            { icon: Award, number: '50K+', label: 'Products' },
            { icon: Zap, number: '24/7', label: 'Support' },
            { icon: TrendingUp, number: '4.8★', label: 'Rating' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="space-y-2 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <Icon size={32} className="mx-auto opacity-80" />
                <p className="text-4xl font-bold">{stat.number}</p>
                <p className="text-white/80">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="max-w-2xl mx-auto space-y-6 text-center animate-fade-in">
        <h2 className="text-4xl font-bold text-gray-900">
          Stay Updated
        </h2>
        <p className="text-xl text-gray-600">
          Subscribe to our newsletter for exclusive deals and new arrivals
        </p>

        <form className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 focus-ring"
          />
          <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all">
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
