'use client';

import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

/**
 * Enhanced Testimonials Component
 */
export function TestimonialsEnhanced() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Designer',
      company: 'Tech Startup',
      text: 'This platform has completely transformed how I shop online. The user experience is incredibly smooth, and I love the personalized recommendations!',
      rating: 5,
      image: '👩‍💼',
      verified: true,
    },
    {
      name: 'Mike Chen',
      role: 'Entrepreneur',
      company: 'E-commerce',
      text: 'Best shopping experience I&apos;ve ever had. Fast checkout, excellent customer service, and the prices are unbeatable!',
      rating: 5,
      image: '👨‍💼',
      verified: true,
    },
    {
      name: 'Emma Davis',
      role: 'Student',
      company: 'University',
      text: 'Found everything I needed in just minutes. The search functionality is amazing, and delivery was super fast!',
      rating: 5,
      image: '👩‍🎓',
      verified: true,
    },
    {
      name: 'James Wilson',
      role: 'Freelancer',
      company: 'Creative Agency',
      text: 'Great quality products at reasonable prices. I&apos;ve recommended this to all my friends and family!',
      rating: 5,
      image: '👨‍🔧',
      verified: true,
    },
    {
      name: 'Lisa Anderson',
      role: 'Marketing Manager',
      company: 'Retail Corp',
      text: 'Outstanding shopping experience. The notifications keep me updated on my orders, and the returns process is hassle-free!',
      rating: 5,
      image: '👩‍💻',
      verified: true,
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
    testimonials[(currentIndex + 2) % testimonials.length],
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4 animate-slide-up">
        <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Loved by Millions Worldwide
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Join millions of satisfied customers who trust us for their shopping needs
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={24} className="fill-warning-500 text-warning-500 dark:fill-warning-400 dark:text-warning-400" />
          ))}
          <span className="font-bold text-gray-900 dark:text-gray-100 ml-2">4.9 out of 5</span>
          <span className="text-gray-600 dark:text-gray-400">(15,000+ reviews)</span>
        </div>
      </div>

      {/* Testimonials Carousel */}
      <div className="relative animate-slide-down">
        {/* Main Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTestimonials.map((testimonial, index) => {
            const isCenter = index === 0;
            return (
              <div
                key={`${testimonial.name}-${index}`}
                className={`transition-all duration-500 animate-slide-up ${
                  isCenter
                    ? 'md:scale-105 md:col-span-2 lg:col-span-1 lg:scale-100'
                    : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div
                  className={`h-full rounded-2xl p-8 transition-all border-2 ${
                    isCenter
                      ? 'bg-gradient-to-br from-primary-50 to-secondary-50 border-primary-300 shadow-2xl'
                      : 'bg-white border-gray-200 hover:shadow-lg'
                  }`}
                >
                  {/* Quote Icon */}
                  <Quote
                    size={32}
                    className={`mb-4 ${
                      isCenter ? 'text-primary-600' : 'text-gray-300'
                    }`}
                  />

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className="fill-warning-500 text-warning-500"
                      />
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p
                    className={`mb-6 leading-relaxed ${
                      isCenter
                        ? 'text-gray-900 font-medium text-lg'
                        : 'text-gray-600'
                    }`}
                  >
                    &quot;{testimonial.text}&quot;
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                        isCenter
                          ? 'bg-primary-200'
                          : 'bg-gray-200'
                      }`}
                    >
                      {testimonial.image}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={`font-bold ${
                            isCenter
                              ? 'text-gray-900'
                              : 'text-gray-900'
                          }`}
                        >
                          {testimonial.name}
                        </p>
                        {testimonial.verified && (
                          <span className="text-success-600 font-bold text-sm">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={handlePrev}
            className="p-3 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-primary-600 transition-all hover-lift"
          >
            <ChevronLeft size={20} className="text-gray-900" />
          </button>

          {/* Dots Indicator */}
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex
                    ? 'bg-primary-600 w-8'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="p-3 bg-white border-2 border-gray-300 rounded-full hover:bg-gray-50 hover:border-primary-600 transition-all hover-lift"
          >
            <ChevronRight size={20} className="text-gray-900" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-200 animate-slide-up">
        {[
          { icon: '📦', number: '500K+', label: 'Products Sold' },
          { icon: '⭐', number: '15K+', label: 'Reviews' },
          { icon: '😊', number: '2M+', label: 'Happy Customers' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="text-center p-6 bg-gray-50 rounded-xl animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-4xl mb-2">{stat.icon}</p>
            <p className="text-3xl font-bold text-primary-600 mb-1">{stat.number}</p>
            <p className="text-gray-600 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-white text-center space-y-6 animate-slide-up">
        <h3 className="text-3xl md:text-4xl font-bold">
          Ready to Join the Community?
        </h3>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Start shopping today and discover why millions of customers love us
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg hover-lift transition-all">
            Start Shopping
          </button>
          <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 animate-slide-up">
        {[
          { emoji: '🏆', text: 'Award Winning' },
          { emoji: '🔒', text: 'Secure Payments' },
          { emoji: '🚀', text: 'Fast Shipping' },
          { emoji: '💯', text: '100% Authentic' },
        ].map((badge, index) => (
          <div
            key={badge.text}
            className="text-center p-4 bg-gray-50 rounded-lg animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-3xl mb-2">{badge.emoji}</p>
            <p className="text-sm font-bold text-gray-900">{badge.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
