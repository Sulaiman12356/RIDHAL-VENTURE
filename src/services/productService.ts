import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { Product } from '../types';
import { PRODUCTS as INITIAL_PRODUCTS } from '../data/products';

const PRODUCTS_COLLECTION = 'products';

// Seed initial catalog if empty in Firestore
export async function seedProductsIfEmpty(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
    }

    console.log('Seeding initial products to Firestore...');
    const seeded: Product[] = [];
    
    for (const item of INITIAL_PRODUCTS) {
      const docRef = doc(db, PRODUCTS_COLLECTION, item.id);
      const productPayload: Product = {
        ...item,
        createdAt: item.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(docRef, productPayload);
      seeded.push(productPayload);
    }
    
    return seeded;
  } catch (error) {
    console.warn('Could not seed Firestore products, using local fallback:', error);
    return INITIAL_PRODUCTS;
  }
}

// Get all products
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef);
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return await seedProductsIfEmpty();
    }
    
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    } as Product));
  } catch (error) {
    console.error('Error fetching products from Firestore:', error);
    return INITIAL_PRODUCTS;
  }
}

// Get single product
export async function getProductById(id: string): Promise<Product | null> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...snapshot.data(), id: snapshot.id } as Product;
    }
    const local = INITIAL_PRODUCTS.find(p => p.id === id);
    return local || null;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return INITIAL_PRODUCTS.find(p => p.id === id) || null;
  }
}

// Create product
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  const newId = 'prod_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
  const now = new Date().toISOString();
  
  const product: Product = {
    ...productData,
    id: newId,
    slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    createdAt: now,
    updatedAt: now,
  };

  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, newId);
    await setDoc(docRef, product);
    return product;
  } catch (error) {
    console.error('Error creating product in Firestore:', error);
    throw error;
  }
}

// Update product
export async function updateProduct(id: string, updates: Partial<Product>): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product in Firestore:', error);
    throw error;
  }
}

// Update Stock
export async function updateProductStock(id: string, newStock: number): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await updateDoc(docRef, {
      stock: Math.max(0, newStock),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
}

// Update Price
export async function updateProductPrice(id: string, price: number, compareAtPrice?: number): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const payload: Record<string, any> = {
      price,
      updatedAt: new Date().toISOString()
    };
    if (compareAtPrice !== undefined) {
      payload.compareAtPrice = compareAtPrice;
    }
    await updateDoc(docRef, payload);
  } catch (error) {
    console.error('Error updating price:', error);
    throw error;
  }
}

// Delete product
export async function deleteProduct(id: string): Promise<void> {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
}

// Compress image for optimal performance and storage limits
export function compressImage(file: File, maxDimension = 1200, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });
}

// Upload product image
export async function uploadProductImage(file: File): Promise<string> {
  // First compress the actual photo to a clean, fast-loading image
  const compressedDataUrl = await compressImage(file, 1200, 0.85);

  try {
    // Try uploading to Firebase Storage if available
    const blob = await (await fetch(compressedDataUrl)).blob();
    const filename = `products/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}.jpg`;
    const storageRef = ref(storage, filename);
    const snapshot = await uploadBytes(storageRef, blob, { contentType: 'image/jpeg' });
    return await getDownloadURL(snapshot.ref);
  } catch (error) {
    console.warn('Firebase Storage upload failed or not configured, using compressed real image URL:', error);
    return compressedDataUrl;
  }
}

