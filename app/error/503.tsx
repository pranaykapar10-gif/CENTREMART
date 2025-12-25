import Link from 'next/link';
import { Zap, Clock, Home } from 'lucide-react';

/**
 * 503 Service Unavailable Page
 */
export default function Error503() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <Zap className="text-yellow-600" size={32} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">503</h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Service unavailable
          </h2>

          <p className="text-gray-600 mb-8">
            We're currently performing maintenance. We'll be back online shortly. Thank you for your patience!
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-2">
              <Clock className="text-blue-600 mt-1 flex-shrink-0" size={18} />
              <div className="text-sm text-blue-900">
                Expected maintenance window: <strong>2 hours</strong>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Home size={20} />
            Go to home
          </Link>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error code: <code className="bg-gray-100 px-2 py-1 rounded">503</code>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              For updates, follow us on{' '}
              <a href="https://twitter.com/techstore" className="text-blue-600 hover:underline">
                Twitter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
