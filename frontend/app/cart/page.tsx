'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = getTotalPrice();
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) / 100 : 0;
  const shippingCost = subtotal > 50 ? 0 : 9.99;
  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = () => {
    if (couponCode === 'SAVE10') {
      setAppliedCoupon({ code: couponCode, discount: 10 });
      setCouponCode('');
    } else if (couponCode === 'SAVE20') {
      setAppliedCoupon({ code: couponCode, discount: 20 });
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-black text-gray-900 mb-8">Shopping Cart</h1>
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>
            <Link
              href="/shop"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center gap-2"
            >
              Continue Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-black text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 font-bold text-gray-900">
                {items.length} Item{items.length !== 1 ? 's' : ''} in Cart
              </div>

              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.productId} className="p-6 flex gap-4 hover:bg-gray-50 transition">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                      {item.image || '📦'}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <Link href={`/product/${item.productId}`} className="hover:text-blue-600">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{item.name}</h3>
                      </Link>
                      <p className="text-blue-600 font-bold text-lg">${item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Control */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-fit">
                      <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                      <p className="font-bold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button */}
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <Link
                  href="/shop"
                  className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-2"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-4">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <label className="text-sm font-bold text-gray-900 mb-2 block">Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedCoupon && (
                  <p className="text-green-600 text-sm mt-2 font-bold">
                    {appliedCoupon.code}: {appliedCoupon.discount}% off applied ✓
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Discount</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>{shippingCost === 0 ? 'Shipping (FREE)' : 'Shipping'}</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-black text-gray-900">Total</span>
                  <span className="text-3xl font-black text-blue-600">${total.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-500 text-center">
                  {shippingCost === 0 ? 'Free shipping on this order!' : 'Free shipping on orders over $50'}
                </p>
              </div>

              {/* Checkout Buttons */}
              <Link
                href="/checkout"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition block text-center mb-3"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={() => clearCart()}
                className="w-full border-2 border-red-300 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 transition"
              >
                Clear Cart
              </button>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <span className="font-bold">💳</span> Secure checkout with Stripe. Your payment info is safe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
