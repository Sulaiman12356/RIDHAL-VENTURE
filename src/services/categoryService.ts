import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CategoryItem } from '../types';
import { CATEGORIES as INITIAL_CATEGORIES } from '../data/categories';

const CATEGORIES_COLLECTION = 'categories';

export async function seedCategoriesIfEmpty(): Promise<CategoryItem[]> {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as CategoryItem));
    }

    console.log('Seeding initial categories to Firestore...');
    const seeded: CategoryItem[] = [];
    for (const cat of INITIAL_CATEGORIES) {
      const docRef = doc(db, CATEGORIES_COLLECTION, cat.id);
      await setDoc(docRef, cat);
      seeded.push(cat);
    }
    return seeded;
  } catch (error) {
    console.warn('Could not seed Firestore categories:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function getAllCategories(): Promise<CategoryItem[]> {
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return await seedCategoriesIfEmpty();
    }
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as CategoryItem));
  } catch (error) {
    console.error('Error fetching categories from Firestore:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function createCategory(cat: Omit<CategoryItem, 'id'> & { id?: string }): Promise<CategoryItem> {
  const id = cat.id || cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const payload: CategoryItem = {
    ...cat,
    id,
    slug: cat.slug || id
  };
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}

export async function updateCategory(id: string, updates: Partial<CategoryItem>): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
}

export async function deleteCategory(id: string): Promise<void> {
  try {
    const docRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
