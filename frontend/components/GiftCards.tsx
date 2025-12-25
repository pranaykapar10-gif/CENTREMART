'use client';

import { useState, useEffect } from 'react';
import { Gift, Copy, Check, AlertCircle } from 'lucide-react';

export interface GiftCard {
  id: string;
  code: string;
  balance: number;
  originalAmount: number;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
  usedAt?: Date;
  usedBy?: string;
}

export interface GiftCardDesign {
  id: string;
  name: string;
  theme: 'blue' | 'gold' | 'purple' | 'green';
  message: string;
}

const giftCardDesigns: GiftCardDesign[] = [
  {
    id: 'celebration',
    name: 'Celebration',
    theme: 'gold',
    message: 'Celebrate with TechStore',
  },
  {
    id: 'tech-lover',
    name: 'Tech Lover',
    theme: 'blue',
    message: 'For the tech enthusiast',
  },
  {
    id: 'premium',
    name: 'Premium',
    theme: 'purple',
    message: 'Premium gift for you',
  },
  {
    id: 'eco-friendly',
    name: 'Eco Friendly',
    theme: 'green',
    message: 'Sustainable choice',
  },
];

/**
 * Gift Card Purchase Component
 */
export function GiftCardPurchase() {
  const [amount, setAmount] = useState(50);
  const [selectedDesign, setSelectedDesign] = useState<string>('celebration');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [giftCardCode, setGiftCardCode] = useState('');

  const amounts = [25, 50, 100, 250, 500];

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/gift-cards/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount,
          designId: selectedDesign,
          recipientEmail,
          recipientName,
          personalMessage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGiftCardCode(data.giftCardCode);
        setSuccess(true);
      }
    } catch (error) {
      console.error('Failed to purchase gift card:', error);
    } finally {
      setLoading(false);
    }
  };

  const design = giftCardDesigns.find((d) => d.id === selectedDesign);
  const themeColors: Record<string, { bg: string; text: string; accent: string }> = {
    blue: { bg: 'from-blue-600 to-blue-700', text: 'text-white', accent: 'bg-blue-100' },
    gold: { bg: 'from-amber-500 to-amber-600', text: 'text-white', accent: 'bg-amber-100' },
    purple: { bg: 'from-purple-600 to-purple-700', text: 'text-white', accent: 'bg-purple-100' },
    green: { bg: 'from-green-600 to-green-700', text: 'text-white', accent: 'bg-green-100' },
  };

  const color = themeColors[design?.theme || 'blue'];

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className={`bg-gradient-to-br ${color.bg} rounded-2xl shadow-2xl p-8 text-center ${color.text}`}>
          <Gift className="mx-auto mb-4" size={48} />
          <h3 className="text-2xl font-bold mb-2">Gift Card Purchased!</h3>
          <p className="text-sm opacity-90 mb-6">
            Gift card has been sent to {recipientName}
          </p>

          <div className="bg-white/20 rounded-lg p-4 mb-6 font-mono text-lg font-bold">
            {giftCardCode}
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(giftCardCode);
            }}
            className={`w-full ${color.accent} text-gray-900 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-80 transition`}
          >
            <Copy size={18} />
            Copy Code
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handlePurchase} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Gift Card Amount
          </label>
          <div className="grid grid-cols-3 gap-3">
            {amounts.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAmount(a)}
                className={`px-4 py-3 rounded-lg font-semibold transition ${
                  amount === a
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                ${a}
              </button>
            ))}
          </div>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(10, parseInt(e.target.value) || 10))}
            min="10"
            max="5000"
            className="w-full mt-3 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Or enter custom amount"
          />
        </div>

        {/* Design Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Card Design
          </label>
          <div className="grid grid-cols-2 gap-4">
            {giftCardDesigns.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setSelectedDesign(d.id)}
                className={`p-4 rounded-lg border-2 transition ${
                  selectedDesign === d.id
                    ? 'border-blue-600'
                    : 'border-gray-200'
                }`}
              >
                <div
                  className={`bg-gradient-to-br ${themeColors[d.theme].bg} rounded h-24 flex items-center justify-center mb-2`}
                >
                  <Gift className="text-white" size={32} />
                </div>
                <p className="font-semibold text-gray-900">{d.name}</p>
                <p className="text-xs text-gray-600">{d.message}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recipient Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Recipient Name
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Recipient Email
            </label>
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
        </div>

        {/* Personal Message */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Personal Message (Optional)
          </label>
          <textarea
            value={personalMessage}
            onChange={(e) => setPersonalMessage(e.target.value)}
            placeholder="Add a personal touch..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            rows={3}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">
            {personalMessage.length}/200
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !recipientEmail || !recipientName}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          {loading ? 'Processing...' : `Purchase $${amount} Gift Card`}
        </button>
      </form>
    </div>
  );
}

/**
 * Gift Card Redemption Component
 */
export function GiftCardRedemption() {
  const [code, setCode] = useState('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleRedeemCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gift-cards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance);
      } else {
        setError('Invalid gift card code');
      }
    } catch {
      setError('Failed to redeem gift card');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleRedeemCode} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Gift Card Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter code (e.g., GC-XXXX-XXXX)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Redeem
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        {balance !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-900 mb-2">Gift Card Balance</p>
            <p className="text-2xl font-bold text-green-900">${balance.toFixed(2)}</p>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(code);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="mt-3 text-sm text-green-700 hover:text-green-800 flex items-center gap-1"
            >
              {copied ? (
                <>
                  <Check size={16} /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} /> Copy Code
                </>
              )}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Gift Card Balance Check Component
 */
export function GiftCardBalance({ code }: { code: string }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch(`/api/gift-cards/${code}/balance`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setBalance(data.balance);
        }
      } catch (error) {
        console.error('Failed to fetch balance:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [code]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (balance === null) {
    return <div className="text-center text-red-600">Unable to load balance</div>;
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-sm text-blue-900 mb-1">Gift Card Balance</p>
      <p className="text-3xl font-bold text-blue-900">${balance.toFixed(2)}</p>
    </div>
  );
}
