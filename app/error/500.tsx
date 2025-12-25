import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * 500 Internal Server Error Page
 */
export default function Error500() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="text-red-600" size={32} />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">500</h1>

          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Server error
          </h2>

          <p className="text-gray-600 mb-8">
            Something went wrong on our end. Our team has been notified and is working to fix it. Please try again in a moment.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <RefreshCw size={20} />
              Try again
            </button>

            <Link
              href="/"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg transition flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Go to home
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Error code: <code className="bg-gray-100 px-2 py-1 rounded">500</code>
            </p>
            <p className="text-xs text-gray-400 mt-2">
              If the problem persists, please{' '}
              <Link href="/support" className="text-blue-600 hover:underline">
                contact support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
