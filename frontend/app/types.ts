// Types for Booking System

export type UserRole = "user" | "provider";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  imageUrl?: string;
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isAvailable: boolean;
}

export interface AvailabilitySchedule {
  id: string;
  providerId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  isActive: boolean;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  serviceId: string;
  serviceTitle: string;
  providerId: string;
  providerName: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "booking" | "reminder" | "system";
  isRead: boolean;
  createdAt: string;
}
