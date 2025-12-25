'use client';

import { useWishlist, type WishlistItem } from '@/hooks/useWishlist';
import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem: addToCart } = useCart();

  const handleAddToCart = (item: WishlistItem) => {
    addToCart({
      id: Math.random().toString(36).substring(7),
      productId: item.productId,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Your Wishlist is Empty</h1>
          <p className="text-gray-600 mb-6">Save items you love and come back to them anytime</p>
          <Link href="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">My Wishlist</h1>
            <p className="text-gray-600 mt-1">{items.length} items saved</p>
          </div>
          {items.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded-lg transition"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.productId} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition">
              {/* Product Image */}
              <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 h-48 flex items-center justify-center">
                <div className="text-6xl">📦</div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="absolute top-3 right-3 bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-full transition"
                >
                  <Heart size={20} className="fill-red-600" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <Link href={`/product/${item.productId}`}>
                  <h3 className="font-bold text-gray-900 hover:text-blue-600 transition mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                </Link>

                <div className="mb-4">
                  <p className="text-2xl font-black text-blue-600">${item.price.toFixed(2)}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-2 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/shop" className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
