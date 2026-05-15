import { create } from 'zustand';
import type { OrderType, TimeWindow } from '../lib/firestore';

export interface OrderFormState {
  step: number;
  type: OrderType | null;
  recipientName: string;
  campus: string;
  location: string;
  deliveryDay: string;
  timeWindow: TimeWindow;
  senderPhone: string;
  paymentRef: string;
  submittedOrderId: string | null;
  deliveryMethod: 'in_person' | 'phone_call' | null;
  prankMessage: string;
  recipientPhone: string;

  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setType: (type: OrderType) => void;
  setRecipientName: (name: string) => void;
  setCampus: (campus: string) => void;
  setLocation: (location: string) => void;
  setDeliveryDay: (day: string) => void;
  setTimeWindow: (tw: TimeWindow) => void;
  setSenderPhone: (phone: string) => void;
  setPaymentRef: (ref: string) => void;
  setSubmittedOrderId: (id: string) => void;
  setDeliveryMethod: (method: 'in_person' | 'phone_call' | null) => void;
  setPrankMessage: (msg: string) => void;
  setRecipientPhone: (phone: string) => void;
  reset: () => void;
}

const initialState = {
  step: 1,
  type: null,
  recipientName: '',
  campus: '',
  location: '',
  deliveryDay: 'Friday',
  timeWindow: 'day' as TimeWindow,
  senderPhone: '',
  paymentRef: '',
  submittedOrderId: null,
  deliveryMethod: null,
  prankMessage: '',
  recipientPhone: '',
};

export const useOrderStore = create<OrderFormState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: s.step + 1 })),
  prevStep: () => set((s) => ({ step: Math.max(1, s.step - 1) })),
  setType: (type) => set({ type }),
  setRecipientName: (recipientName) => set({ recipientName }),
  setCampus: (campus) => set({ campus }),
  setLocation: (location) => set({ location }),
  setDeliveryDay: (deliveryDay) => set({ deliveryDay }),
  setTimeWindow: (timeWindow) => set({ timeWindow }),
  setSenderPhone: (senderPhone) => set({ senderPhone }),
  setPaymentRef: (paymentRef) => set({ paymentRef }),
  setSubmittedOrderId: (submittedOrderId) => set({ submittedOrderId }),
  setDeliveryMethod: (deliveryMethod) => set({ deliveryMethod }),
  setPrankMessage: (prankMessage) => set({ prankMessage }),
  setRecipientPhone: (recipientPhone) => set({ recipientPhone }),
  reset: () => set(initialState),
}));
