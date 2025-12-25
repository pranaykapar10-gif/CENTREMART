'use client';

import { useState } from 'react';
import { ChevronDown, Search, MessageSquare, Phone, Mail } from 'lucide-react';

/**
 * Enhanced FAQ Component
 */
export function FAQEnhanced() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          q: 'How do I create an account?',
          a: 'Creating an account is easy! Click the "Sign Up" button in the top right, enter your email and password, and verify your email address. You can then start shopping immediately.',
        },
        {
          q: 'Is it safe to shop on this platform?',
          a: 'Yes! We use 256-bit SSL encryption to protect your data. All transactions are secure, and we never store your credit card information on our servers.',
        },
        {
          q: 'What payment methods do you accept?',
          a: 'We accept all major credit cards, debit cards, PayPal, Apple Pay, Google Pay, and bank transfers. You can also use gift cards or store credit.',
        },
        {
          q: 'Can I change my order after placing it?',
          a: 'You can cancel or modify your order within 30 minutes of placing it. After that, please contact our support team for assistance.',
        },
      ],
    },
    {
      category: 'Shipping & Delivery',
      questions: [
        {
          q: 'How long does shipping take?',
          a: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Prime members get free 2-day shipping on eligible items.',
        },
        {
          q: 'Do you ship internationally?',
          a: 'Yes! We ship to over 150 countries. International shipping times vary from 7-21 business days depending on the destination.',
        },
        {
          q: 'Can I track my order?',
          a: 'Absolutely! You\'ll receive a tracking number via email as soon as your order ships. You can track your package in real-time from our order tracking page.',
        },
        {
          q: 'What if my package is damaged?',
          a: 'Contact us immediately with photos of the damage. We\'ll arrange a replacement or refund right away at no cost to you.',
        },
      ],
    },
    {
      category: 'Returns & Refunds',
      questions: [
        {
          q: 'What is your return policy?',
          a: 'We offer a 30-day money-back guarantee on all items. Simply return the item in original condition with original packaging for a full refund.',
        },
        {
          q: 'How long does a refund take?',
          a: 'Once we receive your return, processing typically takes 5-7 business days. The refund will be credited back to your original payment method.',
        },
        {
          q: 'Do I have to pay for return shipping?',
          a: 'We provide free return shipping labels for all items. Just print and attach the label to your package.',
        },
        {
          q: 'Can I exchange an item instead of returning it?',
          a: 'Yes! You can exchange items for free within 60 days. Select the exchange option during the return process.',
        },
      ],
    },
    {
      category: 'Account & Profile',
      questions: [
        {
          q: 'How do I reset my password?',
          a: 'Click "Forgot Password" on the login page. We\'ll send you a secure link to reset your password via email.',
        },
        {
          q: 'Can I update my personal information?',
          a: 'Yes! Go to Account Settings to update your name, email, phone number, and addresses anytime.',
        },
        {
          q: 'How do I delete my account?',
          a: 'You can request account deletion in Account Settings. Your data will be permanently removed within 30 days.',
        },
        {
          q: 'What are loyalty points?',
          a: 'Every purchase earns points! Use points to get discounts, free shipping, or exclusive products. 100 points = $10 discount.',
        },
      ],
    },
  ];

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  const hasResults = filteredFAQs.some((cat) => cat.questions.length > 0);

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-6 animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-gray-100">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Find answers to common questions about shopping, shipping, returns, and more
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative animate-slide-down">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:border-primary-600 dark:focus:border-primary-500 focus:outline-none focus-ring text-lg transition-all"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredFAQs.map((category, catIndex) => (
          category.questions.length > 0 && (
            <div
              key={category.category}
              className="animate-slide-up"
              style={{ animationDelay: `${catIndex * 100}ms` }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-3 border-b-2 border-primary-300">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, qIndex) => {
                  const globalIndex = faqs.flat().findIndex((item) => item === faq);
                  const isExpanded = expandedIndex === globalIndex;

                  return (
                    <div
                      key={qIndex}
                      className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary-300 transition-all animate-slide-down"
                      style={{ animationDelay: `${qIndex * 50}ms` }}
                    >
                      <button
                        onClick={() =>
                          setExpandedIndex(isExpanded ? null : globalIndex)
                        }
                        className={`w-full px-6 py-4 text-left font-bold text-lg transition-all flex items-center justify-between ${
                          isExpanded
                            ? 'bg-primary-50 text-primary-900'
                            : 'bg-white text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span className="flex-1">{faq.q}</span>
                        <ChevronDown
                          size={24}
                          className={`flex-shrink-0 ml-4 transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="px-6 py-4 bg-primary-50 border-t-2 border-primary-200 animate-slide-down">
                          <p className="text-gray-700 leading-relaxed">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )
        ))}

        {!hasResults && (
          <div className="text-center py-12 animate-fade-in">
            <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">
              No results found for &quot;{searchQuery}&quot;
            </p>
            <p className="text-gray-500 mt-2">Try searching with different keywords</p>
          </div>
        )}
      </div>

      {/* Still Have Questions */}
      <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 md:p-12 border-2 border-primary-200 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Still have questions?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: MessageSquare,
              title: 'Live Chat',
              description: 'Chat with our support team in real-time',
              action: 'Start Chat',
            },
            {
              icon: Phone,
              title: 'Call Us',
              description: 'Mon-Fri: 9AM-6PM EST',
              action: 'Call: 1-800-123-4567',
            },
            {
              icon: Mail,
              title: 'Email Support',
              description: 'We respond within 24 hours',
              action: 'support@ecom.com',
            },
          ].map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-all animate-slide-down"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon size={32} className="mx-auto text-primary-600 mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{option.description}</p>
                <button className="text-primary-600 hover:text-primary-700 font-bold text-sm">
                  {option.action}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Topics */}
      <div className="space-y-6 animate-slide-up">
        <h2 className="text-3xl font-bold text-gray-900">Popular Topics</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            'How to Track Orders',
            'Return & Refund Policy',
            'Payment Methods',
            'Shipping Information',
            'Account Security',
            'Promo Codes',
            'Gift Cards',
            'Loyalty Program',
          ].map((topic, index) => (
            <button
              key={topic}
              className="px-4 py-3 bg-white border-2 border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-all font-semibold text-gray-900 animate-slide-down"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {/* Satisfaction Guarantee */}
      <div className="text-center space-y-4 p-8 bg-success-50 rounded-2xl border-2 border-success-200 animate-slide-up">
        <p className="text-lg font-bold text-success-900">
          ✓ 100% Satisfaction Guaranteed
        </p>
        <p className="text-gray-600 max-w-2xl mx-auto">
          If you&apos;re not completely happy with your purchase, we&apos;ll make it right. Our friendly support team is here to help anytime.
        </p>
      </div>
    </div>
  );
}
