import Link from 'next/link';
import { AlertTriangle, Search, Home } from 'lucide-react';

/**
 * 404 Not Found Page
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <Search className="text-blue-600" size={32} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page not found
          </h2>

          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go to home
            </Link>

            <Link
              href="/products"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition"
            >
              Browse products
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error code: <code className="bg-gray-100 px-2 py-1 rounded">404</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
