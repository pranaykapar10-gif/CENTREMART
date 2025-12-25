'use client';

import { Check, X } from 'lucide-react';
import Link from 'next/link';

/**
 * Enhanced Pricing Component
 */
export function PricingEnhanced() {
  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for occasional shoppers',
      price: 'Free',
      period: '',
      badge: null,
      features: [
        { name: 'Access to all products', included: true },
        { name: 'Standard shipping', included: true },
        { name: 'Email support', included: true },
        { name: 'Order tracking', included: true },
        { name: 'Return assistance', included: true },
        { name: 'Priority support', included: false },
        { name: 'Free shipping', included: false },
        { name: 'Exclusive deals', included: false },
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      name: 'Prime',
      description: 'For regular shoppers',
      price: '$99',
      period: 'per year',
      badge: 'Most Popular',
      features: [
        { name: 'Access to all products', included: true },
        { name: 'Standard shipping', included: true },
        { name: 'Email support', included: true },
        { name: 'Order tracking', included: true },
        { name: 'Return assistance', included: true },
        { name: 'Priority support', included: true },
        { name: 'Free shipping', included: true },
        { name: 'Exclusive deals', included: true },
      ],
      cta: 'Subscribe Now',
      highlighted: true,
    },
    {
      name: 'Elite',
      description: 'For power users',
      price: '$199',
      period: 'per year',
      badge: null,
      features: [
        { name: 'Access to all products', included: true },
        { name: 'Standard shipping', included: true },
        { name: 'Email support', included: true },
        { name: 'Order tracking', included: true },
        { name: 'Return assistance', included: true },
        { name: 'Priority support', included: true },
        { name: 'Free shipping', included: true },
        { name: 'Exclusive deals', included: true },
      ],
      cta: 'Subscribe Now',
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose the perfect plan for your shopping needs. No hidden fees, cancel anytime.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-down">
        {plans.map((plan, index) => (
          <div
            key={plan.name}
            className={`relative rounded-2xl transition-all animate-slide-up ${
              plan.highlighted
                ? 'md:scale-105 border-2 border-primary-600 shadow-2xl dark:shadow-gray-950'
                : 'border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg dark:hover:shadow-gray-900/50'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                {plan.badge}
              </div>
            )}

            {/* Card Content */}
            <div className={`p-8 h-full flex flex-col ${
              plan.highlighted ? 'bg-gradient-to-br from-primary-50 to-secondary-50' : 'bg-white'
            }`}>
              {/* Plan Name */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className={`text-5xl font-bold ${
                    plan.highlighted ? 'text-primary-600' : 'text-gray-900'
                  }`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600">{plan.period}</span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <button
                className={`w-full py-3 rounded-lg font-bold mb-8 transition-all hover-lift ${
                  plan.highlighted
                    ? 'bg-gradient-primary text-white hover:shadow-lg'
                    : 'border-2 border-gray-300 text-gray-900 hover:border-primary-600 hover:bg-primary-50'
                }`}
              >
                {plan.cta}
              </button>

              {/* Features */}
              <div className="space-y-4 flex-1">
                {plan.features.map((feature) => (
                  <div
                    key={feature.name}
                    className="flex items-center gap-3"
                  >
                    {feature.included ? (
                      <Check size={20} className="text-success-600 flex-shrink-0" />
                    ) : (
                      <X size={20} className="text-gray-300 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included ? 'text-gray-900 font-medium' : 'text-gray-400'
                      }`}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 animate-slide-up">
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900">Detailed Comparison</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left font-bold text-gray-900">Feature</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Starter</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Prime</th>
                <th className="px-6 py-4 text-center font-bold text-gray-900">Elite</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Product Access', starter: true, prime: true, elite: true },
                { name: 'Shipping', starter: 'Standard', prime: 'Free 2-Day', elite: 'Free Express' },
                { name: 'Support', starter: 'Email', prime: 'Priority Phone', elite: '24/7 Concierge' },
                { name: 'Returns', starter: '30 days', prime: '60 days', elite: '90 days' },
                { name: 'Exclusive Deals', starter: false, prime: true, elite: true },
                { name: 'Birthday Discount', starter: false, prime: '10%', elite: '20%' },
                { name: 'Price Match', starter: false, prime: false, elite: true },
              ].map((row, index) => (
                <tr
                  key={row.name}
                  className={`border-b border-gray-200 hover:bg-gray-50 transition-colors animate-slide-down ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{row.name}</td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.starter === 'boolean' ? (
                      row.starter ? (
                        <Check size={20} className="mx-auto text-success-600" />
                      ) : (
                        <X size={20} className="mx-auto text-gray-300" />
                      )
                    ) : (
                      <span className="text-gray-600 font-medium">{row.starter}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.prime === 'boolean' ? (
                      row.prime ? (
                        <Check size={20} className="mx-auto text-success-600" />
                      ) : (
                        <X size={20} className="mx-auto text-gray-300" />
                      )
                    ) : (
                      <span className="text-gray-600 font-medium">{row.prime}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {typeof row.elite === 'boolean' ? (
                      row.elite ? (
                        <Check size={20} className="mx-auto text-success-600" />
                      ) : (
                        <X size={20} className="mx-auto text-gray-300" />
                      )
                    ) : (
                      <span className="text-gray-600 font-medium">{row.elite}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Pricing FAQ</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: 'Can I change my plan anytime?',
              a: 'Yes! You can upgrade, downgrade, or cancel your subscription anytime. Changes take effect at the start of your next billing cycle.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay. Your payment information is secure and encrypted.',
            },
            {
              q: 'Do you offer refunds?',
              a: 'If you cancel your subscription, you won\'t be charged again. Partial month refunds are available in certain circumstances.',
            },
            {
              q: 'Is there a family plan?',
              a: 'Yes! Family plans are available for 4-6 members at special rates. Contact our sales team for more information.',
            },
          ].map((item, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg transition-all animate-slide-down"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <p className="font-bold text-gray-900 mb-2">{item.q}</p>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-12 text-center space-y-6 animate-slide-up">
        <h2 className="text-4xl font-bold text-white">
          Ready to get started?
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto">
          Choose your plan today and enjoy exclusive benefits, free shipping, and much more!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-white text-primary-600 rounded-lg font-bold hover:shadow-lg hover-lift transition-all">
            Browse Plans
          </button>
          <Link
            href="/support"
            className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white/10 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 text-center animate-slide-up">
        {[
          { icon: '✓', text: 'No hidden fees' },
          { icon: '✓', text: 'Cancel anytime' },
          { icon: '✓', text: 'Money-back guarantee' },
        ].map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-2 animate-slide-down"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <span className="text-2xl text-success-600">{badge.icon}</span>
            <span className="font-semibold text-gray-900">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
