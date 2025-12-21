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
import ImageLightbox from "../../components/ImageLightbox";

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
  const [startSlot, setStartSlot] = useState<AvailableSlot | null>(null);
  const [endSlot, setEndSlot] = useState<AvailableSlot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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
        // Reset selection when date changes
        setStartSlot(null);
        setEndSlot(null);
      } catch (err: any) {
        console.error("Failed to fetch slots:", err);
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    }
    fetchSlots();
  }, [fieldId, selectedDate, field]);

  // Calculate duration based on selected range
  const duration = useMemo(() => {
    if (!startSlot || !endSlot) return 0;
    const startIndex = slots.findIndex(
      (s) => s.start_time === startSlot.start_time
    );
    const endIndex = slots.findIndex(
      (s) => s.start_time === endSlot.start_time
    );
    if (startIndex === -1 || endIndex === -1) return 0;
    return Math.abs(endIndex - startIndex) + 1;
  }, [startSlot, endSlot, slots]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (!field || duration <= 0) return 0;
    const pricePerHour =
      typeof field.price_per_hour === "string"
        ? parseFloat(field.price_per_hour)
        : field.price_per_hour;
    return pricePerHour * duration;
  }, [field, duration]);

  // Check if slots between two indices are consecutive (no gaps)
  function areSlotsConsecutive(startIdx: number, endIdx: number): boolean {
    const minIdx = Math.min(startIdx, endIdx);
    const maxIdx = Math.max(startIdx, endIdx);

    for (let i = minIdx; i < maxIdx; i++) {
      const currentSlot = new Date(slots[i].end_time);
      const nextSlot = new Date(slots[i + 1].start_time);

      // Check if the end time of current slot equals start time of next slot
      if (currentSlot.getTime() !== nextSlot.getTime()) {
        return false; // There's a gap
      }
    }
    return true;
  }

  // Handle slot click - first click = start, second click = end
  function handleSlotClick(slot: AvailableSlot) {
    if (!startSlot) {
      // First click - set start time
      setStartSlot(slot);
      setEndSlot(null);
    } else if (!endSlot) {
      // Second click - set end time
      const startIndex = slots.findIndex(
        (s) => s.start_time === startSlot.start_time
      );
      const clickIndex = slots.findIndex(
        (s) => s.start_time === slot.start_time
      );

      // Check if same slot is clicked
      if (startIndex === clickIndex) {
        // Same slot clicked - set as 1-hour booking (start = end)
        setEndSlot(slot);
        return;
      }

      // Check if slots are consecutive
      if (!areSlotsConsecutive(startIndex, clickIndex)) {
        alert(
          "Tidak dapat memilih rentang waktu yang tidak berurutan. Silakan pilih slot yang berurutan."
        );
        // Reset selection
        setStartSlot(slot);
        setEndSlot(null);
        return;
      }

      if (clickIndex < startIndex) {
        // If clicked before start, swap them
        setEndSlot(startSlot);
        setStartSlot(slot);
      } else {
        setEndSlot(slot);
      }
    } else {
      // Third click - reset and start new selection
      setStartSlot(slot);
      setEndSlot(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!authLoggedIn) {
      router.push("/login/signin");
      return;
    }

    if (!startSlot || !endSlot || !field) {
      alert("Pilih waktu mulai dan waktu selesai terlebih dahulu");
      return;
    }

    setSubmitting(true);

    try {
      await createBooking({
        field_id: field.id,
        booking_date: selectedDate,
        start_time: startSlot.start_time,
        end_time: endSlot.end_time,
        duration: duration,
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
    <>
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
              {/* Image Carousel */}
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative h-48 md:h-80 bg-gray-100">
                  {field.images && field.images.length > 0 ? (
                    <>
                      <div
                        className="cursor-pointer w-full h-full"
                        onClick={() => setLightboxOpen(true)}
                      >
                        <Image
                          src={
                            typeof field.images[currentImageIndex] === "string"
                              ? field.images[currentImageIndex]
                              : field.images[currentImageIndex].url
                          }
                          alt={`${field.name} - Gambar ${
                            currentImageIndex + 1
                          }`}
                          fill
                          style={{ objectFit: "cover" }}
                          className="hover:opacity-95 transition-opacity"
                        />
                      </div>

                      {/* Navigation Arrows */}
                      {field.images.length > 1 && (
                        <>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === 0 ? field.images.length - 1 : prev - 1
                              )
                            }
                            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                          >
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M15 19L8 12L15 5"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() =>
                              setCurrentImageIndex((prev) =>
                                prev === field.images.length - 1 ? 0 : prev + 1
                              )
                            }
                            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                          >
                            <svg
                              className="w-4 h-4 md:w-5 md:h-5"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M9 5L16 12L9 19"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </>
                      )}

                      {/* Dot Indicators - positioned at bottom center, hidden on mobile (use counter instead) */}
                      {field.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden md:flex gap-2">
                          {field.images.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-2.5 h-2.5 rounded-full transition-all ${
                                index === currentImageIndex
                                  ? "bg-white scale-110"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                            />
                          ))}
                        </div>
                      )}

                      {/* Image Counter - on mobile, centered at bottom; on desktop, at bottom right */}
                      {field.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-3 px-3 py-1.5 bg-black/60 text-white text-xs md:text-sm font-medium rounded-full">
                          {currentImageIndex + 1} / {field.images.length}
                        </div>
                      )}
                    </>
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
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
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
                    <h3 className="font-medium text-gray-900 mb-2">
                      Deskripsi
                    </h3>
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
                    <span className="block text-xs text-gray-500 font-normal mt-1">
                      Klik pertama: jam mulai, Klik kedua: jam selesai
                    </span>
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
                        const timeLabel = formatTime(slot.start_time);

                        // Check if slot has passed current time
                        const now = new Date();
                        const slotDate = new Date(slot.start_time);
                        const today = new Date().toISOString().split("T")[0];
                        const isPassed =
                          selectedDate === today && slotDate <= now;

                        // Check selection states
                        const isStart =
                          startSlot?.start_time === slot.start_time;
                        const isEnd = endSlot?.start_time === slot.start_time;

                        // Check if slot is between start and end
                        let isInRange = false;
                        if (startSlot && endSlot) {
                          const startIndex = slots.findIndex(
                            (s) => s.start_time === startSlot.start_time
                          );
                          const endIndex = slots.findIndex(
                            (s) => s.start_time === endSlot.start_time
                          );
                          isInRange =
                            index > Math.min(startIndex, endIndex) &&
                            index < Math.max(startIndex, endIndex);
                        }

                        return (
                          <button
                            key={index}
                            onClick={() => !isPassed && handleSlotClick(slot)}
                            disabled={isPassed}
                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                              isPassed
                                ? "bg-red-50 text-red-400 border-red-200 cursor-not-allowed"
                                : isStart
                                ? "bg-green-600 text-white border-green-600"
                                : isEnd
                                ? "bg-blue-600 text-white border-blue-600"
                                : isInRange
                                ? "bg-gray-200 text-gray-900 border-gray-300"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              <span>{timeLabel}</span>
                              {isPassed && (
                                <span className="text-xs text-red-400">
                                  (sudah lewat)
                                </span>
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
                  )}
                </div>

                {/* Legend */}
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-white border border-gray-200"></div>
                    <span>Tersedia</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-green-600"></div>
                    <span>Mulai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-blue-600"></div>
                    <span>Selesai</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gray-200 border border-gray-300"></div>
                    <span>Rentang</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-50 border border-red-200"></div>
                    <span>Sudah Lewat</span>
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
                      {startSlot && endSlot
                        ? `${formatTime(startSlot.start_time)} - ${formatTime(
                            endSlot.end_time
                          )}`
                        : startSlot
                        ? `${formatTime(startSlot.start_time)} - ...`
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Durasi</span>
                    <span className="text-gray-900">
                      {duration > 0 ? `${duration} jam` : "-"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      {duration > 0 ? formatPrice(totalPrice) : "-"}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6">
                  {!authLoggedIn && (
                    <p className="text-sm text-amber-600 mb-4">
                      Anda harus login untuk melakukan booking
                    </p>
                  )}

                  {startSlot && !endSlot && (
                    <p className="text-sm text-blue-600 mb-4">
                      Pilih jam selesai untuk melanjutkan
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={!startSlot || !endSlot || submitting}
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

      {/* Image Lightbox */}
      {field && field.images && field.images.length > 0 && (
        <ImageLightbox
          images={field.images}
          initialIndex={currentImageIndex}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
