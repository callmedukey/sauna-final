import { RoomType } from "@prisma/client";

// Type for reservation details
export interface ReservationDetails {
  date: string;
  time: string;
  roomType: RoomType;
  men: number;
  women: number;
  children: number;
  infants: number;
  message: string;
  usedPoint: number;
  price: number;
  paidPrice: number;
  orderId: string;
  paymentKey: string;
  paymentStatus: string;
  isWeekend: boolean;
}

export async function storePendingReservation(orderId: string, details: ReservationDetails) {
  const response = await fetch('/api/payments/pending', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ orderId, details }),
  });

  if (!response.ok) {
    throw new Error('Failed to store pending reservation');
  }

  return response.json();
}

// These functions are only used server-side, so we don't need client implementations
export const getPendingReservation = null;
export const deletePendingReservation = null; 