import { Order } from '../types';

export interface NotificationStatusResponse {
  configured: boolean;
  provider: 'resend' | 'sendgrid' | 'smtp' | null;
  targetRecipient: string;
}

export interface SendNotificationResult {
  success: boolean;
  sent: boolean;
  provider?: string;
  messageId?: string;
  recipient?: string;
  message: string;
  error?: string;
}

export async function checkNotificationStatus(): Promise<NotificationStatusResponse> {
  try {
    const res = await fetch('/api/notifications/status');
    if (!res.ok) {
      return {
        configured: false,
        provider: null,
        targetRecipient: 'alhajabizventure@gmail.com'
      };
    }
    return await res.json();
  } catch {
    return {
      configured: false,
      provider: null,
      targetRecipient: 'alhajabizventure@gmail.com'
    };
  }
}

export async function sendOrderNotificationToAdmin(order: Partial<Order>): Promise<SendNotificationResult> {
  try {
    const response = await fetch('/api/orders/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(order)
    });

    const data = await response.json();
    return {
      success: Boolean(data.success),
      sent: Boolean(data.sent),
      provider: data.provider,
      messageId: data.messageId,
      recipient: data.recipient || 'alhajabizventure@gmail.com',
      message: data.message || (data.sent ? 'Email notification successfully delivered' : 'Notification was not sent'),
      error: data.error
    };
  } catch (err: any) {
    return {
      success: false,
      sent: false,
      recipient: 'alhajabizventure@gmail.com',
      message: 'Failed to contact backend notification service: ' + (err.message || 'Network error'),
      error: 'NETWORK_ERROR'
    };
  }
}
