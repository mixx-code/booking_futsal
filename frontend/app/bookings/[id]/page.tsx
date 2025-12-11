"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import {
  getBookingById,
  cancelBooking,
  updateBooking,
  getAvailableSlots,
  formatDate,
  formatPrice,
  formatTime,
  Booking,
  AvailableSlot,
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

  // Reschedule State
  const [showReschedule, setShowReschedule] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [checkingSlots, setCheckingSlots] = useState(false);

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
        const bookingData = await getBookingById(bookingId);
        setBooking(bookingData);
        // Set initial reschedule date to current booking date
        setRescheduleDate(bookingData.booking_date.split("T")[0]);
      } catch (err: any) {
        setError(err.message || "Booking tidak ditemukan");
      } finally {
        setLoading(false);
      }
    }
    fetchBooking();
  }, [isLoggedIn, bookingId]);

  useEffect(() => {
    async function checkSlots() {
      if (!booking || !rescheduleDate || !showReschedule) return;

      setCheckingSlots(true);
      try {
        // Need to parse the date to ensure we're checking validity
        const selectedDate = new Date(rescheduleDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) {
          setAvailableSlots([]);
          return;
        }

        const slots = await getAvailableSlots(booking.field_id, rescheduleDate);
        setAvailableSlots(slots);
      } catch (err) {
        console.error("Error fetching slots:", err);
      } finally {
        setCheckingSlots(false);
      }
    }

    // Debounce slot checking
    const timeout = setTimeout(checkSlots, 500);
    return () => clearTimeout(timeout);
  }, [rescheduleDate, booking, showReschedule]);

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
      await cancelBooking(booking.id);
      setBooking({ ...booking, status: "cancelled" });
      setShowCancel(false);
      alert("Booking berhasil dibatalkan");
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan booking");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReschedule() {
    if (!booking || !rescheduleDate || !rescheduleTime) return;

    setSubmitting(true);
    try {
      const startTime = `${rescheduleDate} ${rescheduleTime}:00`;
      // Calculate end time based on original duration
      const startHour = parseInt(rescheduleTime.split(":")[0]);
      const endHour = startHour + booking.duration;
      const endTime = `${rescheduleDate} ${endHour
        .toString()
        .padStart(2, "0")}:00:00`;

      const updatedBooking = await updateBooking(booking.id, {
        booking_date: rescheduleDate,
        start_time: startTime,
        end_time: endTime,
      });

      setBooking(updatedBooking);
      setShowReschedule(false);
      alert("Jadwal booking berhasil diubah");
    } catch (err: any) {
      alert(err.message || "Gagal mengubah jadwal booking");
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
        {canCancel && !showCancel && !showReschedule && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowCancel(true)}
              className="flex-1 px-4 py-3 bg-red-50 text-red-600 font-medium rounded-lg hover:bg-red-100 transition-colors"
            >
              Batalkan Booking
            </button>
            <button
              onClick={() => setShowReschedule(true)}
              className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Reschedule
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

        {/* Reschedule Modal */}
        {showReschedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Reschedule Booking
                </h3>
                <button
                  onClick={() => setShowReschedule(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Tanggal Baru
                  </label>
                  <input
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Jam Mulai (Durasi: {booking.duration} jam)
                  </label>

                  {checkingSlots ? (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      Cek ketersediaan...
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-4 bg-gray-50 rounded-lg text-gray-500 text-sm">
                      Tidak ada slot tersedia untuk tanggal ini
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableSlots.map((slot, idx) => {
                        const timeString = slot.start_time.substring(11, 16);
                        return (
                          <button
                            key={idx}
                            data-testid={`time-slot-${timeString}`}
                            onClick={() => setRescheduleTime(timeString)}
                            className={`px-2 py-2 text-sm rounded-lg border transition-colors ${
                              rescheduleTime === timeString
                                ? "bg-gray-900 text-white border-gray-900"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
                            }`}
                          >
                            {timeString}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setShowReschedule(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    data-testid="save-reschedule"
                    onClick={handleReschedule}
                    disabled={submitting || !rescheduleTime}
                    className="flex-1 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </div>
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
