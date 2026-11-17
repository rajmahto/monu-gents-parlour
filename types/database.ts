// types/database.ts
export type TabType = 'home' | 'token' | 'services' | 'details';
export type OwnerSubTab = 'floor' | 'services' | 'earnings' | 'settings';
export type BookingStatus = 'waiting' | 'in_service' | 'completed' | 'no_show' | 'cancelled';

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  duration: number; 
    desc: string;
    photoUri?: string;
}

export interface Booking {
  id: string;
  token: string;
  name: string;
  phone: string;
  serviceName: string;
  price: number;
  duration: number;
  status: BookingStatus;
  chairId?: 1 | 2;
  time: string;
  type: 'online' | 'walk_in';
  reviewed?: boolean;
}

export interface ReviewItem {
  id: string;
  bookingId?: string;
  name: string;
  rating: number;
  comment: string;
  photoUri?: string;
  date: string;
}

export interface EarningRecord {
  id: string;
  desc: string;
  amount: number;
  method: 'CASH' | 'UPI';
  entryType: 'BOOKING' | 'MANUAL';
  time: string;
  date?: string;
  chairId?: 1 | 2; 
}