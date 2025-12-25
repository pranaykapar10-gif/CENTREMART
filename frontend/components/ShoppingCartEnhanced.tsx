'use client';

import { useState, useCallback } from 'react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  maxStock?: number;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity?: (id: string, quantity: number) => void;
  onRemoveItem?: (id: string) => void;
  onCheckout?: () => void;
}

/**
 * Enhanced Shopping Cart with smooth animations
 */
export function ShoppingCartEnhanced({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) {
  const [removingItem, setRemovingItem] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleUpdateQuantity = useCallback(
    (id: string, newQuantity: number) => {
      if (newQuantity > 0) {
        onUpdateQuantity?.(id, newQuantity);
      }
    },
    [onUpdateQuantity]
  );

  const handleRemoveItem = useCallback(
    async (id: string) => {
      setRemovingItem(id);
      await new Promise((resolve) => setTimeout(resolve, 300));
      onRemoveItem?.(id);
      setRemovingItem(null);
    },
    [onRemoveItem]
  );

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    await onCheckout?.();
    setIsCheckoutLoading(false);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4" role="main" aria-label="Shopping cart empty state">
        <div className="w-24 h-24 bg-gradient-to-br from-primary-100 dark:from-primary-900/30 to-primary-50 dark:to-primary-900/10 rounded-full flex items-center justify-center mb-6 animate-float">
          <ShoppingBag size={48} className="text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Cart is Empty</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Start shopping to add items to your cart</p>
        <Link
          href="/products"
          className="px-6 py-3 bg-gradient-primary dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-700 text-white rounded-xl font-semibold hover-lift transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Items */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-base dark:shadow-gray-950 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`p-6 transition-all duration-300 animate-slide-down ${
                removingItem === item.id
                  ? 'opacity-0 translate-x-full'
                  : 'opacity-100 translate-x-0'
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              <div className="flex gap-6">
                {/* Product Image */}
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0 group">
                  <Image
                    src={item.image}
                    alt={`${item.name} - product image`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                    <p className="text-primary-600 dark:text-primary-400 font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label={`Decrease quantity of ${item.name}`}
                    >
                      <Minus size={16} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                    </button>

                    <div className="w-12 text-center font-semibold text-gray-900 dark:text-gray-100" aria-live="polite" aria-label={`Quantity: ${item.quantity}`}>
                      {item.quantity}
                    </div>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={!!(item.maxStock && item.quantity >= item.maxStock)}
                      className="p-1.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      aria-label={`Increase quantity of ${item.name}`}
                    >
                      <Plus size={16} className="text-gray-600 dark:text-gray-400" aria-hidden="true" />
                    </button>

                    <div className="flex-1" />

                    {/* Total Price */}
                    <div className="text-right">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Subtotal</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 rounded-lg text-error-600 dark:text-error-400 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors duration-200 ml-4"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Summary Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-base dark:shadow-gray-950 p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h3>

          <div className="space-y-4 border-t border-b border-gray-200 dark:border-gray-700 py-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Subtotal</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Shipping</span>
              <span className="font-semibold text-success-600 dark:text-success-400">FREE</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Tax (10%)</span>
              <span className="font-semibold text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-6">
            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-primary-600 dark:from-primary-400 to-secondary-600 dark:to-secondary-400 bg-clip-text text-transparent">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handleCheckout}
            disabled={isCheckoutLoading}
            className="w-full py-4 px-6 bg-gradient-primary dark:bg-gradient-to-r dark:from-primary-600 dark:to-primary-700 text-white rounded-xl font-bold hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
          >
            {isCheckoutLoading ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                Processing...
              </>
            ) : (
              <>
                Checkout
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <Link
            href="/products"
            className="w-full py-4 px-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 rounded-xl font-bold hover:border-primary-600 dark:hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 text-center"
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* Promo Code */}
      <div className="bg-gradient-to-r from-primary-50 dark:from-primary-900/20 to-secondary-50 dark:to-secondary-900/20 rounded-2xl p-8 border border-primary-200 dark:border-primary-800/50">
        <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Have a Promo Code?</h4>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 rounded-xl border border-gray-300 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 focus:outline-none focus-ring transition-all duration-200"
          />
          <button className="px-6 py-3 bg-primary-600 dark:bg-primary-700 text-white rounded-xl font-semibold hover-lift transition-all duration-300">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
