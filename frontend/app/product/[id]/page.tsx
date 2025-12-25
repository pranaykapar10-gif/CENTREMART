'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Share2, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { apiGet, apiPost } from '@/lib/api';
import ReviewsSection from '@/components/ReviewsSection';

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
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'shipping'>('description');
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const response = await apiGet<ProductDetail>(`/api/products/${params.id}`);
      if (response.success && response.data) {
        const data = response.data;
        if (typeof data.specifications === 'string') {
          try { data.specifications = JSON.parse(data.specifications); } catch { data.specifications = {}; }
        }
        if (!data.specifications) data.specifications = {};
        
        if (typeof data.images === 'string') {
          try { data.images = JSON.parse(data.images); } catch { data.images = ['📦']; }
        }
        if (!data.images || data.images.length === 0) data.images = ['📦'];

        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedColor(data.variants[0].color);
          if (data.variants[0].sizes && data.variants[0].sizes.length > 0) {
            setSelectedSize(data.variants[0].sizes[0]);
          }
        }
      }
      setLoading(false);
    };

    const checkWishlist = async () => {
      const response = await apiGet<{ isWishlisted: boolean }>(`/api/wishlist/check/${params.id}`);
      if (response.success && response.data) {
        setIsWishlisted(response.data.isWishlisted);
      }
    };

    fetchProduct();
    checkWishlist();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: product.id.toString(),
      productId: product.id.toString(),
      quantity,
      name: product.name,
      price: product.discount_price || product.price,
    });
  };

  const toggleWishlist = async () => {
    if (isWishlisted) {
      const response = await apiPost(`/api/wishlist/remove`, { productId: params.id });
      if (response.success) setIsWishlisted(false);
    } else {
      const response = await apiPost(`/api/wishlist/add`, { productId: params.id });
      if (response.success) setIsWishlisted(true);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading product...</div>;
  if (!product) return <div className="min-h-screen flex items-center justify-center">Product not found</div>;

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
              {product.images[activeImageIndex].startsWith('http') ? (
                <img src={product.images[activeImageIndex]} alt={product.name} className="object-contain h-full w-full" />
              ) : (
                <span className="text-8xl">{product.images[activeImageIndex]}</span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-24 bg-gray-100 rounded-lg flex items-center justify-center text-4xl border-2 transition overflow-hidden ${
                    activeImageIndex === idx ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  {img.startsWith('http') ? (
                    <img src={img} alt={`${product.name} ${idx}`} className="object-cover h-full w-full" />
                  ) : (
                    img
                  )}
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
                {Number(product.rating).toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-4 mb-2">
                <span className="text-4xl font-black text-gray-900">
                  ${(Number(product.discount_price) || Number(product.price)).toFixed(2)}
                </span>
                {product.discount_price && (
                  <span className="text-lg line-through text-gray-500">${Number(product.price).toFixed(2)}</span>
                )}
              </div>
              {product.discount_price && (
                <div className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Save {Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}%
                </div>
              )}
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

            {/* Color Selector (Mocked if not in data) */}
            {(product.variants || []).length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.variants?.map((variant) => (
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
            )}

            {/* Size Selector (Mocked if not in data) */}
            {(product.variants || []).length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Size</h3>
                <div className="flex gap-3">
                  {product.variants?.find((v) => v.color === selectedColor)?.sizes.map((size) => (
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
            )}

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
                className="flex-1 bg-purple-600 text-white font-bold py-4 rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <button
                onClick={toggleWishlist}
                className={`px-6 py-4 rounded-lg border-2 transition ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-600'
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
              <ReviewsSection 
                productId={product.id.toString()}
                productName={product.name}
                initialAverageRating={product.rating}
                initialTotalReviews={product.review_count}
              />
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
