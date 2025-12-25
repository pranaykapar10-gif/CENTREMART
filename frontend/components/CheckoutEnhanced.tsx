'use client';

import { useState } from 'react';
import { Check, Lock, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Checkout Component
 */
export function CheckoutEnhanced() {
  const [currentStep, setCurrentStep] = useState<'shipping' | 'payment' | 'review'>(
    'shipping'
  );
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  const steps = ['shipping', 'payment', 'review'] as const;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handlePrevStep = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Progress Steps */}
      <div className="animate-slide-down">
        <div className="flex items-center justify-between mb-4">
          {steps.map((step, index) => {
            const stepIndex = steps.indexOf(step);
            const currentIndex = steps.indexOf(currentStep);
            const isComplete = stepIndex < currentIndex;
            const isCurrent = stepIndex === currentIndex;

            return (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-12 h-12 rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 shadow-lg dark:shadow-gray-950 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-500 dark:to-primary-600 text-white scale-110'
                      : isComplete
                        ? 'bg-success-600 dark:bg-success-700 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {isComplete ? <Check size={20} aria-hidden="true" /> : index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-2 mx-2 transition-all duration-300 rounded-full ${
                      isComplete ? 'bg-success-600 dark:bg-success-700' : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-semibold">
          {steps.map((step) => (
            <span key={step} className="capitalize">
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6 animate-slide-up">
          {/* Shipping Step */}
          {currentStep === 'shipping' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800 animate-fade-in space-y-6 shadow-lg dark:shadow-gray-950 hover:shadow-xl dark:hover:shadow-gray-900/50 transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Truck size={24} className="text-primary-600 dark:text-primary-400" aria-hidden="true" />
                Shipping Address
              </h2>

              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg dark:text-white dark:placeholder-gray-400 focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus-ring transition-all"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Street address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                />

                <div className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                  <input
                    type="text"
                    name="zip"
                    placeholder="ZIP code"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                </div>

                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                </select>
              </div>

              <button
                onClick={handleNextStep}
                className="w-full py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Payment Step */}
          {currentStep === 'payment' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-200 animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Lock size={24} className="text-primary-600" />
                Payment Method
              </h2>

              <div className="space-y-4">
                {/* Credit Card Option */}
                <label className="flex items-center p-4 border-2 border-primary-600 rounded-lg cursor-pointer bg-primary-50 hover:bg-primary-100 transition-colors">
                  <input type="radio" name="payment" value="card" defaultChecked className="w-4 h-4" />
                  <span className="ml-3 font-bold text-gray-900">Credit Card</span>
                </label>

                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary-600 focus:outline-none focus-ring transition-all"
                  />
                </div>

                {/* Other Payment Options */}
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input type="radio" name="payment" value="paypal" className="w-4 h-4" />
                  <span className="ml-3 font-bold text-gray-900">PayPal</span>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input type="radio" name="payment" value="apple" className="w-4 h-4" />
                  <span className="ml-3 font-bold text-gray-900">Apple Pay</span>
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all"
                >
                  Review Order
                </button>
              </div>
            </div>
          )}

          {/* Review Step */}
          {currentStep === 'review' && (
            <div className="bg-white rounded-2xl p-8 border-2 border-primary-200 animate-fade-in space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck size={24} className="text-success-600" />
                Review Order
              </h2>

              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-700 mb-2">Shipping Address</h3>
                  <p className="text-gray-600 text-sm">
                    {formData.firstName} {formData.lastName}
                  </p>
                  <p className="text-gray-600 text-sm">{formData.address}</p>
                  <p className="text-gray-600 text-sm">
                    {formData.city}, {formData.state} {formData.zip}
                  </p>
                </div>

                <div className="pb-4 border-b border-gray-200">
                  <h3 className="font-bold text-gray-700 mb-3">Order Items</h3>
                  {[1, 2].map((item, index) => (
                    <div key={item} className="flex justify-between mb-2 animate-slide-down" style={{ animationDelay: `${index * 50}ms` }}>
                      <p className="text-gray-600">Product {item}</p>
                      <p className="font-bold text-gray-900">${(29.99 + item * 10).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">$69.98</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-bold">$9.99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-bold">$6.40</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-primary-600">$86.37</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handlePrevStep}
                  className="flex-1 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button className="flex-1 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all flex items-center justify-center gap-2">
                  <Lock size={18} />
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="sticky top-8 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-6">
            <h3 className="font-bold text-xl text-gray-900">Order Summary</h3>

            <div className="space-y-3">
              {[1, 2, 3].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 animate-slide-down"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Product {item}</p>
                    <p className="text-xs text-gray-600">Qty: 1</p>
                  </div>
                  <p className="font-bold text-gray-900">${(29.99 + item * 10).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold">$99.97</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-bold">$9.99</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-bold">$8.76</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 flex justify-between">
              <span className="font-bold text-lg text-gray-900">Total</span>
              <span className="text-2xl font-bold text-primary-600">$118.72</span>
            </div>

            <Link href="/cart" className="w-full py-2 text-center text-primary-600 hover:text-primary-700 font-bold text-sm">
              Edit Cart
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 animate-slide-up">
        {[
          { icon: '🔒', label: 'Secure Checkout' },
          { icon: '✓', label: 'Money Back' },
          { icon: '🚚', label: 'Fast Shipping' },
        ].map((badge, index) => (
          <div
            key={badge.label}
            className="text-center animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <p className="text-3xl mb-2">{badge.icon}</p>
            <p className="text-sm font-bold text-gray-900">{badge.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
