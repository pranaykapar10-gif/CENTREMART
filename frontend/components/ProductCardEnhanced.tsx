'use client';

import { useState } from 'react';
import { Heart, ShoppingCart, Star, Badge, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  inStock: boolean;
  isFavorite?: boolean;
  onAddToCart?: () => void;
  onToggleFavorite?: () => void;
  category?: string;
}

/**
 * Modern ProductCard with smooth animations and micro-interactions
 */
export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  badge,
  inStock,
  isFavorite = false,
  onAddToCart,
  onToggleFavorite,
  category,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const handleFavorite = async () => {
    setIsFavLoading(true);
    await onToggleFavorite?.();
    setIsFavLoading(false);
  };

  const handleAddToCart = async () => {
    setIsCartLoading(true);
    await onAddToCart?.();
    setTimeout(() => setIsCartLoading(false), 1000);
  };

  return (
    <Link href={`/products/${id}`}>
      <article
        className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-base dark:shadow-gray-950 hover-shadow dark:hover:shadow-gray-900/50 transition-smooth cursor-pointer h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="listitem"
      >
        {/* Image Container */}
        <div className="relative overflow-hidden bg-gray-100 dark:bg-gray-700 aspect-square">
          <Image
            src={image}
            alt={`${name} - Product image`}
            width={400}
            height={400}
            className={`w-full h-full object-cover transition-smooth duration-500 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Overlay Gradient on Hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 flex gap-2 flex-wrap">
            {badge && (
              <div className="inline-flex items-center gap-1.5 bg-gradient-primary text-white px-3 py-1.5 rounded-full text-xs font-semibold animate-fade-in" aria-label={`Badge: ${badge}`}>
                <Zap size={14} aria-hidden="true" />
                {badge}
              </div>
            )}

            {discount > 0 && (
              <div className="inline-flex items-center gap-1 bg-gradient-error text-white px-3 py-1.5 rounded-full text-xs font-semibold" aria-label={`Discount: ${discount} percent off`}>
                <Badge size={14} aria-hidden="true" />
                {discount}% OFF
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleFavorite();
            }}
            className={`absolute top-4 right-4 p-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
              isFavorite
                ? 'bg-error-500 dark:bg-error-600 text-white scale-100'
                : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-600'
            }`}
            disabled={isFavLoading}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-pressed={isFavorite}
          >
            <Heart
              size={20}
              className={`transition-transform ${
                isFavLoading ? 'animate-pulse' : ''
              } ${isFavorite ? 'fill-current' : ''}`}
            />
          </button>

          {/* In Stock Badge */}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-1 p-4">
          {/* Category */}
          {category && (
            <span className="text-xs font-medium text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wider">
              {category}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-gray-900 dark:text-gray-100 line-clamp-2 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
            {name}
          </h3>

          {/* Rating */}
          {rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={
                      i < Math.floor(rating)
                        ? 'fill-warning-500 text-warning-500'
                        : 'text-gray-300 dark:text-gray-600'
                    }
                  />
                ))}
              </div>
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {rating.toFixed(1)} ({reviewCount || 0})
              </span>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              ${price.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart();
            }}
            disabled={!inStock || isCartLoading}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              !inStock
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-primary dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-700 text-white hover:shadow-lg dark:hover:shadow-primary-900/50 hover-lift disabled:opacity-75'
            }`}
          >
            <ShoppingCart size={18} className={isCartLoading ? 'animate-bounce' : ''} />
            {isCartLoading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Shine Effect on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 transition-opacity duration-500 ${
            isHovered ? 'opacity-20' : ''
          }`}
          style={{
            animation: isHovered ? 'shimmer 2s infinite' : 'none',
          }}
        />
      </article>
    </Link>
  );
}

/**
 * Product Grid with staggered animation
 */
export function ProductGrid({
  products,
  columns = 4,
}: {
  products: ProductCardProps[];
  columns?: number;
}) {
  return (
    <div
      className={`grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns} auto-rows-max`}
      role="list"
      aria-label="Product listing"
    >
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 50}ms`,
          }}
        >
          <ProductCard {...product} />
        </div>
      ))}
    </div>
  );
}
