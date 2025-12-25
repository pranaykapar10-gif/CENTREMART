'use client';

import { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simple email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Mock API call - replace with real endpoint
      const response = await fetch('http://localhost:4000/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setIsSuccess(true);
      setEmail('');

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-24 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse" />

      <div className="relative max-w-4xl mx-auto z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-3">
            Stay Updated with Exclusive Deals
          </h2>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Subscribe to our newsletter and get 15% off your first purchase. Plus, stay in the loop about new
            products and special offers!
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-2xl">
          {isSuccess ? (
            // Success Message
            <div className="flex flex-col items-center justify-center py-8">
              <div className="bg-green-100 rounded-full p-4 mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Welcome to our newsletter!</h3>
              <p className="text-gray-600 text-center mb-6">
                We&apos;ve sent a confirmation email to <span className="font-semibold">{email}</span>
              </p>
              <p className="text-green-600 font-semibold">Check your inbox for your 15% discount code!</p>
            </div>
          ) : (
            // Form
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className={`w-full px-6 py-4 rounded-xl border-2 transition-colors focus:outline-none ${
                      error
                        ? 'border-red-500 focus:border-red-600 bg-red-50'
                        : 'border-gray-300 focus:border-blue-500 bg-white'
                    }`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap hover:scale-105 transform"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Subscribe
                    </>
                  )}
                </button>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

              {/* Benefits */}
              <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  15% discount on first order
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Exclusive early access to sales
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  Unsubscribe anytime
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Privacy Note */}
        <p className="text-center text-white/70 text-sm mt-6">
          We respect your privacy. Unsubscribe anytime. No spam, we promise.
        </p>
      </div>
    </section>
  );
}
