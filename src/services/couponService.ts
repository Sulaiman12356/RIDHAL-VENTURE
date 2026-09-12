import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DiscountCoupon } from '../types';

const COUPONS_COLLECTION = 'coupons';

export const DEFAULT_COUPONS: DiscountCoupon[] = [
  {
    id: 'coupon-welcome5',
    code: 'WELCOME5',
    type: 'percentage',
    value: 5,
    minSpend: 10000,
    active: true,
    description: '5% off welcome gift for orders over ₦10,000'
  },
  {
    id: 'coupon-ridhal10',
    code: 'RIDHAL10',
    type: 'percentage',
    value: 10,
    minSpend: 50000,
    active: true,
    description: '10% off for premium orders over ₦50,000'
  },
  {
    id: 'coupon-ijebufree',
    code: 'IJEBUFREE',
    type: 'fixed',
    value: 1500,
    minSpend: 25000,
    active: true,
    description: '₦1,500 off delivery on orders over ₦25,000'
  }
];

export async function seedCouponsIfEmpty(): Promise<DiscountCoupon[]> {
  try {
    const colRef = collection(db, COUPONS_COLLECTION);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map(d => ({ ...d.data(), id: d.id } as DiscountCoupon));
    }

    const seeded: DiscountCoupon[] = [];
    for (const c of DEFAULT_COUPONS) {
      const docRef = doc(db, COUPONS_COLLECTION, c.id);
      await setDoc(docRef, c);
      seeded.push(c);
    }
    return seeded;
  } catch (err) {
    console.warn('Using local default coupons:', err);
    return DEFAULT_COUPONS;
  }
}

export async function getAllCoupons(): Promise<DiscountCoupon[]> {
  try {
    const colRef = collection(db, COUPONS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) {
      return await seedCouponsIfEmpty();
    }
    return snap.docs.map(d => ({ ...d.data(), id: d.id } as DiscountCoupon));
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return DEFAULT_COUPONS;
  }
}

export async function validateCoupon(code: string, subtotal: number): Promise<{
  valid: boolean;
  coupon?: DiscountCoupon;
  discountAmount: number;
  message: string;
}> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) {
    return { valid: false, discountAmount: 0, message: 'Please enter a coupon code.' };
  }

  const coupons = await getAllCoupons();
  const coupon = coupons.find(c => c.code.toUpperCase() === normalized);

  if (!coupon) {
    return { valid: false, discountAmount: 0, message: `Coupon code "${normalized}" is not valid.` };
  }

  if (!coupon.active) {
    return { valid: false, discountAmount: 0, message: `Coupon code "${normalized}" has expired or is inactive.` };
  }

  if (coupon.expiryDate && new Date(coupon.expiryDate).getTime() < Date.now()) {
    return { valid: false, discountAmount: 0, message: `Coupon code "${normalized}" has expired.` };
  }

  if (subtotal < coupon.minSpend) {
    const diff = coupon.minSpend - subtotal;
    return { 
      valid: false, 
      discountAmount: 0, 
      message: `Add ₦${diff.toLocaleString()} more to your bag to activate this coupon (minimum spend: ₦${coupon.minSpend.toLocaleString()}).` 
    };
  }

  let discount = 0;
  if (coupon.type === 'percentage') {
    discount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discount = Math.min(coupon.value, subtotal);
  }

  return {
    valid: true,
    coupon,
    discountAmount: discount,
    message: `Coupon "${coupon.code}" applied! You saved ₦${discount.toLocaleString()}.`
  };
}

export async function createCoupon(coupon: Omit<DiscountCoupon, 'id'>): Promise<DiscountCoupon> {
  const newId = 'coupon_' + Date.now().toString(36);
  const payload: DiscountCoupon = {
    ...coupon,
    id: newId,
    code: coupon.code.trim().toUpperCase()
  };

  try {
    const docRef = doc(db, COUPONS_COLLECTION, newId);
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    console.error('Error creating coupon:', error);
    throw error;
  }
}

export async function updateCoupon(id: string, updates: Partial<DiscountCoupon>): Promise<void> {
  try {
    const docRef = doc(db, COUPONS_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating coupon:', error);
    throw error;
  }
}

export async function deleteCoupon(id: string): Promise<void> {
  try {
    const docRef = doc(db, COUPONS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting coupon:', error);
    throw error;
  }
}

export const getCoupons = getAllCoupons;

export async function toggleCouponStatus(id: string, active: boolean): Promise<void> {
  await updateCoupon(id, { active });
}
