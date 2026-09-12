import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, DeliveryAddress } from '../types';

const CUSTOMERS_COLLECTION = 'customers';

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Customer));
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { ...snapshot.data(), id: snapshot.id } as Customer;
    }
    return null;
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function syncCustomer(customerData: {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
}): Promise<Customer> {
  // Use phone or email as the key to prevent duplicate customer profiles
  const sanitizedId = (customerData.phone || customerData.email || 'guest_' + Date.now())
    .replace(/[^a-zA-Z0-9]/g, '_');
  
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, sanitizedId);
    const existing = await getDoc(docRef);

    const addressEntry: DeliveryAddress = {
      id: 'addr_' + Date.now(),
      fullName: customerData.name,
      phone: customerData.phone,
      address: customerData.address,
      city: customerData.city,
      state: customerData.state,
      isDefault: true
    };

    if (existing.exists()) {
      const existingData = existing.data() as Customer;
      const updatedAddresses = [
        addressEntry,
        ...(existingData.addresses || []).filter(
          a => a.address !== customerData.address || a.city !== customerData.city
        )
      ];
      await updateDoc(docRef, {
        name: customerData.name || existingData.name,
        email: customerData.email || existingData.email,
        phone: customerData.phone || existingData.phone,
        addresses: updatedAddresses
      });
      return {
        ...existingData,
        name: customerData.name || existingData.name,
        email: customerData.email || existingData.email,
        phone: customerData.phone || existingData.phone,
        addresses: updatedAddresses
      };
    } else {
      const newCustomer: Customer = {
        id: sanitizedId,
        name: customerData.name,
        email: customerData.email,
        phone: customerData.phone,
        addresses: [addressEntry],
        createdAt: new Date().toISOString()
      };
      await setDoc(docRef, newCustomer);
      return newCustomer;
    }
  } catch (error) {
    console.error('Error syncing customer:', error);
    return {
      id: sanitizedId,
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      addresses: [{
        id: 'addr_' + Date.now(),
        fullName: customerData.name,
        phone: customerData.phone,
        address: customerData.address,
        city: customerData.city,
        state: customerData.state,
        isDefault: true
      }],
      createdAt: new Date().toISOString()
    };
  }
}
