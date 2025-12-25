'use client';

import { useState } from 'react';
import { Gift, Copy, Check, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Gift Card Redemption Component
 */
export function GiftCardRedemptionEnhanced() {
  const [giftCode, setGiftCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeemed, setRedeemed] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRedeem = () => {
    if (giftCode.trim().length > 0) {
      setRedeemed(true);
      setGiftCode('');
    }
  };

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Gift Cards
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          The perfect gift for anyone. Redeemable on thousands of products with no expiration date.
        </p>
      </div>

      {/* Quick Redeem Section */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 md:p-12 border-2 border-primary-200 dark:border-gray-700 animate-slide-down">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
            <Gift size={32} className="text-primary-600 dark:text-primary-400" />
            Redeem Your Gift Card
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Enter Gift Card Code
              </label>
              <input
                type="text"
                value={giftCode}
                onChange={(e) => setGiftCode(e.target.value.toUpperCase())}
                placeholder="Enter 16-digit code or scan barcode"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus-ring font-mono text-lg tracking-widest transition-all"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                Your code is usually on the back of your gift card
              </p>
            </div>

            <button
              onClick={handleRedeem}
              className="w-full py-3 bg-gradient-primary dark:bg-gradient-to-r dark:from-primary-600 dark:to-secondary-600 text-white rounded-lg font-bold hover-lift transition-all"
            >
              Redeem Gift Card
            </button>

            {redeemed && (
              <div className="p-4 bg-success-50 dark:bg-success-900/20 border-2 border-success-200 dark:border-success-800 rounded-lg flex items-start gap-3 animate-slide-down">
                <Check size={20} className="text-success-600 dark:text-success-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-success-900 dark:text-success-300">Gift Card Redeemed!</p>
                  <p className="text-sm text-success-800 dark:text-success-200">$50.00 has been added to your account balance.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">How Gift Cards Work</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Buy',
              description: 'Choose a gift card denomination and purchase',
            },
            {
              step: '2',
              title: 'Send',
              description: 'Send digitally or print for a physical card',
            },
            {
              step: '3',
              title: 'Redeem',
              description: 'Recipient enters code at checkout',
            },
            {
              step: '4',
              title: 'Enjoy',
              description: 'Shop from 50,000+ products',
            },
          ].map((item, index) => (
            <div
              key={item.step}
              className="text-center p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-primary text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3 text-lg">
                {item.step}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Card Options */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Choose Your Amount</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { amount: '$25', popular: false },
            { amount: '$50', popular: true },
            { amount: '$100', popular: false },
            { amount: '$250', popular: false },
          ].map((card, index) => (
            <button
              key={card.amount}
              className={`relative p-6 rounded-xl font-bold text-xl transition-all hover-lift animate-slide-down ${
                card.popular
                  ? 'bg-gradient-primary text-white shadow-lg scale-105'
                  : 'bg-white border-2 border-gray-200 text-gray-900 hover:border-primary-300'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {card.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Most Popular
                </div>
              )}
              {card.amount}
            </button>
          ))}
        </div>

        <button className="w-full py-4 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all">
          Buy Gift Card
        </button>
      </div>

      {/* Sample Gift Cards */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Popular Gift Cards</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Digital Gift Card',
              description: 'Instant delivery via email',
              icon: '💌',
              features: ['Instant delivery', 'Digital only', 'No activation fee', 'Never expires'],
            },
            {
              title: 'Physical Gift Card',
              description: 'Premium printed card',
              icon: '💳',
              features: ['Free shipping', 'Premium design', '3-5 day delivery', 'Perfect gift'],
            },
            {
              title: 'Custom Gift Card',
              description: 'Personalized message included',
              icon: '✉️',
              features: ['Personal message', 'Custom design', 'Select delivery date', 'Premium packaging'],
            },
          ].map((type, index) => (
            <div
              key={type.title}
              className="p-6 bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="text-5xl mb-3">{type.icon}</p>
              <h3 className="font-bold text-gray-900 mb-1">{type.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{type.description}</p>

              <ul className="space-y-2 mb-4">
                {type.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-success-600" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className="w-full py-2 border-2 border-primary-600 text-primary-600 rounded-lg font-bold hover:bg-primary-50 transition-colors">
                Shop Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Example Codes Section */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Gift Cards</h2>

        <div className="space-y-4">
          {[
            { code: '1234-5678-9ABC-DEF0', balance: '$50.00', status: 'Active' },
            { code: '9876-5432-1XYZ-QWER', balance: '$25.00', status: 'Active' },
            { code: '5555-4444-3333-2222', balance: '$0.00', status: 'Used' },
          ].map((card, index) => (
            <div
              key={card.code}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex-1">
                <p className="font-mono font-bold text-gray-900 mb-1">{card.code}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-600">Balance: {card.balance}</span>
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs ${
                      card.status === 'Active'
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {card.status}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleCopy(card.code)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {copied ? (
                  <Check size={20} className="text-success-600" />
                ) : (
                  <Copy size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Gift Card FAQ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Do gift cards expire?',
              a: 'No! Our gift cards never expire. You can use them anytime.',
            },
            {
              q: 'Can I check my balance?',
              a: 'Yes! Check your balance in your account settings or at checkout.',
            },
            {
              q: 'Can I transfer my gift card?',
              a: 'Digital gift cards can be forwarded to someone else. Physical cards are non-transferable.',
            },
            {
              q: 'What if I lose my code?',
              a: 'Contact support with your email, and we&apos;ll help you recover it.',
            },
            {
              q: 'Can I get a refund for my gift card?',
              a: 'Gift cards are non-refundable but can be used for any products on our platform.',
            },
            {
              q: 'Do you offer bulk gift cards?',
              a: 'Yes! Contact our sales team for corporate or bulk gift card pricing.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <p className="font-bold text-gray-900 mb-2">{item.q}</p>
              <p className="text-sm text-gray-600">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-white space-y-8 animate-slide-up">
        <h2 className="text-4xl font-bold">Why Choose Our Gift Cards?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Zap, title: 'Instant Delivery', desc: 'Digital cards arrive in seconds' },
            { icon: TrendingUp, title: 'No Fees', desc: 'No hidden charges or expiration dates' },
            { icon: Gift, title: 'Perfect Gift', desc: 'Works for everyone on your list' },
          ].map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="text-center animate-slide-down"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon size={32} className="mx-auto mb-3 opacity-80" />
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-white/80 text-sm">{benefit.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA Section */}
      <div className="text-center space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Ready to Give the Perfect Gift?</h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-gradient-primary text-white rounded-lg font-bold hover-lift transition-all">
            Buy Gift Card Now
          </button>
          <Link
            href="/contact"
            className="px-8 py-3 border-2 border-gray-300 text-gray-900 rounded-lg font-bold hover:border-primary-600 hover:bg-primary-50 transition-all"
          >
            Contact Sales
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-center animate-slide-up">
        {[
          { emoji: '💯', text: '100% Secure' },
          { emoji: '⚡', text: 'Instant Delivery' },
          { emoji: '∞', text: 'Never Expires' },
        ].map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <span className="font-semibold text-gray-900">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
