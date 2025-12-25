'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface ProductDetail {
  id: number;
  name: string;
  price: number;
  discount_price?: number;
  rating: number;
  review_count: number;
  description: string;
  specifications: Record<string, string>;
  images: string[];
  variants: Array<{ color: string; sizes: string[] }>;
  inStock: boolean;
  sku: string;
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('Black');
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const { addItem } = useCart();

  const product: ProductDetail = {
    id: parseInt(params.id || '1', 10),
    name: 'Premium Wireless Headphones Pro',
    price: 299.99,
    discount_price: 199.99,
    rating: 4.8,
    review_count: 1250,
    description:
      'Experience premium sound quality with our flagship wireless headphones. Featuring active noise cancellation, 40-hour battery life, and premium comfort for all-day wear.',
    specifications: {
      'Driver Size': '40mm',
      'Frequency Response': '20Hz - 20kHz',
      'Battery Life': '40 hours',
      'Charging Time': '2 hours',
      'Bluetooth Version': '5.0',
      'Weight': '250g',
    },
    images: ['🎧', '🔊', '🎵', '🎚️'],
    variants: [
      { color: 'Black', sizes: ['S', 'M', 'L', 'XL'] },
      { color: 'Silver', sizes: ['M', 'L', 'XL'] },
      { color: 'Gold', sizes: ['S', 'M', 'L'] },
    ],
    inStock: true,
    sku: 'WH-PRO-001',
  };

  const reviews = [
    { id: 1, author: 'Alex P.', date: '1 week ago', rating: 5, comment: 'Amazing sound and comfort.' },
    { id: 2, author: 'Jamie L.', date: '2 weeks ago', rating: 5, comment: 'Battery lasts forever.' },
    { id: 3, author: 'Taylor R.', date: '3 weeks ago', rating: 4, comment: 'Great ANC for the price.' },
  ];

  const handleAddToCart = () => {
    addItem({
      id: product.id.toString(),
      productId: product.id.toString(),
      quantity,
      name: product.name,
      price: product.discount_price || product.price,
    });
  };

  const relatedProducts = Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    name: `Related Product ${i + 1}`,
    price: 99.99 + i * 20,
    rating: 4.5 + (i % 5) * 0.1,
  }));

  return (
    <main className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              Home
            </Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-900">
              Shop
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="relative bg-gray-100 rounded-lg overflow-hidden mb-4 h-96 flex items-center justify-center">
              <span className="text-8xl">{product.images[activeImageIndex]}</span>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl border-2 transition ${
                    activeImageIndex === idx ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  {img}
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.review_count} reviews)
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-gray-900">
                  ${product.discount_price?.toFixed(2) || product.price.toFixed(2)}
                </span>
                {product.discount_price && (
                  <span className="text-lg line-through text-gray-500">${product.price.toFixed(2)}</span>
                )}
              </div>
              {product.discount_price && (
                <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save {Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Color Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Color</h3>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedColor(variant.color)}
                    className={`px-4 py-2 rounded-lg border-2 transition ${
                      selectedColor === variant.color
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Size</h3>
              <div className="flex gap-3">
                {product.variants.find((v) => v.color === selectedColor)?.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-lg border-2 font-semibold transition ${
                      selectedSize === size
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-8 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                  In Stock
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`px-6 py-4 rounded-lg border-2 font-bold transition ${
                  isWishlisted
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button className="px-6 py-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 font-bold">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* SKU */}
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          </div>
        </div>

        {/* Specifications & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-12 border-y border-gray-200">
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Specifications</h2>
            <div className="space-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600">{key}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Why Choose This?</h2>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-600">Premium build quality and durability</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-600">Industry-leading warranty coverage</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-600">Free shipping on all orders</span>
              </li>
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">✓</span>
                <span className="text-gray-600">30-day money-back guarantee</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-8">
          <div className="flex border-b border-gray-200">
            {(['description', 'reviews', 'shipping'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-4 px-6 font-bold transition capitalize ${
                  activeTab === tab
                    ? 'text-purple-600 border-b-2 border-purple-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === 'description' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Description</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Key Features</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    Premium quality materials
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    Carefully crafted design
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    Eco-friendly packaging
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-purple-600 font-bold">✓</span>
                    Lifetime warranty
                  </li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">{review.author}</p>
                          <p className="text-sm text-gray-600">{review.date}</p>
                        </div>
                        <div className="text-yellow-400">{'★'.repeat(review.rating)}</div>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
                <button className="mt-8 w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition">
                  Write a Review
                </button>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shipping Information</h3>
                <div className="space-y-4 text-gray-700">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Standard Shipping (FREE)</h4>
                    <p>Delivery within 5-7 business days</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Express Shipping ($9.99)</h4>
                    <p>Delivery within 2-3 business days</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">Overnight Shipping ($19.99)</h4>
                    <p>Delivery within 24 hours</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 mb-16">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p, idx) => (
              <Link key={p.id} href="/shop" className="group">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-purple-400 hover:shadow-lg transition h-full">
                  <div className="bg-gradient-to-br from-purple-400 to-blue-500 h-48 flex items-center justify-center text-white text-4xl">
                    {idx + 1}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 line-clamp-2 group-hover:text-purple-600 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-lg font-bold text-purple-600">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
