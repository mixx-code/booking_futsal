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
  translateError,
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
  const [rescheduleStartSlot, setRescheduleStartSlot] =
    useState<AvailableSlot | null>(null);
  const [rescheduleEndSlot, setRescheduleEndSlot] =
    useState<AvailableSlot | null>(null);
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
        setError(translateError(err.message) || "Booking tidak ditemukan");
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
    cancelled: {
      label: "Dibatalkan",
      className: "bg-orange-100 text-orange-800",
    },
    rejected: { label: "Ditolak Admin", className: "bg-red-100 text-red-800" },
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
      alert(translateError(err.message) || "Gagal membatalkan booking");
    } finally {
      setSubmitting(false);
    }
  }

  // Check if slots between two indices are consecutive (no gaps)
  function areSlotsConsecutive(startIdx: number, endIdx: number): boolean {
    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);

    for (let i = minIdx; i < maxIdx; i++) {
      const currentSlot = new Date(availableSlots[i].end_time);
      const nextSlot = new Date(availableSlots[i + 1].start_time);

      if (currentSlot.getTime() !== nextSlot.getTime()) {
        return false; // There's a gap
      }
    }
    return true;
  }

  // Handle slot click for reschedule
  function handleRescheduleSlotClick(slot: AvailableSlot) {
    if (!rescheduleStartSlot) {
      setRescheduleStartSlot(slot);
      setRescheduleEndSlot(null);
    } else if (!rescheduleEndSlot) {
      const startIndex = availableSlots.findIndex(
        (s) => s.start_time === rescheduleStartSlot.start_time
      );
      const clickIndex = availableSlots.findIndex(
        (s) => s.start_time === slot.start_time
      );

      // Check if same slot is clicked
      if (startIndex === clickIndex) {
        // Same slot clicked - set as 1-hour booking (start = end)
        setRescheduleEndSlot(slot);
        return;
      }

      // Check if slots are consecutive
      if (!areSlotsConsecutive(startIndex, clickIndex)) {
        alert(
          "Tidak dapat memilih rentang waktu yang tidak berurutan. Silakan pilih slot yang berurutan."
        );
        setRescheduleStartSlot(slot);
        setRescheduleEndSlot(null);
        return;
      }

      if (clickIndex < startIndex) {
        setRescheduleEndSlot(rescheduleStartSlot);
        setRescheduleStartSlot(slot);
      } else {
        setRescheduleEndSlot(slot);
      }
    } else {
      setRescheduleStartSlot(slot);
      setRescheduleEndSlot(null);
    }
  }

  // Calculate reschedule duration
  const rescheduleDuration =
    rescheduleStartSlot && rescheduleEndSlot
      ? Math.abs(
          availableSlots.findIndex(
            (s) => s.start_time === rescheduleEndSlot.start_time
          ) -
            availableSlots.findIndex(
              (s) => s.start_time === rescheduleStartSlot.start_time
            )
        ) + 1
      : 0;

  async function handleReschedule() {
    if (
      !booking ||
      !rescheduleDate ||
      !rescheduleStartSlot ||
      !rescheduleEndSlot
    )
      return;

    setSubmitting(true);
    try {
      const updatedBooking = await updateBooking(booking.id, {
        booking_date: rescheduleDate,
        start_time: rescheduleStartSlot.start_time,
        end_time: rescheduleEndSlot.end_time,
      });

      setBooking(updatedBooking);
      setShowReschedule(false);
      alert("Jadwal booking berhasil diubah");
    } catch (err: any) {
      alert(translateError(err.message) || "Gagal mengubah jadwal booking");
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
            href="/dashboard/user"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Kembali ke Dashboard
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
              Ubah Jadwal
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
                  Ubah Jadwal Booking
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
                    onChange={(e) => {
                      setRescheduleDate(e.target.value);
                      // Reset slot selections when date changes
                      setRescheduleStartSlot(null);
                      setRescheduleEndSlot(null);
                    }}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Waktu Baru
                    <span className="block text-xs text-gray-500 font-normal mt-1">
                      Klik pertama: jam mulai, Klik kedua: jam selesai
                    </span>
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
                    <>
                      <div className="grid grid-cols-4 gap-2">
                        {availableSlots.map((slot, idx) => {
                          const timeLabel = formatTime(slot.start_time);

                          // Check if slot has already passed
                          const today = new Date().toISOString().split("T")[0];
                          const now = new Date();
                          const slotDate = new Date(slot.start_time);
                          const isPassed =
                            rescheduleDate === today && slotDate <= now;

                          // Check selection states
                          const isStart =
                            rescheduleStartSlot?.start_time === slot.start_time;
                          const isEnd =
                            rescheduleEndSlot?.start_time === slot.start_time;

                          // Check if slot is in range
                          let isInRange = false;
                          if (rescheduleStartSlot && rescheduleEndSlot) {
                            const startIdx = availableSlots.findIndex(
                              (s) =>
                                s.start_time === rescheduleStartSlot.start_time
                            );
                            const endIdx = availableSlots.findIndex(
                              (s) =>
                                s.start_time === rescheduleEndSlot.start_time
                            );
                            isInRange =
                              idx > Math.min(startIdx, endIdx) &&
                              idx < Math.max(startIdx, endIdx);
                          }

                          return (
                            <button
                              key={idx}
                              data-testid={`time-slot-${timeLabel}`}
                              onClick={() =>
                                !isPassed && handleRescheduleSlotClick(slot)
                              }
                              disabled={isPassed}
                              className={`px-2 py-2 text-sm rounded-lg border transition-colors ${
                                isPassed
                                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                  : isStart
                                  ? "bg-green-600 text-white border-green-600"
                                  : isEnd
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : isInRange
                                  ? "bg-gray-200 text-gray-900 border-gray-300"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-900"
                              }`}
                            >
                              <div className="flex flex-col items-center">
                                <span>{timeLabel}</span>
                                {isPassed && (
                                  <span className="text-xs">(lewat)</span>
                                )}
                                {isStart && !isPassed && (
                                  <span className="text-xs">Mulai</span>
                                )}
                                {isEnd && !isPassed && (
                                  <span className="text-xs">Selesai</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Duration Preview */}
                      {rescheduleDuration > 0 && (
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                          <strong>Waktu:</strong>{" "}
                          {formatTime(rescheduleStartSlot?.start_time || "")} -{" "}
                          {formatTime(rescheduleEndSlot?.end_time || "")}
                          <span className="ml-2">
                            ({rescheduleDuration} jam)
                          </span>
                        </div>
                      )}

                      {/* Legend */}
                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-white border border-gray-200"></span>
                          <span>Tersedia</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-green-600"></span>
                          <span>Mulai</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-blue-600"></span>
                          <span>Selesai</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></span>
                          <span>Rentang</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></span>
                          <span>Sudah Lewat</span>
                        </div>
                      </div>
                    </>
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
                    disabled={
                      submitting || !rescheduleStartSlot || !rescheduleEndSlot
                    }
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
