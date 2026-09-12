import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus } from '../types';
import { getOrderById } from './orderService';

export const ORDER_STATUS_STEPS: {
  status: OrderStatus;
  title: string;
  description: string;
  badgeColor: string;
}[] = [
  {
    status: 'Order received',
    title: 'Order Received',
    description: 'We have registered your order request in our system.',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    status: 'Payment pending',
    title: 'Payment Pending',
    description: 'Awaiting payment confirmation via transfer or card.',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  {
    status: 'Payment confirmed',
    title: 'Payment Confirmed',
    description: 'Your payment was successfully verified by our accounting team.',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    status: 'Processing',
    title: 'Packaging & Inspection',
    description: 'Items are being inspected, ironed, and packaged with care.',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200'
  },
  {
    status: 'Ready for delivery',
    title: 'Ready for Dispatch',
    description: 'Parcel sealed and handed over to our dispatch rider or courier.',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    status: 'Shipped',
    title: 'In Transit / On the Way',
    description: 'The dispatch rider / transit courier is en route to your address.',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-300'
  },
  {
    status: 'Delivered',
    title: 'Delivered to Customer',
    description: 'Package successfully delivered and received in good condition.',
    badgeColor: 'bg-green-50 text-green-700 border-green-200'
  }
];

// Helper to normalize any order status string
export function normalizeOrderStatus(rawStatus?: string): OrderStatus {
  if (!rawStatus) return 'Order received';
  const clean = rawStatus.toLowerCase().trim();
  if (clean === 'cancelled' || clean === 'canceled') return 'Cancelled';
  if (clean.includes('deliver') && (clean.includes('ed') || clean === 'delivered')) return 'Delivered';
  if (clean.includes('ship') || clean.includes('transit')) return 'Shipped';
  if (clean.includes('ready')) return 'Ready for delivery';
  if (clean.includes('process')) return 'Processing';
  if (clean.includes('confirm') || (clean.includes('paid') && !clean.includes('pending'))) return 'Payment confirmed';
  if (clean.includes('pending') && (clean.includes('payment') || clean.includes('pay'))) return 'Payment pending';
  if (clean === 'pending') return 'Order received';
  return 'Order received';
}

// Get the step index (0 to 6)
export function getOrderStatusStepIndex(status?: string): number {
  const normalized = normalizeOrderStatus(status);
  if (normalized === 'Cancelled') return -1;
  const idx = ORDER_STATUS_STEPS.findIndex(s => s.status === normalized);
  return idx !== -1 ? idx : 0;
}

// Track an order by ID or Order Number
export async function trackOrder(orderReference: string): Promise<Order | null> {
  const refClean = orderReference.trim();
  if (!refClean) return null;

  // Try direct ID
  const directOrder = await getOrderById(refClean);
  if (directOrder) return directOrder;

  // Or query by orderNumber if not found directly
  const { getAllOrders } = await import('./orderService');
  const all = await getAllOrders();
  const found = all.find(
    o => o.orderNumber?.toUpperCase() === refClean.toUpperCase() ||
         o.id.toUpperCase() === refClean.toUpperCase()
  );
  return found || null;
}
