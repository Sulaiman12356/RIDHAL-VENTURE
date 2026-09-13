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
import { DeliveryZone } from '../types';

const DELIVERY_ZONES_COLLECTION = 'deliveryZones';

// Initial realistic default delivery zones for Ridhal Ventures (centered in Ijebu-Ode, Ogun State)
export const DEFAULT_DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'zone-ijebu-ode-central',
    name: 'Ijebu-Ode Town (Central, Bass St, New Market, Molipa, Apebi)',
    fee: 1500,
    estimatedTime: 'Same Day / Next Day Delivery',
    available: true,
    allowPayOnDelivery: true,
    description: 'Direct door-to-door rider dispatch within Ijebu-Ode metropolis.'
  },
  {
    id: 'zone-ijebu-environs',
    name: 'Ijebu Environs (Ago-Iwoye, Ijebu-Igbo, Oru, Obalende, Ilese)',
    fee: 2500,
    estimatedTime: '1 to 2 Business Days',
    available: true,
    allowPayOnDelivery: true,
    description: 'Local campus and outskirts dispatch across nearby Ijebu towns.'
  },
  {
    id: 'zone-ogun-other',
    name: 'Ogun State Other (Abeokuta, Sagamu, Mowe, Ibafo, Sango Ota)',
    fee: 3000,
    estimatedTime: '1 to 3 Business Days',
    available: true,
    allowPayOnDelivery: false,
    description: 'Dedicated intrastate courier delivery across Ogun State.'
  },
  {
    id: 'zone-lagos-express',
    name: 'Lagos State Express (Mainland & Island, Lekki, Ikeja)',
    fee: 3500,
    estimatedTime: '1 to 2 Business Days',
    available: true,
    allowPayOnDelivery: false,
    description: 'Interstate rapid transit directly to Lagos residences & offices.'
  },
  {
    id: 'zone-south-west',
    name: 'South-West States (Oyo/Ibadan, Osun, Ondo, Ekiti, Kwara)',
    fee: 4000,
    estimatedTime: '2 to 3 Business Days',
    available: true,
    allowPayOnDelivery: false,
    description: 'Regional courier delivery to major South-West state capitals & cities.'
  },
  {
    id: 'zone-abuja-fct',
    name: 'Abuja (FCT) & Northern States (Kano, Kaduna, Jos)',
    fee: 5000,
    estimatedTime: '3 to 5 Business Days',
    available: true,
    allowPayOnDelivery: false,
    description: 'Air cargo / interstate motor park logistics to Federal Capital & North.'
  },
  {
    id: 'zone-south-east-south',
    name: 'South-East & South-South (Rivers/PH, Delta, Edo, Enugu, Anambra)',
    fee: 5000,
    estimatedTime: '3 to 5 Business Days',
    available: true,
    allowPayOnDelivery: false,
    description: 'Secure interstate transport and doorstep delivery.'
  }
];

// Seed default delivery zones if not existing in Firestore
export async function seedDeliveryZonesIfEmpty(): Promise<DeliveryZone[]> {
  try {
    const colRef = collection(db, DELIVERY_ZONES_COLLECTION);
    const snapshot = await getDocs(colRef);
    
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as DeliveryZone));
    }

    const seeded: DeliveryZone[] = [];
    for (const zone of DEFAULT_DELIVERY_ZONES) {
      const docRef = doc(db, DELIVERY_ZONES_COLLECTION, zone.id);
      await setDoc(docRef, zone);
      seeded.push(zone);
    }
    return seeded;
  } catch (err) {
    console.warn('Could not seed delivery zones to Firestore, using defaults:', err);
    return DEFAULT_DELIVERY_ZONES;
  }
}

// Fetch all delivery zones
export async function getAllDeliveryZones(): Promise<DeliveryZone[]> {
  try {
    const colRef = collection(db, DELIVERY_ZONES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return await seedDeliveryZonesIfEmpty();
    }
    return snapshot.docs.map(d => ({ ...d.data(), id: d.id } as DeliveryZone));
  } catch (error) {
    console.error('Error fetching delivery zones:', error);
    return DEFAULT_DELIVERY_ZONES;
  }
}

// Admin: update delivery zone
export async function updateDeliveryZone(id: string, updates: Partial<DeliveryZone>): Promise<void> {
  try {
    const docRef = doc(db, DELIVERY_ZONES_COLLECTION, id);
    await updateDoc(docRef, updates);
  } catch (error) {
    console.error('Error updating delivery zone:', error);
    throw error;
  }
}

// Admin: create delivery zone
export async function createDeliveryZone(zone: Omit<DeliveryZone, 'id'>): Promise<DeliveryZone> {
  const newId = 'zone_' + Date.now().toString(36);
  const newZone: DeliveryZone = { ...zone, id: newId };
  try {
    const docRef = doc(db, DELIVERY_ZONES_COLLECTION, newId);
    await setDoc(docRef, newZone);
    return newZone;
  } catch (error) {
    console.error('Error creating delivery zone:', error);
    throw error;
  }
}

// Admin: delete delivery zone
export async function deleteDeliveryZone(id: string): Promise<void> {
  try {
    const docRef = doc(db, DELIVERY_ZONES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting delivery zone:', error);
    throw error;
  }
}

export const getDeliveryZones = getAllDeliveryZones;

export async function saveDeliveryZone(zone: Partial<DeliveryZone> & { id?: string }): Promise<void> {
  if (zone.id && !zone.id.startsWith('temp_')) {
    await updateDeliveryZone(zone.id, zone);
  } else {
    const { id, ...data } = zone;
    await createDeliveryZone(data as any);
  }
}
