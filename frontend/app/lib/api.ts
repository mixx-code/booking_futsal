// API Service Layer for Backend Integration

const API_BASE = "/api/v1";

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
    name: string;
    field_type: string;
    price_per_hour: number | string;
  };
  customer?: {
    full_name: string;
    email: string;
    phone: string;
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
  return userStr ? JSON.parse(userStr) : null;
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

export async function getMyBookings(): Promise<Booking[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/my-bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking[]> = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data.data || [];
}

export async function getAllBookings(): Promise<Booking[]> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/all-bookings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: ApiResponse<Booking[]> = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch bookings");
  }

  return data.data || [];
}

export async function updateBookingStatus(
  bookingId: number,
  status: string
): Promise<Booking> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${API_BASE}/booking/${bookingId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  const data: ApiResponse<Booking> = await res.json();

  if (!data.success || !data.data) {
    throw new Error(data.message || "Failed to update booking");
  }

  return data.data;
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
