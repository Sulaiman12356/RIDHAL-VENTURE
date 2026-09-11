import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy,
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Order, OrderStatus, PaymentStatus } from '../types';

const ORDERS_COLLECTION = 'orders';

export async function getAllOrders(): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const snapshot = await getDocs(ordersRef);
    
    if (snapshot.empty) {
      return [];
    }
    
    const orders = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Order));

    // Sort descending by creation date
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching orders from Firestore:', error);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...snapshot.data(), id: snapshot.id } as Order;
    }
    return null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

export async function updateOrderNotificationStatus(
  orderId: string, 
  notificationStatus: Order['notificationStatus']
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { notificationStatus });
  } catch (error) {
    console.error('Error updating order notification status:', error);
  }
}

export async function createOrder(orderPayload: Omit<Order, 'id'> & { id?: string }): Promise<Order> {
  const orderId = orderPayload.id || `RV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const order: Order = {
    ...orderPayload,
    id: orderId,
    orderNumber: orderId,
    createdAt: orderPayload.createdAt || new Date().toISOString()
  };

  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(docRef, order);

    // Prepare backend notification to alhajabizventure@gmail.com
    try {
      const { sendOrderNotificationToAdmin } = await import('./notificationService');
      const notifyResult = await sendOrderNotificationToAdmin(order);
      
      const notificationStatus = {
        sent: notifyResult.sent,
        provider: notifyResult.provider,
        messageId: notifyResult.messageId,
        sentAt: notifyResult.sent ? new Date().toISOString() : undefined,
        recipient: notifyResult.recipient || 'alhajabizventure@gmail.com',
        details: notifyResult.message
      };

      order.notificationStatus = notificationStatus;
      await updateDoc(docRef, { notificationStatus });
    } catch (notifErr) {
      console.warn('Backend notification trigger completed with status:', notifErr);
    }

    return order;
  } catch (error) {
    console.error('Error creating order in Firestore:', error);
    throw error;
  }
}


export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { 
      orderStatus,
      status: orderStatus // keep backwards compatibility
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, { paymentStatus });
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}
