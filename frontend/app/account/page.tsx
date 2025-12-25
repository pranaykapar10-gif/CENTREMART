'use client';

import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useState, useEffect } from 'react';
import { User, Package, Heart, MapPin, Settings, LogOut, Edit2, Save, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  );
}

function AccountContent() {
  const { user, logout, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'settings'>('profile');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar_url || '👤',
  });

  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/orders/my-orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWishlist = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setWishlist(wishlist.filter(item => item.product_id !== productId));
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        avatar_url: profileData.avatar
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const tabStyles = (tab: string) =>
    `px-4 py-3 font-bold border-b-2 transition cursor-pointer ${
      activeTab === tab
        ? 'border-blue-600 text-blue-600'
        : 'border-gray-300 text-gray-600 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black text-gray-900">My Account</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 px-6 rounded-lg transition"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8 border-b border-gray-200">
          <div className="flex gap-8 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('profile')} className={tabStyles('profile')}>
              <User size={20} className="inline mr-2" />
              Profile
            </button>
            <button onClick={() => setActiveTab('orders')} className={tabStyles('orders')}>
              <Package size={20} className="inline mr-2" />
              Orders
            </button>
            <button onClick={() => setActiveTab('wishlist')} className={tabStyles('wishlist')}>
              <Heart size={20} className="inline mr-2" />
              Wishlist
            </button>
            <button onClick={() => setActiveTab('addresses')} className={tabStyles('addresses')}>
              <MapPin size={20} className="inline mr-2" />
              Addresses
            </button>
            <button onClick={() => setActiveTab('settings')} className={tabStyles('settings')}>
              <Settings size={20} className="inline mr-2" />
              Settings
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 gap-8">
          {isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
          )}

          {!isLoading && activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-start justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2 px-4 rounded-lg transition"
                  >
                    <Edit2 size={18} />
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{profileData.avatar}</div>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 px-4 rounded-lg transition">
                      Change Avatar
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <Save size={20} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditingProfile(false)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition"
                    >
                      <X size={20} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-6xl">{profileData.avatar}</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="text-lg font-semibold text-gray-900">{user?.phone || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'January 2024'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === 'orders' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>

              {orders.length === 0 ? (
                <p className="text-gray-600">No orders yet. Start shopping!</p>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                        <div>
                          <p className="text-xs text-gray-600">Order Number</p>
                          <p className="font-bold text-gray-900">{order.order_number}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Order Date</p>
                          <p className="font-semibold text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Status</p>
                          <p className="font-semibold text-gray-900 capitalize">{order.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Total</p>
                          <p className="font-bold text-lg text-gray-900">${order.total_amount}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-bold ${
                              order.status === 'delivered'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'shipped'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {order.status}
                          </span>
                          <Link
                            href={`/account/orders/${order.id}`}
                            className="text-blue-600 hover:text-blue-700 font-bold"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!isLoading && activeTab === 'wishlist' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>

              {wishlist.length === 0 ? (
                <p className="text-gray-600">Your wishlist is empty.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {wishlist.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                      <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h3>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-lg text-blue-600">${item.price}</p>
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.product_id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 px-3 rounded-lg transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition">
                  + Add Address
                </button>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-gray-900">{address.type}</p>
                          {address.default && <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                            Default
                          </span>}
                        </div>
                        <p className="text-gray-700">{address.street}</p>
                        <p className="text-gray-700">{address.city}</p>
                        <p className="text-gray-600 text-sm mt-2">{address.phone}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-700 font-bold text-sm">Edit</button>
                        <button className="text-red-600 hover:text-red-700 font-bold text-sm">Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

              <div className="space-y-6">
                {/* Notifications */}
                <div className="border-b pb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Order updates', description: 'Get notified about your orders' },
                      { label: 'Marketing emails', description: 'Receive exclusive deals and promotions' },
                      { label: 'SMS notifications', description: 'Get text alerts for important updates' },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Privacy */}
                <div className="border-b pb-6">
                  <h3 className="font-bold text-gray-900 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Make profile public', description: 'Allow others to see your public information' },
                      { label: 'Show order history', description: 'Display your reviews and ratings' },
                    ].map((item) => (
                      <label key={item.label} className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                        <div>
                          <p className="font-semibold text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition">
                    Delete Account
                  </button>
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
