import { 
  doc, 
  getDoc, 
  setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { WishlistDoc } from '../types';

const WISHLIST_COLLECTION = 'wishlist';

export async function getCustomerWishlist(customerId: string): Promise<string[]> {
  try {
    const docRef = doc(db, WISHLIST_COLLECTION, customerId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return (snapshot.data() as WishlistDoc).productIds || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
}

export async function saveCustomerWishlist(customerId: string, productIds: string[]): Promise<void> {
  try {
    const docRef = doc(db, WISHLIST_COLLECTION, customerId);
    const payload: WishlistDoc = {
      id: customerId,
      customerId,
      productIds
    };
    await setDoc(docRef, payload);
  } catch (error) {
    console.error('Error saving wishlist:', error);
  }
}
