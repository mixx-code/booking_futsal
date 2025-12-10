"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  getMyBookings,
  updateBookingStatus,
  formatDate,
  formatPrice,
  formatTime,
  Booking,
} from "../../lib/api";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const bookingId = parseInt(params.id as string);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancel, setShowCancel] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      router.push("/login/signin");
    }
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    async function fetchBooking() {
      if (!isLoggedIn) return;
      try {
        setLoading(true);
        // Fetch all user bookings and find the one with matching ID
        const bookings = await getMyBookings();
        const found = bookings.find((b) => b.id === bookingId);
        if (found) {
          setBooking(found);
        } else {
          setError("Booking tidak ditemukan");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [isLoggedIn, bookingId]);

  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-800" },
    confirmed: {
      label: "Dikonfirmasi",
      className: "bg-green-100 text-green-800",
    },
    cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
    completed: { label: "Selesai", className: "bg-gray-100 text-gray-800" },
  };

  async function handleCancel() {
    if (!booking) return;
    setSubmitting(true);
    try {
      await updateBookingStatus(booking.id, "cancelled");
      setBooking({ ...booking, status: "cancelled" });
      setShowCancel(false);
      alert("Booking berhasil dibatalkan");
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Booking tidak ditemukan"}
          </h1>
          <Link
            href="/bookings"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Kembali ke daftar booking
          </Link>
        </div>
      </div>
    );
  }

  const config = statusConfig[booking.status] || statusConfig.pending;
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/bookings"
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
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                Detail Booking
              </h1>
              <p className="text-sm text-gray-500">#{booking.id}</p>
            </div>
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${config.className}`}
            >
              {config.label}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Booking Info */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900">
              {booking.field?.name || `Lapangan #${booking.field_id}`}
            </h2>
            <p className="text-gray-500 mt-1">{booking.field?.field_type}</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3"
                      y="4"
                      width="18"
                      height="18"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M3 10H21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M8 2V6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 2V6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Tanggal</div>
                  <div className="font-medium text-gray-900">
                    {formatDate(booking.booking_date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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
                </div>
                <div>
                  <div className="text-xs text-gray-500">Waktu</div>
                  <div className="font-medium text-gray-900">
                    {formatTime(booking.start_time)} -{" "}
                    {formatTime(booking.end_time)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Durasi</div>
              <div className="text-gray-900">{booking.duration} jam</div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <span className="text-gray-600">Total Pembayaran</span>
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(booking.total_price)}
            </span>
          </div>
        </div>

        {/* Actions */}
        {canCancel && !showCancel && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancel(true)}
              className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Batalkan Booking
            </button>
          </div>
        )}

        {/* Cancel Confirmation */}
        {showCancel && (
          <div className="bg-red-50 rounded-xl border border-red-100 p-6">
            <h3 className="font-semibold text-red-900 mb-2">
              Batalkan Booking?
            </h3>
            <p className="text-sm text-red-700 mb-4">
              Tindakan ini tidak dapat dibatalkan. Booking Anda akan dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancel(false)}
                className="flex-1 px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-200"
              >
                Tidak
              </button>
              <button
                onClick={handleCancel}
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Memproses..." : "Ya, Batalkan"}
              </button>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Riwayat</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
              <div>
                <div className="text-sm text-gray-900">Booking dibuat</div>
                <div className="text-xs text-gray-500">
                  {new Date(booking.created_at).toLocaleString("id-ID")}
                </div>
              </div>
            </div>
            {booking.status === "confirmed" && (
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                <div>
                  <div className="text-sm text-gray-900">
                    Booking dikonfirmasi
                  </div>
                </div>
              </div>
            )}
            {booking.status === "cancelled" && (
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-red-500"></div>
                <div>
                  <div className="text-sm text-gray-900">
                    Booking dibatalkan
                  </div>
                </div>
              </div>
            )}
            {booking.status === "completed" && (
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                <div>
                  <div className="text-sm text-gray-900">Booking selesai</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
