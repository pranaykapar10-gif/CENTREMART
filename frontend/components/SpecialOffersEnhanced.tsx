'use client';

import { Flame, Gift, Clock, ChevronRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Special Offers Component
 */
export function SpecialOffersEnhanced() {
  const timeLeft = { hours: 2, minutes: 45, seconds: 30 };

  const offers = [
    {
      type: 'Flash Sale',
      title: 'Electronics Mega Sale',
      discount: '70% OFF',
      description: 'Limited time offer on selected electronics',
      image: '💻',
      color: 'from-blue-600 to-cyan-600',
      items: 24,
      endsIn: '2h 45m',
    },
    {
      type: 'Bundle Deal',
      title: 'Fashion Bundle Pack',
      discount: 'Buy 2 Get 1 Free',
      description: 'On selected clothing and accessories',
      image: '👗',
      color: 'from-rose-600 to-pink-600',
      items: 156,
      endsIn: '1d 5h',
    },
    {
      type: 'Exclusive Deal',
      title: 'Member Only Offer',
      discount: '50% OFF',
      description: 'For Prime members only',
      image: '⭐',
      color: 'from-purple-600 to-violet-600',
      items: 89,
      endsIn: '5 days',
    },
    {
      type: 'Limited Stock',
      title: 'Clearance Items',
      discount: 'Up to 85% OFF',
      description: 'While supplies last',
      image: '🔥',
      color: 'from-orange-600 to-yellow-600',
      items: 342,
      endsIn: '3 days',
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Unbeatable Offers
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Limited time deals you won&apos;t find anywhere else. Save big on your favorite products.
        </p>
      </div>

      {/* Featured Flash Sale */}
      <div className="bg-gradient-to-r from-error-600 to-warning-600 dark:from-error-700 dark:to-warning-700 rounded-2xl p-8 md:p-12 text-white space-y-8 animate-slide-down">
        <div className="flex items-center gap-4 mb-4">
          <Flame size={32} className="animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-bold">Today&apos;s Flash Sale</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sale Info */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">Crazy Deals Now Live!</h3>
            <p className="text-white/90 dark:text-white/80 leading-relaxed">
              Get up to 80% off on thousands of items. These deals won&apos;t last long!
            </p>
            <button className="px-6 py-3 bg-white dark:bg-gray-800 text-error-600 dark:text-white rounded-lg font-bold hover:shadow-lg transition-all hover-lift">
              Shop Now
            </button>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white/10 dark:bg-white/5 backdrop-blur rounded-lg p-6 text-center">
            <p className="text-white/80 dark:text-white/70 mb-3 font-semibold">Sale Ends In</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Minutes' },
                { value: timeLeft.seconds, label: 'Seconds' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/20 dark:bg-white/10 rounded-lg p-2"
                >
                  <p className="text-2xl font-bold">{String(item.value).padStart(2, '0')}</p>
                  <p className="text-xs text-white/80 dark:text-white/70">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products Preview */}
          <div>
            <p className="text-white/80 mb-3 font-semibold">Top Sellers This Hour</p>
            <div className="space-y-2">
              {[
                { name: 'Wireless Headphones', off: '65%' },
                { name: 'Smartwatch', off: '50%' },
                { name: 'Portable Charger', off: '45%' },
              ].map((item) => (
                <div key={item.name} className="flex justify-between items-center bg-white/10 p-2 rounded">
                  <span className="text-sm">{item.name}</span>
                  <span className="font-bold">{item.off}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-up">
        {offers.map((offer, index) => (
          <Link
            key={offer.title}
            href="#"
            className="group relative rounded-2xl overflow-hidden cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${offer.color} opacity-90 group-hover:opacity-100 transition-opacity duration-300`} />

            {/* Content */}
            <div className="relative p-8 text-white h-full flex flex-col justify-between min-h-64">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-2 mb-4 bg-white/20 px-3 py-1 rounded-full">
                  <span className="text-sm font-bold">{offer.type}</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-2">{offer.title}</h3>
                <p className="text-white/80 mb-4">{offer.description}</p>
              </div>

              {/* Discount & Details */}
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold mb-2">{offer.discount}</p>
                  <div className="flex items-center gap-2 text-sm text-white/80">
                    <Clock size={16} />
                    <span>Ends in {offer.endsIn}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-3xl mb-1">{offer.image}</p>
                  <p className="text-xs text-white/80">{offer.items} items</p>
                </div>
              </div>

              {/* Hover Arrow */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={24} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Category Deals */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Deals by Category</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Electronics', savings: 'Save up to 70%' },
            { name: 'Fashion', savings: 'Up to 60% off' },
            { name: 'Home', savings: '50% discount' },
            { name: 'Beauty', savings: 'Buy 2 get 1 free' },
            { name: 'Sports', savings: 'Save $100+' },
            { name: 'Books', savings: '40% off' },
            { name: 'Toys', savings: 'BOGO 50%' },
            { name: 'Food', savings: 'Free shipping' },
          ].map((category, index) => (
            <Link
              key={category.name}
              href="#"
              className="p-4 bg-gray-50 rounded-lg hover:bg-primary-50 border border-gray-200 hover:border-primary-300 transition-all hover-lift animate-slide-down"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="font-bold text-gray-900 mb-1">{category.name}</p>
              <p className="text-sm text-primary-600 font-semibold">{category.savings}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Coupon Codes */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 border-2 border-primary-200 animate-slide-up">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Gift size={32} className="text-primary-600" />
            Exclusive Promo Codes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { code: 'SAVE20', discount: '20% off sitewide', min: 'Min. $50' },
              { code: 'WELCOME15', discount: '15% off first order', min: 'New customers' },
              { code: 'SHIP50', discount: 'Free shipping on $50+', min: 'No min. purchase' },
              { code: 'HOLIDAY25', discount: '25% off select items', min: 'Ends today' },
              { code: 'VIP30', discount: '30% off for members', min: 'Members only' },
              { code: 'FLASH40', discount: '40% off flash items', min: 'Limited time' },
            ].map((coupon, index) => (
              <div
                key={coupon.code}
                className="bg-white rounded-lg p-6 hover:shadow-lg transition-all border-l-4 border-primary-600 animate-slide-down"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className="font-mono font-bold text-lg text-primary-600 mb-2">{coupon.code}</p>
                <p className="text-gray-900 font-semibold mb-2">{coupon.discount}</p>
                <p className="text-xs text-gray-600">{coupon.min}</p>
                <button className="mt-3 px-4 py-2 bg-primary-100 text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-200 transition-colors w-full">
                  Copy Code
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to Maximize Savings */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">How to Save More</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { step: '1', title: 'Join Prime', desc: 'Get exclusive deals and free shipping' },
            { step: '2', title: 'Set Alerts', desc: 'Get notified when prices drop' },
            { step: '3', title: 'Stack Codes', desc: 'Combine multiple promo codes' },
            { step: '4', title: 'Earn Points', desc: 'Use points for future purchases' },
          ].map((tip, index) => (
            <div
              key={tip.step}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all animate-slide-down text-center"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-4 text-lg">
                {tip.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{tip.title}</h3>
              <p className="text-sm text-gray-600">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center space-y-6 animate-slide-up">
        <h2 className="text-3xl md:text-4xl font-bold">Never Miss a Deal</h2>
        <p className="text-white/90 max-w-2xl mx-auto">
          Subscribe to our newsletter for exclusive offers and early access to flash sales
        </p>

        <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-900"
          />
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg hover-lift transition-all">
            Subscribe
          </button>
        </form>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-center animate-slide-up">
        {[
          { icon: '✓', text: 'Verified Deals' },
          { icon: '✓', text: 'Best Prices' },
          { icon: '✓', text: 'Instant Coupon' },
        ].map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl text-success-600">{badge.icon}</span>
            <span className="font-semibold text-gray-900">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
