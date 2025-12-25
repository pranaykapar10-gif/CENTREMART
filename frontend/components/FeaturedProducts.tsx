'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  image_url?: string;
  rating?: number;
  review_count?: number;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    // Fetch featured products from API
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products?limit=6');
        const data = await response.json();
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching products:', error);
        // Mock data for development
        setProducts([
          {
            id: 1,
            name: 'Premium Wireless Headphones',
            price: 129.99,
            discount_price: 99.99,
            rating: 4.8,
            review_count: 245,
          },
          {
            id: 2,
            name: 'Ultra-Fast Charger',
            price: 49.99,
            discount_price: 34.99,
            rating: 4.6,
            review_count: 182,
          },
          {
            id: 3,
            name: 'Portable Power Bank',
            price: 39.99,
            discount_price: 29.99,
            rating: 4.7,
            review_count: 320,
          },
          {
            id: 4,
            name: 'Premium Phone Case',
            price: 29.99,
            rating: 4.5,
            review_count: 145,
          },
          {
            id: 5,
            name: 'USB-C Cable 3Pack',
            price: 19.99,
            discount_price: 14.99,
            rating: 4.4,
            review_count: 512,
          },
          {
            id: 6,
            name: 'Screen Protector Pack',
            price: 24.99,
            rating: 4.3,
            review_count: 268,
          },
        ]);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4));
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlay, products.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(products.length / 4));
    setIsAutoPlay(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(products.length / 4)) % Math.ceil(products.length / 4));
    setIsAutoPlay(false);
  };

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      productId: product.id,
      quantity: 1,
      name: product.name,
      price: product.discount_price || product.price,
    });
  };

  const productsPerSlide = 4;
  const visibleProducts = products.slice(
    currentSlide * productsPerSlide,
    (currentSlide + 1) * productsPerSlide
  );

  return (
    <section id="featured" className="py-24 px-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-gray-100 mb-2">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">Explore our best-selling items</p>
          </div>
          <Link
            href="/shop"
            className="mt-4 md:mt-0 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold flex items-center gap-2"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlay(false)}
          onMouseLeave={() => setIsAutoPlay(true)}
        >
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-xl overflow-hidden bg-white border border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-6xl">📦</span>
                  </div>

                  {/* Discount Badge */}
                  {product.discount_price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                      -
                      {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="p-3 bg-white rounded-full hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      <ShoppingCart className="w-6 h-6" />
                    </button>
                    <button className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  {product.rating && (
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={i < Math.floor(product.rating!) ? 'text-yellow-400' : 'text-gray-300'}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">({product.review_count})</span>
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-gray-900">
                      ${(product.discount_price || product.price).toFixed(2)}
                    </span>
                    {product.discount_price && (
                      <span className="text-sm line-through text-gray-400">${product.price.toFixed(2)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Pagination Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {[...Array(Math.ceil(products.length / productsPerSlide))].map((_, i) => (
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
      </div>
    </section>
  );
}
