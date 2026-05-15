import {
  collection, addDoc, getDocs, doc, updateDoc, query,
  orderBy, limit, serverTimestamp, where, Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export type OrderType = 'rose' | 'thorn' | 'prank';
export type OrderStatus = 'pending' | 'confirmed' | 'assigned' | 'delivered' | 'retry' | 'refunded';
export type TimeWindow = 'day' | 'night';

export interface Order {
  id?: string;
  type: OrderType;
  recipientName: string;
  campus: string;
  location: string;
  deliveryDay: string;
  timeWindow: TimeWindow;
  status: OrderStatus;
  paymentRef: string;
  senderPhone: string;
  deliveryMethod?: 'in_person' | 'phone_call';
  prankMessage?: string;
  recipientPhone?: string;
  createdAt: Timestamp | null;
  notes?: string;
}

export interface Drop {
  id?: string;
  type: OrderType;
  campus: string;
  location: string;
  deliveredAt: Timestamp | null;
}

export interface Courier {
  id?: string;
  name: string;
  phone: string;
  campus: string;
  status: 'active' | 'suspended' | 'pending';
  earnings: number;
  joinedAt: Timestamp | null;
}

// Orders
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    status: 'pending' as OrderStatus,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const getOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Order));
};

export const updateOrderStatus = async (id: string, status: OrderStatus) => {
  await updateDoc(doc(db, 'orders', id), { status });
};

// Public feed (drops)
export const getDrops = async (count = 20): Promise<Drop[]> => {
  const q = query(collection(db, 'drops'), orderBy('deliveredAt', 'desc'), limit(count));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Drop));
};

export const addDrop = async (drop: Omit<Drop, 'id' | 'deliveredAt'>) => {
  await addDoc(collection(db, 'drops'), {
    ...drop,
    deliveredAt: serverTimestamp(),
  });
};

// Couriers
export const registerCourier = async (courier: Omit<Courier, 'id' | 'joinedAt' | 'earnings' | 'status'>) => {
  const ref = await addDoc(collection(db, 'couriers'), {
    ...courier,
    status: 'pending',
    earnings: 0,
    joinedAt: serverTimestamp(),
  });
  return ref.id;
};

export const getCouriers = async (): Promise<Courier[]> => {
  const snap = await getDocs(collection(db, 'couriers'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Courier));
};

export const getCourierByPhone = async (phone: string): Promise<Courier | null> => {
  const q = query(collection(db, 'couriers'), where('phone', '==', phone));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() } as Courier;
};

export const updateCourierStatus = async (id: string, status: Courier['status']) => {
  await updateDoc(doc(db, 'couriers', id), { status });
};
