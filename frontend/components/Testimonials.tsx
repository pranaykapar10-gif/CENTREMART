'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  author: string;
  role?: string;
  content: string;
  rating: number;
  image?: string;
}

export default function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      author: 'Sarah Johnson',
      role: 'Tech Enthusiast',
      content:
        'Outstanding quality products and lightning-fast shipping! The customer service team went above and beyond to help me find the perfect accessories. Highly recommended!',
      rating: 5,
    },
    {
      id: 2,
      author: 'Michael Chen',
      role: 'Business Owner',
      content:
        'Been ordering from here for over a year. Consistent quality, competitive prices, and they always have the latest products. This is my go-to store now.',
      rating: 5,
    },
    {
      id: 3,
      author: 'Emma Davis',
      role: 'Student',
      content:
        'Love the variety and the prices are unbeatable! Found everything I needed in one place. The delivery was faster than expected too.',
      rating: 4,
    },
    {
      id: 4,
      author: 'James Wilson',
      role: 'Professional',
      content:
        'Premium quality headphones at fair prices. The product description was accurate and the build quality is exceptional. Worth every penny!',
      rating: 5,
    },
    {
      id: 5,
      author: 'Lisa Martinez',
      role: 'Gamer',
      content:
        'Great selection of gaming accessories. The cables are durable and the chargers are super fast. Will definitely buy again!',
      rating: 5,
    },
    {
      id: 6,
      author: 'David Park',
      role: 'Photographer',
      content:
        'Found all my tech needs here. The prices are competitive and the quality is consistent. Their support team is also very responsive.',
      rating: 4,
    },
  ];

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (Math.ceil(testimonials.length / 3) || 1));
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlay, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (Math.ceil(testimonials.length / 3) || 1));
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      (prev - 1 + Math.ceil(testimonials.length / 3)) % (Math.ceil(testimonials.length / 3) || 1)
    );
    setIsAutoPlay(false);
  };

  const testimonialsPerSlide = 3;
  const visibleTestimonials = testimonials.slice(
    currentSlide * testimonialsPerSlide,
    (currentSlide + 1) * testimonialsPerSlide
  );

  return (
    <section className="py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
            Loved by Our Customers
          </h2>
          <p className="text-gray-600 text-lg">See what people are saying about us</p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Quote Icon */}
                <div className="mb-4">
                  <Quote className="w-8 h-8 text-blue-400 opacity-60" />
                </div>

                {/* Content */}
                <p className="text-gray-700 leading-relaxed mb-6 text-base">&quot;{testimonial.content}&quot;</p>

                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < testimonial.rating ? 'text-yellow-400 text-lg' : 'text-gray-300 text-lg'}
                    >
                      ★
                    </span>
                  ))}
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-blue-200">
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  {testimonial.role && <p className="text-sm text-gray-500">{testimonial.role}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition z-10 hover:scale-110 transform"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition z-10 hover:scale-110 transform"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-10">
            {[...Array(Math.ceil(testimonials.length / testimonialsPerSlide))].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrentSlide(i);
                  setIsAutoPlay(false);
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  i === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600 mb-1">50K+</p>
            <p className="text-gray-600 text-sm">Happy Customers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600 mb-1">4.8★</p>
            <p className="text-gray-600 text-sm">Average Rating</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600 mb-1">2M+</p>
            <p className="text-gray-600 text-sm">Products Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-black text-blue-600 mb-1">24/7</p>
            <p className="text-gray-600 text-sm">Customer Support</p>
          </div>
        </div>
      </div>
    </section>
  );
}
