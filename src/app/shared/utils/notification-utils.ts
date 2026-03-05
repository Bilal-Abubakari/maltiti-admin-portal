import { Notification } from '@models/notification.model';

/**
 * Get time ago string for a given date string
 */
export function getTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return 'Just now';
  }
  if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`;
  }
  if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)}h ago`;
  }
  if (seconds < 604800) {
    return `${Math.floor(seconds / 86400)}d ago`;
  }
  return date.toLocaleDateString();
}

/**
 * Get icon class for notification topic
 */
export function getNotificationIcon(notification: Notification): string {
  const topic = notification.topic;
  const iconMap: Record<string, string> = {
    ORDER_CREATED: 'pi-shopping-cart',
    ORDER_STATUS_UPDATED: 'pi-refresh',
    ORDER_CANCELLED: 'pi-times-circle',
    ORDER_DELIVERED: 'pi-check-circle',
    ADMIN_NEW_ORDER: 'pi-shopping-cart',
    ADMIN_ORDER_CANCELLED: 'pi-times-circle',
    PAYMENT_RECEIVED: 'pi-money-bill',
    PAYMENT_FAILED: 'pi-exclamation-circle',
    REFUND_PROCESSED: 'pi-replay',
    PRODUCT_CREATED: 'pi-box',
    PRODUCT_PRICE_CHANGED: 'pi-tag',
    PRODUCT_OUT_OF_STOCK: 'pi-exclamation-triangle',
    PRODUCT_BACK_IN_STOCK: 'pi-check',
    ADMIN_LOW_STOCK_ALERT: 'pi-exclamation-triangle',
    USER_ACCOUNT_CREATED: 'pi-user-plus',
    USER_EMAIL_VERIFIED: 'pi-verified',
    USER_PASSWORD_RESET: 'pi-key',
    USER_PROFILE_UPDATED: 'pi-user-edit',
    REVIEW_SUBMITTED: 'pi-star',
    REVIEW_APPROVED: 'pi-check',
    REVIEW_REJECTED: 'pi-times',
    SYSTEM_MAINTENANCE: 'pi-wrench',
    SYSTEM_ANNOUNCEMENT: 'pi-megaphone',
    ADMIN_CONTACT_FORM_SUBMITTED: 'pi-envelope',
  };

  return iconMap[topic] || 'pi-bell';
}

/**
 * Get color class for notification topic based on sentiment
 */
export function getNotificationColor(notification: Notification): string {
  const topic = notification.topic;

  // Grouping by sentiment
  const errorTopics = [
    'PAYMENT_FAILED',
    'ORDER_CANCELLED',
    'ADMIN_ORDER_CANCELLED',
    'PRODUCT_OUT_OF_STOCK',
  ];
  const warningTopics = ['ADMIN_LOW_STOCK_ALERT', 'SYSTEM_MAINTENANCE'];
  const successTopics = [
    'ORDER_DELIVERED',
    'PAYMENT_RECEIVED',
    'PRODUCT_BACK_IN_STOCK',
    'REVIEW_APPROVED',
    'USER_EMAIL_VERIFIED',
  ];

  if (errorTopics.includes(topic)) {
    return 'sentiment-error';
  }
  if (warningTopics.includes(topic)) {
    return 'sentiment-warning';
  }
  if (successTopics.includes(topic)) {
    return 'sentiment-success';
  }
  return 'sentiment-info';
}

/**
 * Track by function for notifications in ngFor
 */
export function trackByNotification(index: number, notification: Notification): string {
  return notification.id;
}

/**
 * Format notification topic for display by replacing underscores with spaces
 */
export function formatTopic(topic: string): string {
  return topic.replaceAll('_', ' ');
}
