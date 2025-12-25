'use client';

import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 transition-colors duration-300">
      {/* Main Footer */}
      <div className="px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <h3 className="text-2xl font-black text-white dark:text-gray-100 mb-4">EcomWorld</h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6 leading-relaxed">
                Your destination for premium tech products at unbeatable prices. Experience shopping like never before.
              </p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-600 transition"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-400 transition"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-pink-600 transition"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  className="p-2 bg-gray-800 rounded-lg hover:bg-blue-700 transition"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-white dark:text-gray-100 font-bold mb-4">Shop</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className="hover:text-white dark:hover:text-gray-200 transition">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=audio" className="hover:text-white dark:hover:text-gray-200 transition">
                    Audio
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=power" className="hover:text-white dark:hover:text-gray-200 transition">
                    Power
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=protection" className="hover:text-white dark:hover:text-gray-200 transition">
                    Protection
                  </Link>
                </li>
                <li>
                  <Link href="/shop" className="hover:text-white dark:hover:text-gray-200 transition">
                    Sale Items
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white dark:text-gray-100 font-bold mb-4">Company</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Press
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Sustainability
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white dark:text-gray-100 font-bold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Track Order
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                    Size Guide
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-white dark:text-gray-100 font-bold mb-4">Get in Touch</h4>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <Mail className="w-5 h-5 text-blue-400 dark:text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm">support@ecomworld.com</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <Phone className="w-5 h-5 text-blue-400 dark:text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm">+1 (555) 123-4567</p>
                  </div>
                </li>
                <li className="flex gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 dark:text-blue-500 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm">San Francisco, CA 94102</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10 border border-blue-500/30 dark:border-blue-500/20 rounded-xl p-8 mb-12">
            <div className="max-w-2xl mx-auto">
              <h4 className="text-white dark:text-gray-100 font-bold mb-2">Subscribe to Our Newsletter</h4>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-4">Get exclusive deals and latest product updates</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 bg-gray-800 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-lg text-white placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                />
                <button className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white font-bold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-800 dark:border-gray-700" />

          {/* Bottom Section */}
          <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div>
              <h5 className="text-white dark:text-gray-100 text-sm font-bold mb-3">Accepted Payments</h5>
              <div className="flex gap-3">
                <div className="px-3 py-2 bg-gray-800 dark:bg-gray-800 rounded text-xs text-gray-300 dark:text-gray-400">Visa</div>
                <div className="px-3 py-2 bg-gray-800 dark:bg-gray-800 rounded text-xs text-gray-300 dark:text-gray-400">Mastercard</div>
                <div className="px-3 py-2 bg-gray-800 dark:bg-gray-800 rounded text-xs text-gray-300 dark:text-gray-400">PayPal</div>
                <div className="px-3 py-2 bg-gray-800 dark:bg-gray-800 rounded text-xs text-gray-300 dark:text-gray-400">Apple Pay</div>
              </div>
            </div>

            {/* Legal Links */}
            <div className="text-center">
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                  Privacy Policy
                </Link>
                <span className="text-gray-700 dark:text-gray-600">•</span>
                <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                  Terms of Service
                </Link>
                <span className="text-gray-700 dark:text-gray-600">•</span>
                <Link href="/" className="hover:text-white dark:hover:text-gray-200 transition">
                  Cookie Policy
                </Link>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-right text-sm">
              <p>&copy; {currentYear} EcomWorld. All rights reserved.</p>
              <p className="text-gray-500 dark:text-gray-600 mt-2">Crafted with ❤️ for tech enthusiasts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-full hover:bg-blue-700 dark:hover:bg-blue-600 transition opacity-0 hover:opacity-100 duration-300 z-40"
      >
        ↑
      </button>
    </footer>
  );
}
