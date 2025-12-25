/**
 * Notifications System - Push, Email, SMS, In-App
 */

export interface Notification {
  id: string;
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  subject: string;
  bodyText: string;
  bodyHtml: string;
  variables: string[];
}

/**
 * Push notification service (Firebase Cloud Messaging style)
 */
export class PushNotificationService {
  private apiKey = process.env.FCM_API_KEY || 'dev-key';
  private endpoint = 'https://fcm.googleapis.com/fcm/send';

  /**
   * Send push notification
   */
  async sendPush(
    deviceToken: string,
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): Promise<boolean> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `key=${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: deviceToken,
          notification: { title, body: message },
          data: data || {},
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Push notification error:', error);
      return false;
    }
  }

  /**
   * Send to multiple devices
   */
  async sendToMultiple(
    deviceTokens: string[],
    title: string,
    message: string,
    data?: Record<string, unknown>
  ): Promise<boolean[]> {
    return Promise.all(
      deviceTokens.map((token) =>
        this.sendPush(token, title, message, data)
      )
    );
  }
}

/**
 * Email notification service
 */
export class EmailNotificationService {
  private from = process.env.SMTP_FROM || 'noreply@techstore.com';
  private smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  /**
   * Send email notification
   */
  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
    textContent?: string
  ): Promise<boolean> {
    try {
      // Using fetch to simulate email service (nodemailer in production)
      const response = await fetch(
        `${process.env.EMAIL_SERVICE_ENDPOINT || 'http://localhost:3001'}/api/email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to,
            subject,
            html: htmlContent,
            text: textContent,
            from: this.from,
          }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Email notification error:', error);
      return false;
    }
  }

  /**
   * Send templated email
   */
  async sendTemplatedEmail(
    to: string,
    templateId: string,
    variables: Record<string, string>
  ): Promise<boolean> {
    const templates: Record<string, NotificationTemplate> = {
      'order-confirmation': {
        id: 'order-confirmation',
        name: 'Order Confirmation',
        subject: 'Order #{orderNumber} Confirmed',
        bodyText: 'Thank you for your order! Order #{orderNumber}',
        bodyHtml: '<h1>Thank you for your order!</h1><p>Order: {{orderNumber}}</p>',
        variables: ['orderNumber', 'customerName', 'totalPrice'],
      },
      'shipping-update': {
        id: 'shipping-update',
        name: 'Shipping Update',
        subject: 'Your order #{orderNumber} has shipped!',
        bodyText: 'Your order is on its way! Tracking: {{trackingNumber}}',
        bodyHtml: '<h1>Your order has shipped!</h1><p>Tracking: {{trackingNumber}}</p>',
        variables: ['orderNumber', 'trackingNumber'],
      },
      'password-reset': {
        id: 'password-reset',
        name: 'Password Reset',
        subject: 'Reset your TechStore password',
        bodyText: 'Click here to reset: {{resetLink}}',
        bodyHtml: '<a href="{{resetLink}}">Reset Password</a>',
        variables: ['resetLink'],
      },
    };

    const template = templates[templateId];
    if (!template) return false;

    let subject = template.subject;
    let html = template.bodyHtml;

    // Replace variables
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      subject = subject.replace(regex, value);
      html = html.replace(regex, value);
    });

    return this.sendEmail(to, subject, html);
  }
}

/**
 * SMS notification service (Twilio style)
 */
export class SMSNotificationService {
  private accountSid = process.env.SMS_ACCOUNT_SID || 'dev-sid';
  private authToken = process.env.SMS_AUTH_TOKEN || 'dev-token';
  private fromNumber = process.env.SMS_FROM_NUMBER || '+1234567890';

  /**
   * Send SMS notification
   */
  async sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.twilio.com/2010-04-01/Accounts/send-sms', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.accountSid}:${this.authToken}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: phoneNumber,
          Body: message,
        }).toString(),
      });

      return response.ok;
    } catch (error) {
      console.error('SMS notification error:', error);
      return false;
    }
  }

  /**
   * Send bulk SMS
   */
  async sendBulk(phoneNumbers: string[], message: string): Promise<boolean[]> {
    return Promise.all(phoneNumbers.map((phone) => this.sendSMS(phone, message)));
  }
}

/**
 * In-app notification store (using memory, replace with database)
 */
export class InAppNotificationService {
  private notifications: Map<string, Notification[]> = new Map();

  /**
   * Create in-app notification
   */
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const id = `notif-${Date.now()}-${Math.random()}`;
    const newNotification: Notification = {
      ...notification,
      id,
      createdAt: new Date(),
    };

    const userNotifications = this.notifications.get(notification.userId) || [];
    userNotifications.push(newNotification);
    this.notifications.set(notification.userId, userNotifications);

    return newNotification;
  }

  /**
   * Get user notifications
   */
  async getNotifications(userId: string, limit = 50): Promise<Notification[]> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.slice(-limit).reverse();
  }

  /**
   * Get unread notifications count
   */
  async getUnreadCount(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId) || [];
    return userNotifications.filter((n) => !n.read).length;
  }

  /**
   * Mark notification as read
   */
  async markAsRead(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const notification = userNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return true;
    }

    return false;
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    userNotifications.forEach((n) => {
      n.read = true;
    });

    return true;
  }

  /**
   * Delete notification
   */
  async deleteNotification(userId: string, notificationId: string): Promise<boolean> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const index = userNotifications.findIndex((n) => n.id === notificationId);
    if (index > -1) {
      userNotifications.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Clear expired notifications
   */
  async clearExpired(userId: string): Promise<number> {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return 0;

    const now = new Date();
    const before = userNotifications.length;

    const filtered = userNotifications.filter((n) => {
      if (n.expiresAt && n.expiresAt < now) {
        return false;
      }
      return true;
    });

    this.notifications.set(userId, filtered);
    return before - filtered.length;
  }
}

/**
 * Unified notification manager
 */
export class NotificationManager {
  private pushService: PushNotificationService;
  private emailService: EmailNotificationService;
  private smsService: SMSNotificationService;
  private inAppService: InAppNotificationService;

  constructor() {
    this.pushService = new PushNotificationService();
    this.emailService = new EmailNotificationService();
    this.smsService = new SMSNotificationService();
    this.inAppService = new InAppNotificationService();
  }

  /**
   * Send multi-channel notification
   */
  async send(
    userId: string,
    title: string,
    message: string,
    channels: ('push' | 'email' | 'sms' | 'in-app')[] = ['in-app'],
    options?: {
      deviceToken?: string;
      email?: string;
      phone?: string;
      data?: Record<string, unknown>;
    }
  ): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};

    if (channels.includes('push') && options?.deviceToken) {
      results.push = await this.pushService.sendPush(
        options.deviceToken,
        title,
        message,
        options.data
      );
    }

    if (channels.includes('email') && options?.email) {
      results.email = await this.emailService.sendEmail(
        options.email,
        title,
        `<h1>${title}</h1><p>${message}</p>`
      );
    }

    if (channels.includes('sms') && options?.phone) {
      results.sms = await this.smsService.sendSMS(options.phone, message);
    }

    if (channels.includes('in-app')) {
      const notification = await this.inAppService.createNotification({
        userId,
        type: 'in-app',
        title,
        message,
        data: options?.data,
        read: false,
      });
      results['in-app'] = !!notification;
    }

    return results;
  }

  /**
   * Get notification services
   */
  getServices() {
    return {
      push: this.pushService,
      email: this.emailService,
      sms: this.smsService,
      inApp: this.inAppService,
    };
  }
}
