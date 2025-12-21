// API Service Layer for Backend Integration

const API_BASE = "/api/v1";

// Error message translations from English to Indonesian
const errorTranslations: Record<string, string> = {
  // Auth errors
  "Email and password are required": "Email dan password harus diisi",
  "User not found": "Pengguna tidak ditemukan",
  "Email atau password salah": "Email atau password salah",
  "Internal server error": "Terjadi kesalahan server",
  "Email, full_name, and password are required":
    "Email, nama lengkap, dan password harus diisi",
  "Email already registered": "Email sudah terdaftar",
  "Error creating account": "Gagal membuat akun",
  "User not authenticated": "Pengguna tidak terautentikasi",

  // Field errors
  "Only admin can create fields": "Hanya admin yang dapat membuat lapangan",
  "Only admin can delete fields": "Hanya admin yang dapat menghapus lapangan",
  "Field created successfully": "Lapangan berhasil dibuat",
  "Error creating field": "Gagal membuat lapangan",
  "Field updated successfully": "Lapangan berhasil diperbarui",
  "Field not found": "Lapangan tidak ditemukan",
  "Error updating field": "Gagal memperbarui lapangan",
  "Field deleted successfully": "Lapangan berhasil dihapus",
  "Error deleting field": "Gagal menghapus lapangan",
  "Error fetching field": "Gagal mengambil data lapangan",
  "Error fetching fields": "Gagal mengambil data lapangan",
  "Date parameter is required": "Parameter tanggal diperlukan",
  "Field is not available on this day": "Lapangan tidak tersedia pada hari ini",
  "Error fetching available slots": "Gagal mengambil slot tersedia",
  "Field is not available for booking": "Lapangan tidak tersedia untuk booking",

  // Booking errors
  "All fields are required": "Semua field harus diisi",
  "Time slot is already booked": "Slot waktu sudah dibooking",
  "Booking created successfully": "Booking berhasil dibuat",
  "Error creating booking": "Gagal membuat booking",
  "Booking not found or unauthorized":
    "Booking tidak ditemukan atau tidak memiliki akses",
  "Booking not found": "Booking tidak ditemukan",
  "Error fetching booking details": "Gagal mengambil detail booking",
  "Error fetching bookings": "Gagal mengambil data booking",
  "Booking updated successfully": "Booking berhasil diperbarui",
  "Error updating booking": "Gagal memperbarui booking",
  "Booking is already cancelled": "Booking sudah dibatalkan",
  "Cannot cancel completed booking":
    "Tidak dapat membatalkan booking yang sudah selesai",
  "Booking cancelled successfully": "Booking berhasil dibatalkan",
  "Error cancelling booking": "Gagal membatalkan booking",
  "Only admin can confirm bookings":
    "Hanya admin yang dapat mengkonfirmasi booking",
  "Only pending bookings can be confirmed":
    "Hanya booking dengan status menunggu yang dapat dikonfirmasi",
  "Booking confirmed successfully": "Booking berhasil dikonfirmasi",
  "Error confirming booking": "Gagal mengkonfirmasi booking",
  "Only admin can reject bookings": "Hanya admin yang dapat menolak booking",
  "Only pending bookings can be rejected":
    "Hanya booking dengan status menunggu yang dapat ditolak",
  "Booking rejected successfully": "Booking berhasil ditolak",
  "Error rejecting booking": "Gagal menolak booking",

  // Schedule errors
  "Only admin can create schedules": "Hanya admin yang dapat membuat jadwal",
  "field_id, day_of_week, start_time, and end_time are required":
    "field_id, day_of_week, start_time, dan end_time harus diisi",
  "day_of_week must be between 0 (Sunday) and 6 (Saturday)":
    "day_of_week harus antara 0 (Minggu) dan 6 (Sabtu)",
  "start_time must be before end_time": "start_time harus sebelum end_time",
  "Schedule created successfully": "Jadwal berhasil dibuat",
  "Error creating schedule": "Gagal membuat jadwal",
};

// Function to translate error messages
export function translateError(message: string): string {
  // Check exact match first
  if (errorTranslations[message]) {
    return errorTranslations[message];
  }

  // Check for partial matches (for dynamic messages like "Schedule already exists for day X")
  if (message.includes("Schedule already exists for day")) {
    const dayMatch = message.match(/day (\d)/);
    if (dayMatch) {
      return `Jadwal sudah ada untuk hari ke-${dayMatch[1]}`;
    }
  }

  if (message.includes("Cannot modify")) {
    if (message.includes("cancelled")) {
      return "Tidak dapat mengubah booking yang dibatalkan";
    }
    if (message.includes("completed")) {
      return "Tidak dapat mengubah booking yang sudah selesai";
    }
  }

  // Return original if no translation found
  return message;
}

// Types matching backend response
export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  phone?: string;
}

export interface Field {
  id: number;
  name: string;
  field_type: string;
  price_per_hour: number | string;
  is_active: boolean;
  description: string;
  images: { url: string; filename: string }[];
  created_at: string;
  schedules: Schedule[];
}

export interface Schedule {
  id: number;
  field_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
}

export interface Booking {
  id: number;
  customer_id: number;
  field_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  total_price: number | string;
  status: string;
  created_at: string;
  field?: {
    id?: number;
    name: string;
    field_type: string;
    price_per_hour: number | string;
    is_active?: boolean;
    description?: string;
    images?: any[];
  };
  customer?: {
    id?: number;
    full_name: string;
    email: string;
    phone: string;
  };
}

export interface BookingsResponse {
  bookings: Booking[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
    has_next_page: boolean;
    has_prev_page: boolean;
    next_page: number | null;
    prev_page: number | null;
  };
}

export interface LoginResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth helpers
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function setToken(token: string): void {
  localStorage.setItem("token", token);
}

export function removeToken(): void {
  localStorage.removeItem("token");
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");

  // Handle invalid/corrupted localStorage values
  if (!userStr || userStr === "undefined" || userStr === "null") {
    // Clean up invalid data
    localStorage.removeItem("user");
    return null;
  }

  try {
    return JSON.parse(userStr);
  } catch (e) {
    // If JSON parsing fails, remove corrupted data
    console.error("Failed to parse user from localStorage:", e);
    localStorage.removeItem("user");
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem("user", JSON.stringify(user));
}

export function removeUser(): void {
  localStorage.removeItem("user");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}

export function logout(): void {
  removeToken();
  removeUser();
}

// API Functions

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Login failed");
  }

  // Store token and user
  setToken(data.token);
  setUser(data.user);

  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  phone: string
): Promise<any> {
  const res = await fetch(`${API_BASE}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ full_name: name, email, password, phone }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

export async function createField(data: FormData): Promise<Field> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/create-field`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const result: ApiResponse<Field> = await res.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to create field");
  }

  return result.data;
}

export async function getFields(): Promise<Field[]> {
  const res = await fetch(`${API_BASE}/get-fields`);
  const data: ApiResponse<Field[]> = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch fields");
  }

  return data.data || [];
}

export async function deleteField(fieldId: number): Promise<void> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/delete-field/${fieldId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<any> = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to delete field");
  }
}

export async function updateField(
  fieldId: number,
  data: FormData
): Promise<Field> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/update-field/${fieldId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: data,
  });

  const result: ApiResponse<Field> = await res.json();

  if (!result.success || !result.data) {
    throw new Error(result.message || "Failed to update field");
  }

  return result.data;
}

export async function createSchedule(params: {
  field_id: number;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available?: boolean;
}): Promise<Schedule> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/schedules`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data: ApiResponse<Schedule> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to create schedule");
  }

  return data.data;
}

export async function getFieldById(id: number): Promise<Field> {
  const res = await fetch(`${API_BASE}/get-fields/${id}`);
  const data: ApiResponse<Field> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch field");
  }

  return data.data;
}

export async function getAvailableSlots(
  fieldId: number,
  date: string
): Promise<AvailableSlot[]> {
  const res = await fetch(
    `${API_BASE}/get-available-slots/${fieldId}?date=${date}`
  );
  const data: ApiResponse<AvailableSlot[]> = await res.json();
  console.log("available slots", data);
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch available slots");
  }

  return data.data || [];
}

export async function createBooking(params: {
  field_id: number;
  booking_date: string;
  start_time: string;
  end_time: string;
  duration: number;
}): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/create-booking`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to create booking");
  }

  return data.data;
}

// NEW: Unified bookings endpoint - returns user's own bookings or all bookings for admin
export async function getBookings(params?: {
  page?: number;
  limit?: number;
  status?: string;
  field_id?: number;
  start_date?: string;
  end_date?: string;
  sort_by?: string;
  sort_order?: string;
}): Promise<BookingsResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("limit", params.limit.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.field_id)
    queryParams.append("field_id", params.field_id.toString());
  if (params?.start_date) queryParams.append("start_date", params.start_date);
  if (params?.end_date) queryParams.append("end_date", params.end_date);
  if (params?.sort_by) queryParams.append("sort_by", params.sort_by);
  if (params?.sort_order) queryParams.append("sort_order", params.sort_order);

  const url = queryParams.toString()
    ? `${API_BASE}/bookings?${queryParams.toString()}`
    : `${API_BASE}/bookings`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<BookingsResponse> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data.data;
}

// NEW: Get single booking by ID
export async function getBookingById(id: number): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/bookings/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to fetch booking");
  }

  return data.data;
}

// NEW: Cancel booking
export async function cancelBooking(bookingId: number): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to cancel booking");
  }

  return data.data;
}

// NEW: Update/edit booking (reschedule)
export async function updateBooking(
  bookingId: number,
  params: {
    field_id?: number;
    booking_date?: string;
    start_time?: string;
    end_time?: string;
    duration?: number;
  }
): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data.data;
}

// DEPRECATED: Keep for backward compatibility during migration
export async function getMyBookings(): Promise<Booking[]> {
  const response = await getBookings({ limit: 100 });
  return response.bookings;
}

export async function getAllBookings(): Promise<Booking[]> {
  const response = await getBookings({ limit: 100 });
  return response.bookings;
}

// Admin: Confirm a pending booking
export async function confirmBooking(bookingId: number): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/bookings/${bookingId}/confirm`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to confirm booking");
  }

  return data.data;
}

// Admin: Reject a pending booking
export async function rejectBooking(bookingId: number): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/bookings/${bookingId}/reject`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to reject booking");
  }

  return data.data;
}

// Update booking status (for backward compatibility)
export async function updateBookingStatus(
  bookingId: number,
  status: string
): Promise<Booking> {
  if (status === "confirmed") {
    return confirmBooking(bookingId);
  }
  if (status === "rejected") {
    return rejectBooking(bookingId);
  }
  if (status === "cancelled") {
    return cancelBooking(bookingId);
  }
  throw new Error("Invalid status");
}

// Helper to format price from backend (Decimal)
export function formatPrice(price: number | string): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(numPrice);
}

// Helper to format date
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Helper to format time from ISO string
export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
