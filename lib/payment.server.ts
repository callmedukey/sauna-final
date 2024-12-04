import { storePendingReservation as _storePendingReservation, getPendingReservation as _getPendingReservation, deletePendingReservation as _deletePendingReservation } from "./redis.server";
import type { ReservationDetails } from "./payment";

export const storePendingReservation = _storePendingReservation;
export const getPendingReservation = _getPendingReservation;
export const deletePendingReservation = _deletePendingReservation; 