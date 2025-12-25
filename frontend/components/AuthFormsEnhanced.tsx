'use client';

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

interface AuthFormProps {
  onSubmit: (data: Record<string, string>) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

/**
 * Password strength indicator with smooth animation
 */
function PasswordStrengthIndicator({ password }: { password: string }) {
  const getStrength = (): { level: number; label: string; color: string } => {
    if (!password) return { level: 0, label: '', color: 'bg-gray-300' };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z\d]/.test(password)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: 'bg-error-500' };
    if (score <= 2) return { level: 2, label: 'Fair', color: 'bg-warning-500' };
    if (score <= 3) return { level: 3, label: 'Good', color: 'bg-primary-500' };
    return { level: 4, label: 'Strong', color: 'bg-success-500' };
  };

  const strength = getStrength();

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {strength.label && (
        <p className={`text-xs font-semibold ${strength.color.replace('bg-', 'text-')}`}>
          {strength.label}
        </p>
      )}
    </div>
  );
}

/**
 * Enhanced Login Form
 */
export function LoginForm({ onSubmit, isLoading, error }: AuthFormProps) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 rounded-xl flex gap-3 animate-slide-down" role="alert" aria-live="assertive">
          <AlertCircle className="text-error-600 dark:text-error-400 flex-shrink-0 mt-0.5" size={18} aria-hidden="true" />
          <div>
            <p className="font-semibold text-error-900 dark:text-error-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Email Address</label>
        <div
          className={`relative group transition-all duration-300 ${
            focusedField === 'email' ? 'scale-[1.02]' : ''
          }`}
        >
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors duration-200"
            aria-hidden="true"
          />
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => setFocusedField('email')}
            onBlur={() => {
              setFocusedField(null);
              setTouched({ ...touched, email: true });
            }}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 dark:text-white rounded-xl focus:outline-none focus:border-primary-600 dark:focus:border-primary-500 focus-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100">Password</label>
        <div
          className={`relative group transition-all duration-300 ${
            focusedField === 'password' ? 'scale-[1.02]' : ''
          }`}
        >
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-primary-600 dark:group-focus-within:text-primary-400 transition-colors duration-200"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onFocus={() => setFocusedField('password')}
            onBlur={() => {
              setFocusedField(null);
              setTouched({ ...touched, password: true });
            }}
            className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 dark:text-white rounded-xl focus:outline-none focus:border-primary-600 dark:focus:border-primary-500 focus-ring transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-primary-600 focus-ring cursor-pointer"
          />
          <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            Remember me
          </span>
        </label>
        <Link
          href="/forgot-password"
          className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 bg-gradient-primary text-white rounded-xl font-bold hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-gray-600 text-sm">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary-600 font-bold hover:text-primary-700">
          Create one
        </Link>
      </p>
    </form>
  );
}

/**
 * Enhanced Signup Form
 */
export function SignupForm({ onSubmit, isLoading, error }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const passwordMatch = formData.password === formData.confirmPassword && formData.password;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-error-50 border border-error-200 rounded-xl flex gap-3 animate-slide-down">
          <AlertCircle className="text-error-600 flex-shrink-0 mt-0.5" size={18} />
          <p className="font-semibold text-error-900 text-sm">{error}</p>
        </div>
      )}

      {/* Name Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Full Name</label>
        <div className="relative group">
          <User
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200"
          />
          <input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onFocus={() => {}}
            onBlur={() => {}}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-600 focus-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Email Address</label>
        <div className="relative group">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200"
          />
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            onFocus={() => {}}
            onBlur={() => {}}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-600 focus-ring transition-all duration-200"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Password</label>
        <div className="relative group">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200"
          />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            onFocus={() => {}}
            onBlur={() => {}}
            className="w-full pl-11 pr-12 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-600 focus-ring transition-all duration-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-900">Confirm Password</label>
        <div className="relative group">
          <Lock
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors duration-200"
          />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            onFocus={() => {}}
            onBlur={() => {}}
            className={`w-full pl-11 pr-12 py-3 bg-gray-50 border-2 rounded-xl focus:outline-none focus-ring transition-all duration-200 ${
              formData.confirmPassword
                ? passwordMatch
                  ? 'border-success-300 focus:border-success-600'
                  : 'border-error-300 focus:border-error-600'
                : 'border-gray-200 focus:border-primary-600'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {passwordMatch && formData.confirmPassword && (
            <CheckCircle
              size={18}
              className="absolute right-12 top-1/2 -translate-y-1/2 text-success-500"
            />
          )}
        </div>
      </div>

      {/* Terms & Conditions */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-gray-300 text-primary-600 focus-ring cursor-pointer mt-1"
        />
        <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
          I agree to the{' '}
          <Link href="/terms" className="text-primary-600 font-semibold hover:underline">
            Terms & Conditions
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 font-semibold hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-4 bg-gradient-primary text-white rounded-xl font-bold hover-lift transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
            Creating account...
          </>
        ) : (
          'Create Account'
        )}
      </button>

      {/* Sign In Link */}
      <p className="text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 font-bold hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </form>
  );
}
