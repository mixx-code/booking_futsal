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
  }, [isLoading, isLoggedIn, router]);

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
        setError(err.message);
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
    { id: "overview", label: "Overview" },
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
        err.message ||
          "Gagal membatalkan booking. Pastikan jadwal belum lewat atau kurang dari 1 jam."
      );
    } finally {
      setCancellingId(null);
    }
  }

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/" className="text-2xl font-extrabold text-gray-900">
                BookingFutsal
              </Link>
              <p className="text-sm text-gray-500 mt-0.5">
                Halo, {user?.full_name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/services"
                className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Booking Sekarang
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "text-gray-900 border-gray-900"
                    : "text-gray-500 border-transparent hover:text-gray-700"
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
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Total Booking</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {bookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Akan Datang</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {upcomingBookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 col-span-2 md:col-span-1">
                    <div className="text-sm text-gray-500">
                      Total Pengeluaran
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
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
                    <h2 className="text-lg font-semibold text-gray-900">
                      Booking Mendatang
                    </h2>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Lihat Semua →
                    </button>
                  </div>
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
                    <h2 className="text-lg font-semibold text-gray-900">
                      Lapangan Tersedia
                    </h2>
                    <Link
                      href="/services"
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Lihat Semua →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
                    Akan Datang ({upcomingBookings.length})
                  </h2>
                  {upcomingBookings.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-6 text-center text-gray-500">
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
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Semua Lapangan
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: {
      label: "Menunggu",
      className: "bg-yellow-100 text-yellow-800",
    },
    confirmed: {
      label: "Dikonfirmasi",
      className: "bg-green-100 text-green-800",
    },
    cancelled: {
      label: "Dibatalkan",
      className: "bg-red-100 text-red-800",
    },
    completed: {
      label: "Selesai",
      className: "bg-gray-100 text-gray-800",
    },
  };

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
              strokeLinejoin="round"
            />
          </svg>
          <span>
            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-sm text-gray-500">Total</span>
        <span className="font-bold text-gray-900">
          {formatPrice(booking.total_price)}
        </span>
      </div>

      {showActions && canCancel && (
        <div className="mt-4 flex gap-3">
          <Link
            href={`/bookings/${booking.id}`}
            className="flex-1 px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Reschedule / Detail
          </Link>
          <button
            onClick={onCancel}
            disabled={isCancelling}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isCancelling
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
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
            className="block w-full px-4 py-2 text-center text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-32 bg-gray-100">
        {field.images && field.images.length > 0 ? (
          <img
            src={field.images[0].url}
            alt={field.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
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
          <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
            {field.field_type}
          </span>
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900">{field.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm text-gray-500">Per jam</span>
          <span className="font-bold text-gray-900">
            {formatPrice(field.price_per_hour)}
          </span>
        </div>
        <Link
          href={`/services/${field.id}`}
          className="mt-3 block w-full px-3 py-2 text-sm font-medium text-center text-white bg-gray-900 rounded-lg hover:bg-gray-800"
        >
          Booking
        </Link>
      </div>
    </div>
  );
}
