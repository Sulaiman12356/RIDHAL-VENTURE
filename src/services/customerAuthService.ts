import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  where 
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Customer, DeliveryAddress, Order } from '../types';

const CUSTOMER_STORAGE_KEY = 'ridhal_customer_account_v1';
const googleProvider = new GoogleAuthProvider();

// Register a new customer
export async function registerCustomer(email: string, password: string, name: string, phone: string): Promise<Customer> {
  if (!email || !password || !name) {
    throw new Error('Please fill in your full name, email address, and password.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters.');
  }

  const credential = await createUserWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  const user = credential.user;

  await updateProfile(user, { displayName: name.trim() });

  const initialCustomer: Customer = {
    id: user.uid,
    name: name.trim(),
    email: user.email || email.trim().toLowerCase(),
    phone: phone.trim(),
    addresses: [],
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = doc(db, 'customers', user.uid);
    await setDoc(docRef, initialCustomer);
  } catch (err) {
    console.warn('Could not save customer profile to Firestore:', err);
  }

  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(initialCustomer));
  return initialCustomer;
}

// Sign in existing customer with email & password
export async function loginCustomer(email: string, password: string): Promise<Customer> {
  if (!email || !password) {
    throw new Error('Please enter both your email address and password.');
  }

  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  const user = credential.user;

  // Retrieve customer document from Firestore
  let customer: Customer | null = null;
  try {
    const docRef = doc(db, 'customers', user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      customer = { ...snap.data(), id: snap.id } as Customer;
    }
  } catch (err) {
    console.warn('Error reading customer from Firestore:', err);
  }

  if (!customer) {
    customer = {
      id: user.uid,
      name: user.displayName || email.split('@')[0],
      email: user.email || email,
      phone: '',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'customers', user.uid), customer);
    } catch {}
  }

  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  return customer;
}

// Sign in with Google popup
export async function loginWithGoogle(): Promise<Customer> {
  const credential = await signInWithPopup(auth, googleProvider);
  const user = credential.user;

  let customer: Customer | null = null;
  try {
    const docRef = doc(db, 'customers', user.uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      customer = { ...snap.data(), id: snap.id } as Customer;
    }
  } catch (err) {
    console.warn('Error reading customer profile:', err);
  }

  if (!customer) {
    customer = {
      id: user.uid,
      name: user.displayName || 'Valued Customer',
      email: user.email || '',
      phone: '',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'customers', user.uid), customer);
    } catch {}
  }

  localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
  return customer;
}

// Reset password
export async function sendCustomerPasswordReset(email: string): Promise<void> {
  if (!email) {
    throw new Error('Please enter your email address to receive password reset instructions.');
  }
  await sendPasswordResetEmail(auth, email.trim().toLowerCase());
}

// Customer logout
export async function logoutCustomer(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch {}
  localStorage.removeItem(CUSTOMER_STORAGE_KEY);
}

// Get cached customer session
export function getSavedCustomer(): Customer | null {
  try {
    const saved = localStorage.getItem(CUSTOMER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

// Fetch current customer profile from Firestore
export async function fetchCustomerProfile(uid: string): Promise<Customer | null> {
  try {
    const docRef = doc(db, 'customers', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const customer = { ...snap.data(), id: snap.id } as Customer;
      localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
      return customer;
    }
  } catch (err) {
    console.error('Error fetching customer profile:', err);
  }
  return getSavedCustomer();
}

// Update customer profile
export async function updateCustomerProfile(uid: string, updates: Partial<Customer>): Promise<Customer> {
  try {
    const docRef = doc(db, 'customers', uid);
    await updateDoc(docRef, updates);
    const updated = await getDoc(docRef);
    const customer = { ...updated.data(), id: updated.id } as Customer;
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
    return customer;
  } catch (err) {
    console.error('Error updating customer profile in Firestore:', err);
    const current = getSavedCustomer() || {
      id: uid,
      name: '',
      email: '',
      phone: '',
      addresses: [],
      createdAt: new Date().toISOString()
    };
    const merged = { ...current, ...updates };
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }
}

// Add a saved delivery address
export async function addCustomerAddress(uid: string, address: Omit<DeliveryAddress, 'id'>): Promise<Customer> {
  const newAddress: DeliveryAddress = {
    ...address,
    id: 'addr_' + Date.now().toString(36)
  };

  const current = (await fetchCustomerProfile(uid)) || getSavedCustomer();
  if (!current) throw new Error('Customer account not found');

  const addresses = address.isDefault
    ? [newAddress, ...current.addresses.map(a => ({ ...a, isDefault: false }))]
    : [...current.addresses, newAddress];

  return await updateCustomerProfile(uid, { addresses });
}

// Delete a saved delivery address
export async function deleteCustomerAddress(uid: string, addressId: string): Promise<Customer> {
  const current = (await fetchCustomerProfile(uid)) || getSavedCustomer();
  if (!current) throw new Error('Customer account not found');

  const addresses = current.addresses.filter(a => a.id !== addressId);
  // If the default was deleted and addresses remain, make first one default
  if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
    addresses[0].isDefault = true;
  }

  return await updateCustomerProfile(uid, { addresses });
}

// Set an address as default
export async function setDefaultAddress(uid: string, addressId: string): Promise<Customer> {
  const current = (await fetchCustomerProfile(uid)) || getSavedCustomer();
  if (!current) throw new Error('Customer account not found');

  const addresses = current.addresses.map(a => ({
    ...a,
    isDefault: a.id === addressId
  }));

  return await updateCustomerProfile(uid, { addresses });
}

// Fetch customer order history
export async function getCustomerOrders(customerId: string, email?: string): Promise<Order[]> {
  try {
    const ordersCol = collection(db, 'orders');
    const snapshot = await getDocs(ordersCol);
    if (snapshot.empty) return [];

    const allOrders = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));

    const customerOrders = allOrders.filter(order => {
      if (order.customerId === customerId) return true;
      if (email && order.customerDetails?.email?.toLowerCase() === email.toLowerCase()) return true;
      return false;
    });

    return customerOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return [];
  }
}
