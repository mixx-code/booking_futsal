"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getFieldById,
  getAvailableSlots,
  createBooking,
  formatPrice,
  formatDate,
  formatTime,
  Field,
  AvailableSlot,
  isLoggedIn,
  getUser,
} from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn: authLoggedIn } = useAuth();
  const fieldId = parseInt(params.id as string);

  const [field, setField] = useState<Field | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Generate next 7 days
  const dates = useMemo(() => {
    const result: { date: string; label: string; dayName: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      result.push({
        date: dateStr,
        label: date.getDate().toString(),
        dayName: date.toLocaleDateString("id-ID", { weekday: "short" }),
      });
    }

    return result;
  }, []);

  // Fetch field data
  useEffect(() => {
    async function fetchField() {
      try {
        const data = await getFieldById(fieldId);
        setField(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchField();
  }, [fieldId]);

  // Fetch available slots when date changes
  useEffect(() => {
    async function fetchSlots() {
      if (!field) return;
      setSlotsLoading(true);
      try {
        const data = await getAvailableSlots(fieldId, selectedDate);
        setSlots(data);
        setSelectedSlot(null);
      } catch (err: any) {
        console.error("Failed to fetch slots:", err);
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [fieldId, selectedDate, field]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!authLoggedIn) {
      router.push("/login/signin");
      return;
    }

    if (!selectedSlot || !field) {
      alert("Pilih waktu booking terlebih dahulu");
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        field_id: field.id,
        booking_date: selectedDate,
        start_time: selectedSlot.start_time,
        end_time: selectedSlot.end_time,
        duration: 1, // 1 hour
      });

      alert("Booking berhasil dibuat!");
      router.push("/dashboard/user");
    } catch (err: any) {
      alert(err.message || "Gagal membuat booking");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Lapangan tidak ditemukan
          </h1>
          <Link
            href="/services"
            className="text-gray-600 hover:text-gray-900 underline"
          >
            Kembali ke daftar lapangan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/services"
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
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Detail Lapangan
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Field Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <div className="relative h-48 md:h-64 bg-gray-100">
                {field.images && field.images.length > 0 ? (
                  <Image
                    src={field.images[0].url}
                    alt={field.name}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg
                      className="w-16 h-16"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-gray-900 text-white text-sm font-medium rounded-full">
                    {field.field_type}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {field.name}
                </h2>

                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Per jam</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatPrice(field.price_per_hour)}
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="font-medium text-gray-900 mb-2">Deskripsi</h3>
                  <p className="text-gray-600">{field.description}</p>
                </div>
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Pilih Waktu Booking
              </h3>

              {/* Date selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Tanggal
                </label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {dates.map((d) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(d.date)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-lg border transition-colors ${
                        selectedDate === d.date
                          ? "bg-gray-900 text-white border-gray-900"
                          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <span className="text-xs font-medium">{d.dayName}</span>
                      <span className="text-lg font-bold">{d.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slots */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Waktu
                </label>
                {slotsLoading ? (
                  <div className="text-center py-8 text-gray-500">
                    Memuat slot waktu...
                  </div>
                ) : slots.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Tidak ada slot tersedia untuk tanggal ini
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
                    {slots.map((slot, index) => {
                      const isSelected =
                        selectedSlot?.start_time === slot.start_time;
                      const timeLabel = formatTime(slot.start_time);

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedSlot(slot)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                            isSelected
                              ? "bg-gray-900 text-white border-gray-900"
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {timeLabel}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Legend */}
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-white border border-gray-200"></div>
                  <span>Tersedia</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-gray-900"></div>
                  <span>Dipilih</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-20">
              <h3 className="font-semibold text-gray-900 mb-4">
                Ringkasan Booking
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Lapangan</span>
                  <span className="text-gray-900 font-medium">
                    {field.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tanggal</span>
                  <span className="text-gray-900">
                    {formatDate(selectedDate)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Waktu</span>
                  <span className="text-gray-900">
                    {selectedSlot
                      ? `${formatTime(selectedSlot.start_time)} - ${formatTime(
                          selectedSlot.end_time
                        )}`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Durasi</span>
                  <span className="text-gray-900">1 jam</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(field.price_per_hour)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6">
                {!authLoggedIn && (
                  <p className="text-sm text-amber-600 mb-4">
                    Anda harus login untuk melakukan booking
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!selectedSlot || submitting}
                  className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? "Memproses..."
                    : !authLoggedIn
                    ? "Login untuk Booking"
                    : "Konfirmasi Booking"}
                </button>
              </form>

              <p className="mt-4 text-xs text-gray-500 text-center">
                Dengan melakukan booking, Anda menyetujui{" "}
                <a href="#" className="underline">
                  Syarat & Ketentuan
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
