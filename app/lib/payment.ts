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
  isWeekend: boolean;
}

// Store for pending reservations
const pendingReservations = new Map<string, ReservationDetails>();

export function storePendingReservation(orderId: string, details: ReservationDetails) {
  pendingReservations.set(orderId, details);
}

export function getPendingReservation(orderId: string) {
  return pendingReservations.get(orderId);
}

export function deletePendingReservation(orderId: string) {
  pendingReservations.delete(orderId);
} 