// Mock data for development without backend

import {
  Service,
  Booking,
  TimeSlot,
  AvailabilitySchedule,
  User,
  Notification,
} from "./types";

export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Ahmad Rizki",
    email: "ahmad@example.com",
    role: "user",
    phone: "081234567890",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "provider-1",
    name: "Lapangan Merdeka",
    email: "merdeka@example.com",
    role: "provider",
    phone: "081234567891",
    createdAt: "2025-01-01T00:00:00Z",
  },
];

export const mockServices: Service[] = [
  {
    id: "service-1",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    title: "Lapangan Futsal A",
    description:
      "Lapangan futsal indoor dengan rumput sintetis berkualitas tinggi. Dilengkapi dengan lampu LED dan AC.",
    duration: 60,
    price: 200000,
    category: "Futsal",
    imageUrl: "/football-field.svg",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "service-2",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    title: "Lapangan Futsal B",
    description:
      "Lapangan futsal outdoor dengan rumput sintetis. Cocok untuk latihan tim.",
    duration: 60,
    price: 150000,
    category: "Futsal",
    imageUrl: "/football-field-medium.svg",
    createdAt: "2025-01-02T00:00:00Z",
  },
  {
    id: "service-3",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    title: "Lapangan Mini Soccer",
    description: "Lapangan mini soccer 7v7 dengan standar internasional.",
    duration: 90,
    price: 300000,
    category: "Mini Soccer",
    imageUrl: "/football-field-small.svg",
    createdAt: "2025-01-03T00:00:00Z",
  },
];

export const mockAvailability: AvailabilitySchedule[] = [
  {
    id: "avail-1",
    providerId: "provider-1",
    dayOfWeek: 1,
    startTime: "08:00",
    endTime: "22:00",
    isActive: true,
  },
  {
    id: "avail-2",
    providerId: "provider-1",
    dayOfWeek: 2,
    startTime: "08:00",
    endTime: "22:00",
    isActive: true,
  },
  {
    id: "avail-3",
    providerId: "provider-1",
    dayOfWeek: 3,
    startTime: "08:00",
    endTime: "22:00",
    isActive: true,
  },
  {
    id: "avail-4",
    providerId: "provider-1",
    dayOfWeek: 4,
    startTime: "08:00",
    endTime: "22:00",
    isActive: true,
  },
  {
    id: "avail-5",
    providerId: "provider-1",
    dayOfWeek: 5,
    startTime: "08:00",
    endTime: "23:00",
    isActive: true,
  },
  {
    id: "avail-6",
    providerId: "provider-1",
    dayOfWeek: 6,
    startTime: "07:00",
    endTime: "23:00",
    isActive: true,
  },
  {
    id: "avail-7",
    providerId: "provider-1",
    dayOfWeek: 0,
    startTime: "07:00",
    endTime: "22:00",
    isActive: true,
  },
];

// Generate time slots for today and next 7 days
function generateTimeSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const today = new Date();

  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateStr = date.toISOString().split("T")[0];

    for (let hour = 8; hour < 22; hour++) {
      const isBooked = Math.random() < 0.3; // 30% chance of being booked
      slots.push({
        id: `slot-${dateStr}-${hour}`,
        serviceId: "service-1",
        date: dateStr,
        startTime: `${hour.toString().padStart(2, "0")}:00`,
        endTime: `${(hour + 1).toString().padStart(2, "0")}:00`,
        isAvailable: !isBooked,
      });
    }
  }

  return slots;
}

export const mockTimeSlots: TimeSlot[] = generateTimeSlots();

export const mockBookings: Booking[] = [
  {
    id: "booking-1",
    userId: "user-1",
    userName: "Ahmad Rizki",
    userEmail: "ahmad@example.com",
    serviceId: "service-1",
    serviceTitle: "Lapangan Futsal A",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    date: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed",
    totalPrice: 200000,
    notes: "Tim latihan rutin",
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:30:00Z",
  },
  {
    id: "booking-2",
    userId: "user-1",
    userName: "Ahmad Rizki",
    userEmail: "ahmad@example.com",
    serviceId: "service-2",
    serviceTitle: "Lapangan Futsal B",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    date: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
    startTime: "14:00",
    endTime: "15:00",
    status: "pending",
    totalPrice: 150000,
    createdAt: "2025-01-10T09:00:00Z",
    updatedAt: "2025-01-10T09:00:00Z",
  },
  {
    id: "booking-3",
    userId: "user-1",
    userName: "Ahmad Rizki",
    userEmail: "ahmad@example.com",
    serviceId: "service-1",
    serviceTitle: "Lapangan Futsal A",
    providerId: "provider-1",
    providerName: "Lapangan Merdeka",
    date: new Date(Date.now() - 86400000 * 3).toISOString().split("T")[0], // 3 days ago
    startTime: "16:00",
    endTime: "17:00",
    status: "completed",
    totalPrice: 200000,
    createdAt: "2025-01-07T10:00:00Z",
    updatedAt: "2025-01-07T17:00:00Z",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-1",
    title: "Booking Dikonfirmasi",
    message:
      "Booking Anda untuk Lapangan Futsal A pada 10 Jan telah dikonfirmasi.",
    type: "booking",
    isRead: false,
    createdAt: "2025-01-10T08:30:00Z",
  },
  {
    id: "notif-2",
    userId: "user-1",
    title: "Pengingat Booking",
    message: "Jangan lupa! Anda memiliki booking besok pukul 14:00.",
    type: "reminder",
    isRead: true,
    createdAt: "2025-01-09T18:00:00Z",
  },
];

// Helper functions for mock data operations
export function getServiceById(id: string): Service | undefined {
  return mockServices.find((s) => s.id === id);
}

export function getBookingById(id: string): Booking | undefined {
  return mockBookings.find((b) => b.id === id);
}

export function getBookingsByUserId(userId: string): Booking[] {
  return mockBookings.filter((b) => b.userId === userId);
}

export function getBookingsByProviderId(providerId: string): Booking[] {
  return mockBookings.filter((b) => b.providerId === providerId);
}

export function getServicesByProviderId(providerId: string): Service[] {
  return mockServices.filter((s) => s.providerId === providerId);
}

export function getAvailableSlotsForService(
  serviceId: string,
  date: string
): TimeSlot[] {
  return mockTimeSlots.filter(
    (s) => s.serviceId === serviceId && s.date === date && s.isAvailable
  );
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTime(time: string): string {
  return time;
}
