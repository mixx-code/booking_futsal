"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  getMyBookings,
  getFields,
  cancelBooking,
  formatPrice,
  formatDate,
  formatTime,
  translateError,
  Booking,
  Field,
} from "../../lib/api";

type TabType = "overview" | "bookings" | "browse";

export default function UserDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login/signin");
    }
    // Redirect admin users to provider dashboard
    if (!isLoading && isLoggedIn && user?.role === "admin") {
      router.push("/dashboard/provider");
    }
  }, [isLoading, isLoggedIn, user, router]);

  useEffect(() => {
    async function fetchData() {
      if (!isLoggedIn) return;

      try {
        const [bookingsData, fieldsData] = await Promise.all([
          getMyBookings(),
          getFields(),
        ]);
        setBookings(bookingsData);
        setFields(fieldsData);
      } catch (err: any) {
        setError(translateError(err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchData();
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

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Ringkasan" },
    { id: "bookings", label: "Booking Saya" },
    { id: "browse", label: "Cari Lapangan" },
  ];

  const [cancellingId, setCancellingId] = useState<number | null>(null);

  async function handleCancelBooking(booking: Booking) {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    setCancellingId(booking.id);
    try {
      console.log("Attempting to cancel booking:", booking.id);
      await cancelBooking(booking.id);
      console.log("Booking cancelled successfully");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking berhasil dibatalkan");
    } catch (err: any) {
      console.error("Failed to cancel booking:", err);
      // Show error in a more visible way if needed, or stick to alert but ensure message is clear
      alert(
        translateError(err.message) ||
          "Gagal membatalkan booking. Pastikan jadwal belum lewat atau kurang dari 1 jam."
      );
    } finally {
      setCancellingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/"
                className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-slate-700 transition-colors"
              >
                BookingFutsal
              </Link>
              <p className="text-sm text-slate-500 mt-0.5">
                Halo, {user?.full_name}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/services"
                className="hidden sm:block px-4 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
              >
                Booking Sekarang
              </Link>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-slate-100 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-slate-900 border-slate-900"
                    : "text-slate-500 border-transparent hover:text-slate-700 hover:border-slate-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-sm text-slate-500">Total Booking</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      {bookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="text-sm text-slate-500">Akan Datang</div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      {upcomingBookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 col-span-2 md:col-span-1">
                    <div className="text-sm text-slate-500">
                      Total Pengeluaran
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                      {formatPrice(
                        bookings
                          .filter((b) => b.status !== "cancelled")
                          .reduce(
                            (sum, b) =>
                              sum +
                              (typeof b.total_price === "string"
                                ? parseFloat(b.total_price)
                                : b.total_price),
                            0
                          )
                      )}
                    </div>
                  </div>
                </div>

                {/* Upcoming Bookings */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Booking Mendatang
                    </h2>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Lihat Semua →
                    </button>
                  </div>
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
                      {upcomingBookings.slice(0, 3).map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          isCancelling={cancellingId === booking.id}
                          onCancel={() => handleCancelBooking(booking)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Browse */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Lapangan Tersedia
                    </h2>
                    <Link
                      href="/services"
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                    >
                      Lihat Semua →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {fields.slice(0, 3).map((field) => (
                      <FieldCard key={field.id} field={field} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">
                    Akan Datang ({upcomingBookings.length})
                  </h2>
                  {upcomingBookings.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-slate-100 p-6 text-center text-slate-500 shadow-sm">
                      Tidak ada booking mendatang
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          isCancelling={cancellingId === booking.id}
                          onCancel={() => handleCancelBooking(booking)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-slate-900 mb-3">
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
                          showActions={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Browse Tab */}
            {activeTab === "browse" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Semua Lapangan
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {fields.map((field) => (
                    <FieldCard key={field.id} field={field} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Booking Card Component
function BookingCard({
  booking,
  showActions = true,
  isCancelling = false,
  onCancel,
}: {
  booking: Booking;
  showActions?: boolean;
  isCancelling?: boolean;
  onCancel?: () => void;
}) {
  const router = useRouter();
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
      className: "bg-orange-100 text-orange-700 ring-1 ring-orange-200",
    },
    rejected: {
      label: "Ditolak Admin",
      className: "bg-red-100 text-red-700 ring-1 ring-red-200",
    },
    completed: {
      label: "Selesai",
      className: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    },
  };

  const config = statusConfig[booking.status] || statusConfig.pending;
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";

  function handleCardClick() {
    router.push(`/bookings/${booking.id}`);
  }

  function handleCancelClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (onCancel) onCancel();
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
    >
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

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3  ">
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
          <span>{formatDate(booking.booking_date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600 md:justify-end">
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
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
        <span className="text-sm text-slate-500">Total</span>
        <span className="font-bold text-slate-900 text-lg">
          {formatPrice(booking.total_price)}
        </span>
      </div>

      {showActions && canCancel && (
        <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Link
            href={`/bookings/${booking.id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-4 py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Ubah Jadwal / Detail
          </Link>
          <button
            onClick={handleCancelClick}
            disabled={isCancelling}
            className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              isCancelling
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "text-red-600 bg-red-50 hover:bg-red-100"
            }`}
          >
            {isCancelling ? "Memproses..." : "Batalkan"}
          </button>
        </div>
      )}
      {showActions && !canCancel && (
        <div className="mt-4">
          <Link
            href={`/bookings/${booking.id}`}
            onClick={(e) => e.stopPropagation()}
            className="block w-full px-4 py-2.5 text-center text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Lihat Detail
          </Link>
        </div>
      )}
    </div>
  );
}

// Field Card Component
function FieldCard({ field }: { field: Field }) {
  const router = useRouter();

  function handleCardClick() {
    router.push(`/services/${field.id}`);
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer"
    >
      <div className="relative h-32 bg-slate-100 overflow-hidden">
        {field.images && field.images.length > 0 ? (
          <img
            src={
              typeof field.images[0] === "string"
                ? field.images[0]
                : field.images[0].url
            }
            alt={field.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
            {field.field_type}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-slate-900">{field.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-slate-500">Per jam</span>
          <span className="font-bold text-slate-900 text-lg">
            {formatPrice(field.price_per_hour)}
          </span>
        </div>
        <Link
          href={`/services/${field.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 block w-full px-4 py-2.5 text-sm font-semibold text-center text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
        >
          Booking
        </Link>
      </div>
    </div>
  );
}
