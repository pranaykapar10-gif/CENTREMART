'use client';

import { useState, useCallback } from 'react';
import { Bell, Mail, MessageSquare, Package, X, Check } from 'lucide-react';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  icon?: React.ReactNode;
  actionUrl?: string;
}

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onDelete?: (id: string) => void;
}

/**
 * Get icon for notification type
 */
function getNotificationIcon(type: string) {
  switch (type) {
    case 'email':
      return <Mail size={16} className="text-blue-600" />;
    case 'sms':
      return <MessageSquare size={16} className="text-green-600" />;
    case 'push':
      return <Bell size={16} className="text-purple-600" />;
    case 'in-app':
      return <Package size={16} className="text-orange-600" />;
    default:
      return <Bell size={16} className="text-gray-600" />;
  }
}

/**
 * Format time ago
 */
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'just now';
}

/**
 * Enhanced Notification Item
 */
function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
}: {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await new Promise((resolve) => setTimeout(resolve, 200));
    onDelete(notification.id);
  };

  return (
    <div
      className={`p-4 transition-all duration-200 animate-slide-down border-l-4 ${
        isRemoving ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
      } ${
        notification.read
          ? 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700'
          : 'bg-primary-50 dark:bg-primary-900/20 border-primary-600 dark:border-primary-500'
      }`}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0 pt-1">
          {getNotificationIcon(notification.type)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`font-semibold transition-colors ${
                notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-900 dark:text-gray-100'
              }`}
            >
              {notification.title}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-500 flex-shrink-0 whitespace-nowrap">
              {timeAgo(notification.timestamp)}
            </span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {notification.message}
          </p>

          <div className="flex gap-2 mt-3">
            {!notification.read && (
              <button
                onClick={() => onMarkAsRead(notification.id)}
                className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Mark as read
              </button>
            )}
            <button
              onClick={handleRemove}
              className="text-xs font-semibold text-gray-500 dark:text-gray-500 hover:text-error-600 dark:hover:text-error-400 transition-colors ml-auto"
            >
              Dismiss
            </button>
          </div>
        </div>

        {!notification.read && (
          <div className="flex-shrink-0 w-2 h-2 bg-primary-600 dark:bg-primary-500 rounded-full mt-2 animate-pulse" />
        )}
      </div>
    </div>
  );
}

/**
 * Enhanced Notification Center
 */
export function NotificationCenter({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayNotifications = notifications.slice(0, 50);

  const handleMarkAsRead = useCallback(
    (id: string) => {
      onMarkAsRead?.(id);
    },
    [onMarkAsRead]
  );

  const handleDelete = useCallback(
    (id: string) => {
      onDelete?.(id);
    },
    [onDelete]
  );

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-all duration-200 ${
          isOpen
            ? 'bg-primary-100 text-primary-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Bell size={24} />

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-error-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl dark:shadow-gray-950 border border-gray-200 dark:border-gray-700 overflow-hidden animate-slide-down z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <p className="text-sm text-white/80">{unreadCount} unread</p>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Toolbar */}
          {unreadCount > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <button
                onClick={() => onMarkAllAsRead?.()}
                className="flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                <Check size={16} />
                Mark all as read
              </button>
            </div>
          )}

          {/* Notifications List */}
          {displayNotifications.length > 0 ? (
            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto scrollbar-hide">
              {displayNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <Bell size={32} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">No notifications yet</p>
            </div>
          )}

          {/* Footer */}
          {displayNotifications.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-center">
              <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Toast Notification (temporary popup)
 */
export function Toast({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}) {
  const [isVisible, setIsVisible] = useState(true);

  useState(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  });

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-success-600',
    error: 'bg-error-600',
    warning: 'bg-warning-600',
    info: 'bg-primary-600',
  }[type];

  const Icon = {
    success: <Check size={20} />,
    error: <X size={20} />,
    warning: <Bell size={20} />,
    info: <Bell size={20} />,
  }[type];

  return (
    <div className={`${bgColor} text-white rounded-xl shadow-lg p-4 flex items-center gap-3 animate-slide-up max-w-sm`}>
      {Icon}
      <span className="font-medium flex-1">{message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          onClose?.();
        }}
        className="text-white/80 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
    </div>
  );
}

/**
 * useToast hook for managing toast notifications
 */
export function useToast() {
  const [toasts, setToasts] = useState<
    Array<{
      id: string;
      message: string;
      type: 'success' | 'error' | 'info' | 'warning';
    }>
  >([]);

  const showToast = useCallback(
    (
      message: string,
      type: 'success' | 'error' | 'info' | 'warning' = 'info',
      duration = 3000
    ) => {
      const id = Math.random().toString();
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);

      return id;
    },
    []
  );

  return { showToast, toasts, removeToast: (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)) };
}
