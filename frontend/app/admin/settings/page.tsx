'use client';

import AdminLayout from '@/components/AdminLayout';
import { Save, ToggleRight, ToggleLeft, Mail, Phone, MapPin, Building2 } from 'lucide-react';
import { useState } from 'react';

export default function AdminSettings() {
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'TechShop',
    storeEmail: 'support@techshop.com',
    storePhone: '+1 (555) 123-4567',
    storeAddress: '123 Tech Street, Silicon Valley, CA 94025',
    currency: 'USD',
    language: 'English',
    timezone: 'America/Los_Angeles',
  });

  const [taxSettings, setTaxSettings] = useState({
    taxEnabled: true,
    taxRate: 10,
    shippingTaxable: false,
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShippingThreshold: 50,
    flatShippingRate: 5.99,
    freeShippingEnabled: true,
    flatShippingEnabled: false,
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpEmail: 'noreply@techshop.com',
    emailNotifications: true,
    orderConfirmation: true,
    shippingNotification: true,
    customerReviewReminder: true,
  });

  const [paymentSettings, setPaymentSettings] = useState({
    stripeEnabled: true,
    paypalEnabled: true,
    creditCardEnabled: true,
    googlePayEnabled: false,
    applePayEnabled: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-1">Configure store settings and preferences</p>
          </div>
          <button
            onClick={handleSave}
            className={`font-bold py-2 px-6 rounded-lg transition flex items-center gap-2 ${
              saved
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <Save size={20} /> {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Store Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building2 size={24} className="text-blue-600" /> Store Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Store Name</label>
              <input
                type="text"
                value={storeSettings.storeName}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Currency</label>
              <select
                value={storeSettings.currency}
                onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD (C$)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Mail size={16} /> Store Email
              </label>
              <input
                type="email"
                value={storeSettings.storeEmail}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Language</label>
              <select
                value={storeSettings.language}
                onChange={(e) => setStoreSettings({ ...storeSettings, language: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Phone size={16} /> Store Phone
              </label>
              <input
                type="tel"
                value={storeSettings.storePhone}
                onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Timezone</label>
              <select
                value={storeSettings.timezone}
                onChange={(e) => setStoreSettings({ ...storeSettings, timezone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
              >
                <option value="America/Los_Angeles">Pacific Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/New_York">Eastern Time</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin size={16} /> Store Address
              </label>
              <textarea
                value={storeSettings.storeAddress}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-none"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Tax Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tax Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Enable Tax Calculation</p>
                <p className="text-sm text-gray-600">Automatically calculate tax on orders</p>
              </div>
              <button onClick={() => setTaxSettings({ ...taxSettings, taxEnabled: !taxSettings.taxEnabled })}>
                {taxSettings.taxEnabled ? (
                  <ToggleRight size={32} className="text-green-600" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>

            {taxSettings.taxEnabled && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">Tax Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={taxSettings.taxRate}
                      onChange={(e) => setTaxSettings({ ...taxSettings, taxRate: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-900">Tax Shipping</p>
                    <p className="text-sm text-gray-600">Apply tax to shipping costs</p>
                  </div>
                  <button
                    onClick={() => setTaxSettings({ ...taxSettings, shippingTaxable: !taxSettings.shippingTaxable })}
                  >
                    {taxSettings.shippingTaxable ? (
                      <ToggleRight size={32} className="text-green-600" />
                    ) : (
                      <ToggleLeft size={32} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">Offer free shipping for orders above threshold</p>
              </div>
              <button
                onClick={() => setShippingSettings({ ...shippingSettings, freeShippingEnabled: !shippingSettings.freeShippingEnabled })}
              >
                {shippingSettings.freeShippingEnabled ? (
                  <ToggleRight size={32} className="text-green-600" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>

            {shippingSettings.freeShippingEnabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Free Shipping Threshold ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={shippingSettings.freeShippingThreshold}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, freeShippingThreshold: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-900">Flat Shipping Rate</p>
                <p className="text-sm text-gray-600">Charge fixed shipping fee on all orders</p>
              </div>
              <button
                onClick={() => setShippingSettings({ ...shippingSettings, flatShippingEnabled: !shippingSettings.flatShippingEnabled })}
              >
                {shippingSettings.flatShippingEnabled ? (
                  <ToggleRight size={32} className="text-green-600" />
                ) : (
                  <ToggleLeft size={32} className="text-gray-400" />
                )}
              </button>
            </div>

            {shippingSettings.flatShippingEnabled && (
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Shipping Rate ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={shippingSettings.flatShippingRate}
                  onChange={(e) =>
                    setShippingSettings({ ...shippingSettings, flatShippingRate: parseFloat(e.target.value) })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Methods</h2>

          <div className="space-y-3">
            {[
              { key: 'stripeEnabled', label: 'Stripe' },
              { key: 'paypalEnabled', label: 'PayPal' },
              { key: 'creditCardEnabled', label: 'Credit/Debit Card' },
              { key: 'googlePayEnabled', label: 'Google Pay' },
              { key: 'applePayEnabled', label: 'Apple Pay' },
            ].map((payment) => (
              <div key={payment.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{payment.label}</p>
                <button
                  onClick={() =>
                    setPaymentSettings({
                      ...paymentSettings,
                      [payment.key]: !paymentSettings[payment.key as keyof typeof paymentSettings],
                    })
                  }
                >
                  {paymentSettings[payment.key as keyof typeof paymentSettings] ? (
                    <ToggleRight size={32} className="text-green-600" />
                  ) : (
                    <ToggleLeft size={32} className="text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Email Notifications</h2>

          <div className="space-y-3">
            {[
              { key: 'emailNotifications', label: 'Email Notifications' },
              { key: 'orderConfirmation', label: 'Order Confirmation Emails' },
              { key: 'shippingNotification', label: 'Shipping Notification Emails' },
              { key: 'customerReviewReminder', label: 'Customer Review Reminder' },
            ].map((setting) => (
              <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{setting.label}</p>
                <button
                  onClick={() =>
                    setEmailSettings({
                      ...emailSettings,
                      [setting.key]: !emailSettings[setting.key as keyof typeof emailSettings],
                    })
                  }
                >
                  {emailSettings[setting.key as keyof typeof emailSettings] ? (
                    <ToggleRight size={32} className="text-green-600" />
                  ) : (
                    <ToggleLeft size={32} className="text-gray-400" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
