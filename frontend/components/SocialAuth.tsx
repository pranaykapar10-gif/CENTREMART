'use client';

import { useState } from 'react';
import { Chrome, Facebook, Github } from 'lucide-react';

interface OAuthProvider {
  name: string;
  icon: React.ReactNode;
  color: string;
  hoverColor: string;
  clientId: string;
}

const oauthProviders: OAuthProvider[] = [
  {
    name: 'Google',
    icon: <Chrome size={24} />,
    color: 'bg-white border-gray-300 text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    clientId: 'YOUR_GOOGLE_CLIENT_ID',
  },
  {
    name: 'Facebook',
    icon: <Facebook size={24} />,
    color: 'bg-blue-50 border-blue-300 text-blue-700',
    hoverColor: 'hover:bg-blue-100',
    clientId: 'YOUR_FACEBOOK_APP_ID',
  },
  {
    name: 'GitHub',
    icon: <Github size={24} />,
    color: 'bg-gray-900 border-gray-800 text-white',
    hoverColor: 'hover:bg-black',
    clientId: 'YOUR_GITHUB_CLIENT_ID',
  },
];

interface SocialAuthLoginProps {
  onSuccess?: (provider: string, userData: object) => void;
  onError?: (error: string) => void;
}

export function SocialAuthLogin({ onSuccess, onError }: SocialAuthLoginProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  void onSuccess; // Suppress unused warning

  const handleGoogleLogin = async () => {
    setLoading('Google');
    try {
      // In production, use @react-oauth/google package
      console.log('Google login initiated - configure @react-oauth/google in production');
      setTimeout(() => setLoading(null), 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Google login failed';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(null);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading('Facebook');
    try {
      // In production, use facebook-jssdk or @react-oauth/facebook
      console.log('Facebook login initiated - configure facebook SDK in production');
      setTimeout(() => setLoading(null), 1000);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Facebook login failed';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(null);
    }
  };

  const handleGitHubLogin = async () => {
    setLoading('GitHub');
    try {
      // In production, navigate to GitHub OAuth endpoint
      const redirectUri = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/auth/github/callback`;
      const scope = 'user:email';
      const authUrl = `https://github.com/login/oauth/authorize?client_id=${oauthProviders[2].clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
      
      // Use a link element to navigate (works in components)
      const link = document.createElement('a');
      link.href = authUrl;
      link.click();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'GitHub login failed';
      setError(errorMsg);
      onError?.(errorMsg);
      setLoading(null);
    }
  };

  const handleOAuthClick = (provider: string) => {
    setError(null);

    switch (provider) {
      case 'Google':
        handleGoogleLogin();
        break;
      case 'Facebook':
        handleFacebookLogin();
        break;
      case 'GitHub':
        handleGitHubLogin();
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-medium">Or continue with</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 font-semibold">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {oauthProviders.map((provider) => (
          <button
            key={provider.name}
            onClick={() => handleOAuthClick(provider.name)}
            disabled={loading !== null}
            className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg font-bold transition ${provider.color} ${provider.hoverColor} ${
              loading === provider.name ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={`Login with ${provider.name}`}
          >
            {loading === provider.name ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span className="hidden sm:inline text-sm">...</span>
              </>
            ) : (
              <>
                {provider.icon}
                <span className="hidden sm:inline text-sm">{provider.name}</span>
              </>
            )}
          </button>
        ))}
      </div>

      <p className="text-xs text-gray-600 text-center pt-2">
        By signing in, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  );
}

export function SocialAuthProfile() {
  const [connectedAccounts, setConnectedAccounts] = useState<string[]>([]);
  const [loading, setLoading] = useState<string | null>(null);

  const handleDisconnect = async (provider: string) => {
    setLoading(provider);
    try {
      // API call to disconnect OAuth provider
      await new Promise((resolve) => setTimeout(resolve, 500));
      setConnectedAccounts(connectedAccounts.filter((p) => p !== provider));
      setLoading(null);
    } catch (error) {
      console.error('Failed to disconnect:', error);
      setLoading(null);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Connected Accounts</h3>

      <div className="space-y-2">
        {oauthProviders.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${provider.color}`}>{provider.icon}</div>
              <div>
                <p className="font-semibold text-gray-900">{provider.name}</p>
                <p className="text-xs text-gray-600">
                  {connectedAccounts.includes(provider.name) ? (
                    <span className="text-green-600 font-bold">✓ Connected</span>
                  ) : (
                    <span className="text-gray-500">Not connected</span>
                  )}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (connectedAccounts.includes(provider.name)) {
                  handleDisconnect(provider.name);
                } else {
                  // Trigger OAuth connection logic
                  console.log(`Connecting ${provider.name}...`);
                }
              }}
              disabled={loading !== null}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                connectedAccounts.includes(provider.name)
                  ? 'bg-red-50 hover:bg-red-100 text-red-600'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
              } ${loading === provider.name ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading === provider.name ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
              ) : connectedAccounts.includes(provider.name) ? (
                'Disconnect'
              ) : (
                'Connect'
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
