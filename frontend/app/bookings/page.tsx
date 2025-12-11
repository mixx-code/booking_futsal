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
    pending: {
      label: "Menunggu",
      className: "bg-amber-100 text-amber-700 ring-1 ring-amber-200",
    },
    confirmed: {
      label: "Dikonfirmasi",
      className: "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200",
    },
    cancelled: {
      label: "Dibatalkan",
      className: "bg-red-100 text-red-700 ring-1 ring-red-200",
    },
    completed: {
      label: "Selesai",
      className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/dashboard/user"
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
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
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                Booking Saya
              </h1>
            </div>
            <Link
              href="/services"
              className="px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : (
          <>
            {/* Upcoming */}
            <section>
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Akan Datang ({upcomingBookings.length})
              </h2>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm">
                  <p className="text-slate-500 mb-4">
                    Tidak ada booking mendatang
                  </p>
                  <Link
                    href="/services"
                    className="inline-block px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl"
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
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Riwayat ({pastBookings.length})
              </h2>
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-500 shadow-sm">
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
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-base sm:text-lg truncate">
            {booking.field?.name || `Lapangan #${booking.field_id}`}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {booking.field?.field_type}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs sm:text-sm font-medium rounded-full shrink-0 ${config.className}`}
        >
          {config.label}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
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
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="shrink-0"
          >
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

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="font-bold text-slate-900 text-lg">
          {formatPrice(booking.total_price)}
        </span>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
        {showActions && canCancel ? (
          <>
            <Link
              href={`/bookings/${booking.id}`}
              className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Reschedule / Detail
            </Link>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
            >
              Batalkan
            </button>
          </>
        ) : (
          <Link
            href={`/bookings/${booking.id}`}
            className="w-full px-4 py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Lihat Detail
          </Link>
        )}
      </div>
    </div>
  );
}
