'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, Zap, Shield, Truck, Star, TrendingUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Animated Hero Section for Landing Page
 */
export function HeroSection() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 dark:from-gray-950 via-white dark:via-gray-900 to-secondary-50 dark:to-gray-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orb 1 */}
        <div
          className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200 dark:bg-primary-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          aria-hidden="true"
        />

        {/* Gradient orb 2 */}
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary-200 dark:bg-secondary-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-float"
          style={{
            transform: `translateY(${scrollY * -0.3}px)`,
            animationDelay: '2s',
          }}
          aria-hidden="true"
        />

        {/* Gradient orb 3 */}
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-warning-200 dark:bg-warning-900/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"
          style={{
            transform: `translate(${scrollY * 0.3}px, ${scrollY * 0.2}px)`,
            animationDelay: '4s',
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full border border-primary-200 dark:border-primary-800 mb-6 animate-fade-in shadow-lg dark:shadow-gray-950 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-shadow duration-300">
          <Zap size={16} className="text-warning-600 dark:text-warning-400 animate-pulse" aria-hidden="true" />
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ✨ Now with AI-Powered Recommendations
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-gray-100 mb-6 animate-slide-up leading-tight tracking-tight">
          Shop Smarter,{' '}
          <span className="bg-gradient-to-r from-primary-600 via-secondary-600 dark:from-primary-400 dark:via-secondary-400 to-primary-600 dark:to-primary-400 bg-clip-text text-transparent animate-gradient-shift bg-300% opacity-100">
            Live Better
          </span>
        </h1>

        {/* Description */}
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto animate-slide-up leading-relaxed font-medium">
          Discover thousands of hand-picked products. Lightning-fast shipping, 256-bit secure checkout, and hassle-free 30-day returns.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up">
          <Link
            href="/products"
            className="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white rounded-xl font-bold text-lg hover-lift transition-all duration-300 flex items-center justify-center gap-2 group shadow-lg dark:shadow-gray-950 hover:shadow-2xl dark:hover:shadow-gray-900/50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Start Shopping
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
              aria-hidden="true"
            />
          </Link>

          <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-bold text-lg hover:border-primary-600 dark:hover:border-primary-500 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all duration-300 shadow-md dark:shadow-gray-950 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            Learn More
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Truck,
              title: 'Free Shipping',
              description: 'On orders over $50',
            },
            {
              icon: Shield,
              title: 'Secure Checkout',
              description: 'Bank-level encryption',
            },
            {
              icon: Star,
              title: '30-Day Returns',
              description: 'No questions asked',
            },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 animate-slide-up group"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 dark:from-primary-500 dark:to-secondary-500 rounded-lg flex items-center justify-center text-white mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium">{feature.description}</p>
              </div>
            );
          })}
        </div>

        {/* Social Proof */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 animate-fade-in shadow-lg dark:shadow-gray-950 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-shadow duration-300">
          <p className="text-gray-600 dark:text-gray-400 mb-4 font-medium">✨ Trusted by 5M+ customers worldwide</p>

          <div className="flex items-center justify-center gap-2 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={20}
                className="fill-warning-500 dark:fill-warning-400 text-warning-500 dark:text-warning-400"
                aria-hidden="true"
              />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-100">4.8★</p>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Average Rating</p>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gray-200" />

            <div>
              <p className="text-4xl font-bold text-gray-900">2M+</p>
              <p className="text-gray-600 text-sm">Happy Customers</p>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gray-200" />

            <div>
              <p className="text-4xl font-bold text-gray-900">50K+</p>
              <p className="text-gray-600 text-sm">Products</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-gray-600">
          <span className="text-sm font-semibold">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex items-start justify-center pt-2">
            <div className="w-1 h-2 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Features Showcase Section
 */
export function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: 'Smart Recommendations',
      description: 'AI-powered suggestions based on your preferences',
      color: 'primary',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized checkout in under 60 seconds',
      color: 'warning',
    },
    {
      icon: Shield,
      title: 'Always Secure',
      description: 'Military-grade encryption on all transactions',
      color: 'success',
    },
    {
      icon: Truck,
      title: 'Quick Delivery',
      description: 'Real-time tracking and free shipping',
      color: 'secondary',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
          Why Choose Us?
        </h2>
        <p className="text-xl text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          Experience the next generation of online shopping with our cutting-edge platform
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClasses: Record<string, string> = {
              primary: 'bg-primary-100 text-primary-600',
              secondary: 'bg-secondary-100 text-secondary-600',
              success: 'bg-success-100 text-success-600',
              warning: 'bg-warning-100 text-warning-600',
            };

            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary-600 hover:shadow-lg transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`w-14 h-14 ${
                    colorClasses[feature.color as keyof typeof colorClasses]
                  } rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={28} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="text-primary-600 font-semibold text-sm hover:text-primary-700 transition-colors flex items-center gap-1">
                    Learn more <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * CTA Section
 */
export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-slide-up">
          Ready to Start Shopping?
        </h2>
        <p className="text-xl text-white/80 mb-8 animate-slide-up">
          Join millions of customers enjoying the best online shopping experience
        </p>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-bold text-lg hover-lift transition-all duration-300 group animate-slide-up"
        >
          Start Shopping Now
          <ArrowRight
            size={20}
            className="group-hover:translate-x-1 transition-transform"
          />
        </Link>
      </div>
    </section>
  );
}
