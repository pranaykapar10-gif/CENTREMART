'use client';

import { useState } from 'react';
import { Heart, Share2, Star, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductDetailProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  description: string;
  features: string[];
  specifications: Record<string, string>;
  inStock: boolean;
  reviews?: Array<{
    id: string;
    author: string;
    rating: number;
    title: string;
    content: string;
    date: Date;
    verified: boolean;
  }>;
}

/**
 * Enhanced Product Detail Page
 */
export function ProductDetail({
  name,
  price,
  originalPrice,
  rating,
  reviewCount,
  images,
  description,
  features,
  specifications,
  inStock,
  reviews = [],
}: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'description' | 'reviews' | 'specs'>('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsAddingToCart(false);
  };

  return (
    <div className="space-y-12">
      {/* Product Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group animate-fade-in">
            <Image
              src={images[selectedImageIndex]}
              alt={name}
              width={600}
              height={600}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-error-600 to-error-700 dark:from-error-500 dark:to-error-600 text-white px-4 py-2 rounded-lg font-bold text-lg shadow-lg dark:shadow-gray-950 animate-fade-in">
                −{discount}% OFF
              </div>
            )}

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-lg dark:shadow-gray-950"
                  disabled={selectedImageIndex === 0}
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} aria-hidden="true" />
                </button>
                <button
                  onClick={() => setSelectedImageIndex(Math.min(images.length - 1, selectedImageIndex + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-lg dark:shadow-gray-950"
                  disabled={selectedImageIndex === images.length - 1}
                  aria-label="Next image"
                >
                  <ChevronRight size={24} aria-hidden="true" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 ${
                    selectedImageIndex === index ? 'border-primary-600 dark:border-primary-500 scale-105 shadow-lg dark:shadow-gray-950' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  aria-label={`View image ${index + 1}`}
                  aria-current={selectedImageIndex === index}
                >
                  <Image
                    src={image}
                    alt={`${name} view ${index + 1}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6 animate-slide-up">
          {/* Title & Rating */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(rating) ? 'fill-warning-500 dark:fill-warning-400 text-warning-500 dark:text-warning-400' : 'text-gray-300 dark:text-gray-600'}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-gray-600 dark:text-gray-400 font-medium">
                {rating.toFixed(1)} · {reviewCount} verified reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">${price.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <p className="text-sm text-success-600 font-semibold">
              Free shipping on orders over $50
            </p>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Truck className="text-primary-600" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-gray-600">2-3 business days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="text-success-600" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">Secure Checkout</p>
                <p className="text-gray-600">100% protected</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="text-secondary-600" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">30-Day Returns</p>
                <p className="text-gray-600">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-warning-600" size={20} />
              <div className="text-sm">
                <p className="font-semibold text-gray-900">In Stock</p>
                <p className="text-gray-600">{inStock ? 'Ships today' : 'Coming soon'}</p>
              </div>
            </div>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 border-gray-200 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  −
                </button>
                <div className="px-6 py-2 font-semibold">{quantity}</div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className="w-full py-4 px-6 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isAddingToCart ? (
                <>
                  <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                  Adding to cart...
                </>
              ) : (
                'Add to Cart'
              )}
            </button>

            <div className="flex gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFavorite
                    ? 'bg-error-100 text-error-600 hover:bg-error-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Heart size={20} className={isFavorite ? 'fill-current' : ''} />
                {isFavorite ? 'Saved' : 'Save'}
              </button>

              <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-semibold transition-all flex items-center justify-center gap-2">
                <Share2 size={20} />
                Share
              </button>
            </div>
          </div>

          {/* Stock Status */}
          {!inStock && (
            <div className="p-4 bg-warning-50 border border-warning-200 rounded-xl flex items-center gap-2">
              <X className="text-warning-600" size={20} />
              <p className="text-warning-700 font-semibold">Currently out of stock. Notify me when available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-8">
          {(['description', 'reviews', 'specs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`py-4 px-2 font-semibold transition-colors border-b-2 -mb-[2px] ${
                selectedTab === tab
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {selectedTab === 'description' && (
          <div className="space-y-6">
            <p className="text-lg text-gray-600 leading-relaxed">{description}</p>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="text-success-600 flex-shrink-0 mt-1" size={20} />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {selectedTab === 'reviews' && (
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.title}</p>
                      <p className="text-sm text-gray-600">by {review.author}</p>
                    </div>
                    {review.verified && (
                      <span className="px-3 py-1 bg-success-100 text-success-700 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < review.rating ? 'fill-warning-500 text-warning-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-3">{review.content}</p>
                  <p className="text-xs text-gray-500">{review.date.toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 py-8">No reviews yet. Be the first to review!</p>
            )}
          </div>
        )}

        {selectedTab === 'specs' && (
          <div className="space-y-4">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 last:border-0">
                <p className="font-semibold text-gray-900">{key}</p>
                <p className="col-span-2 text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related Products */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <Link
              key={item}
              href={`/products/${item}`}
              className="group bg-white rounded-2xl shadow-base hover:shadow-lg transition-all overflow-hidden animate-slide-up"
              style={{ animationDelay: `${item * 100}ms` }}
            >
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 line-clamp-2 mb-2">Related Product</p>
                <p className="text-lg font-bold text-primary-600">$49.99</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
