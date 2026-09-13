import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Customer, DeliveryAddress, Order } from '../types';
import { getAllOrders } from './orderService';

const CUSTOMERS_COLLECTION = 'customers';

export async function getAllCustomers(): Promise<Customer[]> {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const dbCustomers = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Customer));

    // If standalone customers collection already has records, return them
    if (dbCustomers.length > 0) {
      return dbCustomers;
    }

    // Otherwise, seamlessly aggregate customer profiles from existing orders
    const orders = await getAllOrders();
    const customerMap = new Map<string, Customer>();

    for (const ord of orders) {
      const email = ord.customerDetails?.email || ord.customer?.email;
      const phone = ord.customerDetails?.phone || ord.customer?.phone;
      const name = ord.customerDetails?.fullName || ord.customer?.fullName;
      const address = ord.customerDetails?.deliveryAddress || ord.customer?.deliveryAddress;
      const city = ord.customerDetails?.city || ord.customer?.city;
      const state = ord.customerDetails?.state || ord.customer?.state;

      if (email || phone || name) {
        const id = (phone || email || ord.customerId || 'cust_' + ord.id).replace(/[^a-zA-Z0-9]/g, '_');
        if (!customerMap.has(id)) {
          customerMap.set(id, {
            id,
            name: name || 'Customer',
            email: email || '',
            phone: phone || '',
            addresses: [{
              id: 'addr_' + id,
              fullName: name || 'Customer',
              phone: phone || '',
              address: address || '',
              city: city || '',
              state: state || '',
              isDefault: true
            }],
            createdAt: ord.createdAt
          });
        }
      }
    }

    return Array.from(customerMap.values());
  } catch (error) {
    console.warn('Notice loading customers from collection, checking orders fallback:', error);
    try {
      const orders = await getAllOrders();
      const customerMap = new Map<string, Customer>();

      for (const ord of orders) {
        const email = ord.customerDetails?.email || ord.customer?.email;
        const phone = ord.customerDetails?.phone || ord.customer?.phone;
        const name = ord.customerDetails?.fullName || ord.customer?.fullName;
        const address = ord.customerDetails?.deliveryAddress || ord.customer?.deliveryAddress;
        const city = ord.customerDetails?.city || ord.customer?.city;
        const state = ord.customerDetails?.state || ord.customer?.state;

        if (email || phone || name) {
          const id = (phone || email || ord.customerId || 'cust_' + ord.id).replace(/[^a-zA-Z0-9]/g, '_');
          if (!customerMap.has(id)) {
            customerMap.set(id, {
              id,
              name: name || 'Customer',
              email: email || '',
              phone: phone || '',
              addresses: [{
                id: 'addr_' + id,
                fullName: name || 'Customer',
                phone: phone || '',
                address: address || '',
                city: city || '',
                state: state || '',
                isDefault: true
              }],
              createdAt: ord.createdAt
            });
          }
        }
      }

      return Array.from(customerMap.values());
    } catch {
      return [];
    }
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
