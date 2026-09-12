import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProductReview } from '../types';

export type { ProductReview } from '../types';

const REVIEWS_COLLECTION = 'reviews';

// Fetch reviews for a specific product
export async function getProductReviews(productId: string): Promise<ProductReview[]> {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snap = await getDocs(colRef);
    if (snap.empty) return [];

    const reviews = snap.docs
      .map(d => ({ ...d.data(), id: d.id } as ProductReview))
      .filter(r => r.productId === productId && (r.status === 'approved' || !r.status));

    return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

// Fetch all reviews for admin moderation
export async function getAllReviews(): Promise<ProductReview[]> {
  try {
    const colRef = collection(db, REVIEWS_COLLECTION);
    const snap = await getDocs(colRef);
    return snap.docs
      .map(d => ({ ...d.data(), id: d.id } as ProductReview))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    return [];
  }
}

// Submit a customer review
export async function submitProductReview(reviewData: {
  productId: string;
  customerId?: string;
  customerName: string;
  rating: number;
  comment: string;
  verifiedBuyer?: boolean;
}): Promise<ProductReview> {
  if (!reviewData.customerName.trim() || !reviewData.comment.trim()) {
    throw new Error('Please provide your name and your thoughts on this product.');
  }

  const newId = 'rev_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const payload: ProductReview = {
    id: newId,
    productId: reviewData.productId,
    customerId: reviewData.customerId || undefined,
    customerName: reviewData.customerName.trim(),
    rating: Math.min(5, Math.max(1, reviewData.rating || 5)),
    comment: reviewData.comment.trim(),
    verifiedBuyer: Boolean(reviewData.verifiedBuyer),
    status: 'approved', // Auto-publish real customer feedback
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, REVIEWS_COLLECTION, newId);
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    console.error('Error saving review to Firestore:', error);
    throw error;
  }
}

// Admin: delete review
export async function deleteReview(id: string): Promise<void> {
  try {
    const docRef = doc(db, REVIEWS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

// Calculate summary rating from real reviews
export function calculateReviewStats(reviews: ProductReview[]): {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
} {
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    };
  }

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;

  for (const r of reviews) {
    const rounded = Math.round(r.rating);
    distribution[rounded] = (distribution[rounded] || 0) + 1;
    sum += r.rating;
  }

  return {
    averageRating: Number((sum / reviews.length).toFixed(1)),
    totalReviews: reviews.length,
    ratingDistribution: distribution
  };
}
