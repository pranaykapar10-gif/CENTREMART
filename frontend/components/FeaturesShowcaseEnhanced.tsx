'use client';

import { Package, Truck, RotateCcw, Shield, Zap, Users, Award, Star } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Features Showcase Component
 */
export function FeaturesShowcaseEnhanced() {
  const features = [
    {
      icon: Package,
      title: 'Huge Selection',
      description: 'Over 50,000+ products from thousands of brands. Find exactly what you\'re looking for.',
      color: 'from-blue-600 to-cyan-600',
    },
    {
      icon: Truck,
      title: 'Fast Shipping',
      description: 'Free shipping on orders over $50. Standard 3-5 days, Express 1-2 days available.',
      color: 'from-orange-600 to-yellow-600',
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: 'Hassle-free returns within 30-90 days depending on your membership tier.',
      color: 'from-purple-600 to-pink-600',
    },
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: '256-bit SSL encryption and PCI compliance ensures your data is safe.',
      color: 'from-green-600 to-emerald-600',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Our platform loads in milliseconds. Shop without waiting.',
      color: 'from-yellow-600 to-orange-600',
    },
    {
      icon: Users,
      title: 'Expert Support',
      description: '24/7 customer support via chat, email, or phone. We\'re here to help.',
      color: 'from-rose-600 to-pink-600',
    },
  ];

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Why Choose Us?
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Experience the difference with our world-class platform designed for your shopping pleasure
        </p>
      </div>

      {/* Main Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-down">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={32} className="text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">{feature.description}</p>

              {/* Learn More Link */}
              <Link
                href="#"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 font-bold hover:text-primary-700 dark:hover:text-primary-300 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Learn more →
              </Link>
            </div>
          );
        })}
      </div>

      {/* Feature Highlight Section */}
      <div className="space-y-12">
        {/* Highlight 1: Personalization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-slide-up">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Personalized Shopping Experience
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Our advanced AI algorithm learns your preferences and recommends products tailored to your taste. Every time you visit, we surface deals and items you&apos;ll love.
            </p>
            <ul className="space-y-3">
              {[
                'Smart product recommendations',
                'Personalized email newsletters',
                'Wishlist and saved items',
                'Price drop notifications',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-primary-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all">
              Start Shopping
            </button>
          </div>
          <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-6xl">🎯</div>
          </div>
        </div>

        {/* Highlight 2: Quality Assurance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-slide-up">
          <div className="bg-gradient-to-br from-success-100 to-emerald-100 rounded-2xl h-96 flex items-center justify-center order-last md:order-first">
            <div className="text-6xl">✓</div>
          </div>
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Quality Assurance Guaranteed
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Every product is verified for authenticity and quality. We work directly with brands and authorized sellers to ensure you get genuine products.
            </p>
            <ul className="space-y-3">
              {[
                '100% authentic products',
                'Brand-authorized sellers',
                'Quality inspections',
                'Counterfeit protection',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-success-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 border-2 border-success-600 text-success-600 rounded-lg font-bold hover:bg-success-50 transition-colors">
              Browse Collections
            </button>
          </div>
        </div>

        {/* Highlight 3: Community */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center animate-slide-up">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              Join Our Global Community
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with millions of shoppers worldwide. Read reviews, share your experiences, and help others make informed purchasing decisions.
            </p>
            <ul className="space-y-3">
              {[
                'Read verified reviews',
                'Share your feedback',
                'Earn rewards for reviews',
                'Help other shoppers',
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-gray-700">
                  <span className="w-2 h-2 bg-warning-600 rounded-full" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all">
              Join Community
            </button>
          </div>
          <div className="bg-gradient-to-br from-warning-100 to-orange-100 rounded-2xl h-96 flex items-center justify-center">
            <div className="text-6xl">👥</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-slide-up">
        {[
          { number: '50K+', label: 'Products' },
          { number: '2M+', label: 'Happy Customers' },
          { number: '15K+', label: 'Reviews' },
          { number: '4.9★', label: 'Rating' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-6 text-center border border-primary-200 animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</p>
            <p className="text-gray-600 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-slide-up">
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">How We Compare</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Us</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Competitor A</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Competitor B</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Free Shipping', us: true, a: false, b: false },
                { name: '24/7 Support', us: true, a: true, b: false },
                { name: '30-Day Returns', us: true, a: true, b: true },
                { name: 'Price Match', us: true, a: false, b: false },
                { name: 'Loyalty Rewards', us: true, a: true, b: true },
                { name: 'Same-Day Delivery', us: true, a: false, b: true },
              ].map((row, index) => (
                <tr
                  key={row.name}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors animate-slide-down ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-success-600 font-bold">✓</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.a ? (
                      <span className="text-success-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300 font-bold">✗</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {row.b ? (
                      <span className="text-success-600 font-bold">✓</span>
                    ) : (
                      <span className="text-gray-300 font-bold">✗</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center space-y-8 animate-slide-up">
        <h2 className="text-4xl md:text-5xl font-bold text-white">
          Experience the Difference
        </h2>
        <p className="text-white/90 text-xl max-w-2xl mx-auto">
          Join millions of happy customers who trust us for their shopping needs
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg hover-lift transition-all">
            Start Shopping Now
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 animate-slide-up">
        {[
          { icon: Award, label: 'Award Winning' },
          { icon: Shield, label: 'Secure & Safe' },
          { icon: Users, label: 'Trusted by Millions' },
        ].map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.label}
              className="text-center p-6 animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Icon size={32} className="mx-auto text-primary-600 mb-2" />
              <p className="font-bold text-gray-900">{badge.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
