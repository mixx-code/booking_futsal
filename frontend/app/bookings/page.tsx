"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import {
  getMyBookings,
  updateBookingStatus,
  formatPrice,
  formatDate,
  formatTime,
  Booking,
} from "../lib/api";

export default function BookingsPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login/signin");
    }
  }, [isLoading, isLoggedIn, router]);

  useEffect(() => {
    async function fetchBookings() {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        const data = await getMyBookings();
        setBookings(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [isLoggedIn]);

  const upcomingBookings = bookings.filter(
    (b) =>
      (b.status === "pending" || b.status === "confirmed") &&
      new Date(b.booking_date) >= new Date(new Date().toDateString())
  );
  const pastBookings = bookings.filter(
    (b) =>
      b.status === "completed" ||
      b.status === "cancelled" ||
      new Date(b.booking_date) < new Date(new Date().toDateString())
  );

  async function handleCancel(booking: Booking) {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    try {
      await updateBookingStatus(booking.id, "cancelled");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking berhasil dibatalkan");
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan booking");
    }
  }

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-800" },
    confirmed: {
      label: "Dikonfirmasi",
      className: "bg-green-100 text-green-800",
    },
    cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
    completed: { label: "Selesai", className: "bg-gray-100 text-gray-800" },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/user"
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 12H5M5 12L12 19M5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">Booking Saya</h1>
            </div>
            <Link
              href="/services"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              + Booking Baru
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : (
          <>
            {/* Upcoming */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Akan Datang ({upcomingBookings.length})
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                  <p className="text-gray-500 mb-4">
                    Tidak ada booking mendatang
                  </p>
                  <Link
                    href="/services"
                    className="inline-block px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg"
                  >
                    Cari Lapangan
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      statusConfig={statusConfig}
                      onCancel={() => handleCancel(booking)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Past */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Riwayat ({pastBookings.length})
              </h2>
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-500">
                  Belum ada riwayat booking
                </div>
              ) : (
                <div className="space-y-3">
                  {pastBookings.map((booking) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      statusConfig={statusConfig}
                      showActions={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

// Inline BookingCard component for this page (uses API Booking type)
function BookingCard({
  booking,
  statusConfig,
  showActions = true,
  onCancel,
}: {
  booking: Booking;
  statusConfig: Record<string, { label: string; className: string }>;
  showActions?: boolean;
  onCancel?: () => void;
}) {
  const config = statusConfig[booking.status] || statusConfig.pending;
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg truncate">
            {booking.field?.name || `Lapangan #${booking.field_id}`}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {booking.field?.field_type}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-sm font-medium rounded-full ${config.className}`}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <rect
              x="3"
              y="4"
              width="18"
              height="18"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <span>{formatDate(booking.booking_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M12 7V12L15 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <span>
            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="font-bold text-gray-900">
          {formatPrice(booking.total_price)}
        </span>
        {showActions && canCancel && (
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            Batalkan
          </button>
        )}
      </div>
    </div>
  );
}
