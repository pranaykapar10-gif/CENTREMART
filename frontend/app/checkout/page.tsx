'use client';

import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Package, Truck, CreditCard, CheckCircle } from 'lucide-react';

interface ShippingAddress {
  fullName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

interface CheckoutData {
  shippingAddress: ShippingAddress;
  billingAddress: ShippingAddress | null;
  shippingMethod: 'standard' | 'express' | 'overnight';
  paymentMethod: 'card' | 'paypal';
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form data
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    shippingAddress: {
      fullName: '',
      email: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
    },
    billingAddress: null,
    shippingMethod: 'standard',
    paymentMethod: 'card',
  });

  const [billingDifferent, setBillingDifferent] = useState(false);

  // Redirect if no items
  if (items.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-32 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h1 className="text-3xl font-black text-gray-900 mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add items before checking out</p>
          <Link href="/shop" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      shippingAddress: { ...prev.shippingAddress, [name]: value },
    }));
  };

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckoutData((prev) => ({
      ...prev,
      billingAddress: { ...(prev.billingAddress || prev.shippingAddress), [name]: value },
    }));
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      const { fullName, email, address, city, state, zipCode, phone } = checkoutData.shippingAddress;
      return !!(fullName && email && address && city && state && zipCode && phone && email.includes('@'));
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep()) {
      if (step < 4) {
        setStep(step + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity,
          price: item.price,
          name: item.name,
          sku: item.sku || ''
        })),
        shipping_address: {
          line1: checkoutData.shippingAddress.address,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          zip: checkoutData.shippingAddress.zipCode,
          country: 'Nepal'
        },
        payment_method: checkoutData.paymentMethod === 'card' ? 'card' : 'cod',
        subtotal,
        shipping_cost: shippingCost,
        tax_amount: tax,
        total_amount: total,
        customer_notes: ''
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Failed to place order');

      const data = await res.json();
      clearCart();
      router.push(`/order-success?id=${data.orderNumber}`);
    } catch (error) {
      console.error('Order Error:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost =
    checkoutData.shippingMethod === 'standard' ? 9.99 : checkoutData.shippingMethod === 'express' ? 19.99 : 29.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingCost + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Step {step} of 4</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12 grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="relative">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg transition-all ${
                  s <= step
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 text-gray-900'
                }`}
              >
                {s < step ? '✓' : s}
              </div>
              <div className="text-center mt-2 text-sm font-semibold text-gray-700">
                {s === 1 && 'Shipping'}
                {s === 2 && 'Billing'}
                {s === 3 && 'Payment'}
                {s === 4 && 'Review'}
              </div>
              {s < 4 && (
                <div
                  className={`absolute top-6 -right-2 w-full h-1 transition-all ${
                    s < step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {step === 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Truck size={28} className="text-blue-600" />
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      value={checkoutData.shippingAddress.fullName}
                      onChange={handleAddressChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={checkoutData.shippingAddress.email}
                      onChange={handleAddressChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={checkoutData.shippingAddress.phone}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />

                  <input
                    type="text"
                    name="address"
                    placeholder="Street Address"
                    value={checkoutData.shippingAddress.address}
                    onChange={handleAddressChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      name="city"
                      placeholder="City"
                      value={checkoutData.shippingAddress.city}
                      onChange={handleAddressChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="state"
                      placeholder="State"
                      value={checkoutData.shippingAddress.state}
                      onChange={handleAddressChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={checkoutData.shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex gap-4">
                  <button
                    onClick={handleNextStep}
                    disabled={!validateStep()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    Continue to Billing <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Billing & Shipping Method */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Billing Address */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Billing Address</h2>

                  <div className="flex items-center gap-3 mb-4">
                    <input
                      id="billingDifferent"
                      type="checkbox"
                      checked={billingDifferent}
                      onChange={(e) => setBillingDifferent(e.target.checked)}
                      className="w-4 h-4 rounded"
                    />
                    <label htmlFor="billingDifferent" className="text-gray-700 font-semibold">
                      Same as shipping address
                    </label>
                  </div>

                  {billingDifferent && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="fullName"
                          placeholder="Full Name"
                          value={checkoutData.billingAddress?.fullName || ''}
                          onChange={handleBillingAddressChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email"
                          value={checkoutData.billingAddress?.email || ''}
                          onChange={handleBillingAddressChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                      <input
                        type="text"
                        name="address"
                        placeholder="Street Address"
                        value={checkoutData.billingAddress?.address || ''}
                        onChange={handleBillingAddressChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={checkoutData.billingAddress?.city || ''}
                          onChange={handleBillingAddressChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State"
                          value={checkoutData.billingAddress?.state || ''}
                          onChange={handleBillingAddressChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          name="zipCode"
                          placeholder="ZIP Code"
                          value={checkoutData.billingAddress?.zipCode || ''}
                          onChange={handleBillingAddressChange}
                          className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping Method */}
                <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Method</h2>

                  <div className="space-y-3">
                    {[
                      { value: 'standard', label: 'Standard Shipping', price: '$9.99', time: '5-7 business days' },
                      { value: 'express', label: 'Express Shipping', price: '$19.99', time: '2-3 business days' },
                      { value: 'overnight', label: 'Overnight Shipping', price: '$29.99', time: 'Next business day' },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                      >
                        <input
                          type="radio"
                          name="shippingMethod"
                          value={option.value}
                          checked={checkoutData.shippingMethod === option.value}
                          onChange={(e) =>
                            setCheckoutData((prev) => ({
                              ...prev,
                              shippingMethod: e.target.value as 'standard' | 'express' | 'overnight',
                            }))
                          }
                          className="w-4 h-4 rounded-full"
                        />
                        <div className="ml-4 flex-1">
                          <p className="font-bold text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-600">{option.time}</p>
                        </div>
                        <p className="font-bold text-gray-900">{option.price}</p>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    Continue to Payment <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard size={28} className="text-blue-600" />
                  Payment Method
                </h2>

                <div className="space-y-4 mb-8">
                  <label className="flex items-center p-4 border border-blue-300 bg-blue-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={checkoutData.paymentMethod === 'card'}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value as 'card' | 'paypal',
                        }))
                      }
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="ml-3 font-bold text-gray-900">Credit / Debit Card</span>
                  </label>

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={checkoutData.paymentMethod === 'paypal'}
                      onChange={(e) =>
                        setCheckoutData((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value as 'card' | 'paypal',
                        }))
                      }
                      className="w-4 h-4 rounded-full"
                    />
                    <span className="ml-3 font-bold text-gray-900">PayPal</span>
                  </label>
                </div>

                {checkoutData.paymentMethod === 'card' && (
                  <div className="space-y-4 mb-8">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                  >
                    Review Order <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Confirm */}
            {step === 4 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <CheckCircle size={28} className="text-green-600" />
                  Review Your Order
                </h2>

                <div className="space-y-6 mb-8">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-gray-600 text-sm">
                      {checkoutData.shippingAddress.fullName}
                      <br />
                      {checkoutData.shippingAddress.address}
                      <br />
                      {checkoutData.shippingAddress.city}, {checkoutData.shippingAddress.state}{' '}
                      {checkoutData.shippingAddress.zipCode}
                    </p>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-bold text-gray-900 mb-3">Order Items</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.productId} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handlePrevStep}
                    className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 border-b pb-4 mb-4 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="font-semibold text-gray-900">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (10%)</span>
                  <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold text-gray-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
