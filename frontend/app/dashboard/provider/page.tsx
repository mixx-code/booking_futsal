"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  getAllBookings,
  getFields,
  createField,
  updateBookingStatus,
  formatPrice,
  formatDate,
  formatTime,
  Booking,
  Field,
} from "../../lib/api";

type TabType = "overview" | "bookings" | "fields" | "create";

export default function ProviderDashboard() {
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
    if (!isLoading && isLoggedIn && user?.role !== "admin") {
      router.push("/dashboard/user");
    }
  }, [isLoading, isLoggedIn, user, router]);

  useEffect(() => {
    fetchData();
  }, [isLoggedIn, user]);

  async function fetchData() {
    if (!isLoggedIn || user?.role !== "admin") return;

    try {
      setLoading(true);
      const [bookingsData, fieldsData] = await Promise.all([
        getAllBookings(),
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

  const pendingBookings = bookings.filter((b) => b.status === "pending");
  const todayBookings = bookings.filter(
    (b) =>
      b.booking_date.split("T")[0] === new Date().toISOString().split("T")[0]
  );
  const totalRevenue = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce(
      (sum, b) =>
        sum +
        (typeof b.total_price === "string"
          ? parseFloat(b.total_price)
          : b.total_price),
      0
    );

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "bookings", label: "Semua Booking" },
    { id: "fields", label: "Lapangan" },
    { id: "create", label: "+ Tambah Lapangan" },
  ];

  async function handleConfirmBooking(booking: Booking) {
    try {
      await updateBookingStatus(booking.id, "confirmed");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "confirmed" } : b
        )
      );
      alert("Booking berhasil dikonfirmasi");
    } catch (err: any) {
      alert(err.message || "Gagal mengkonfirmasi booking");
    }
  }

  async function handleCancelBooking(booking: Booking) {
    if (!confirm("Yakin ingin membatalkan booking ini?")) return;
    try {
      await updateBookingStatus(booking.id, "cancelled");
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: "cancelled" } : b
        )
      );
      alert("Booking dibatalkan");
    } catch (err: any) {
      alert(err.message || "Gagal membatalkan booking");
    }
  }

  function handleFieldCreated() {
    fetchData();
    setActiveTab("fields");
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
              <p className="text-sm text-gray-500 mt-0.5">Dashboard Admin</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{user?.full_name}</span>
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">Total Lapangan</div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {fields.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">
                      Booking Hari Ini
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {todayBookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">
                      Menunggu Konfirmasi
                    </div>
                    <div className="text-2xl font-bold text-yellow-600 mt-1">
                      {pendingBookings.length}
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="text-sm text-gray-500">
                      Total Pendapatan
                    </div>
                    <div className="text-2xl font-bold text-green-600 mt-1">
                      {formatPrice(totalRevenue)}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                {fields.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <p className="text-yellow-800 text-sm">
                      Belum ada lapangan.{" "}
                      <button
                        onClick={() => setActiveTab("create")}
                        className="font-medium underline"
                      >
                        Tambah lapangan pertama →
                      </button>
                    </p>
                  </div>
                )}

                {/* Pending Bookings */}
                {pendingBookings.length > 0 && (
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-3">
                      Menunggu Konfirmasi
                    </h2>
                    <div className="space-y-3">
                      {pendingBookings.slice(0, 5).map((booking) => (
                        <AdminBookingCard
                          key={booking.id}
                          booking={booking}
                          onConfirm={() => handleConfirmBooking(booking)}
                          onCancel={() => handleCancelBooking(booking)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Bookings */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Booking Terbaru
                    </h2>
                    <button
                      onClick={() => setActiveTab("bookings")}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      Lihat Semua →
                    </button>
                  </div>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-xl border text-gray-500">
                      Belum ada booking
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 5).map((booking) => (
                        <AdminBookingCard
                          key={booking.id}
                          booking={booking}
                          onConfirm={() => handleConfirmBooking(booking)}
                          onCancel={() => handleCancelBooking(booking)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Semua Booking ({bookings.length})
                </h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border">
                    <p className="text-gray-500">Belum ada booking</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((booking) => (
                      <AdminBookingCard
                        key={booking.id}
                        booking={booking}
                        onConfirm={() => handleConfirmBooking(booking)}
                        onCancel={() => handleCancelBooking(booking)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Fields Tab */}
            {activeTab === "fields" && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Daftar Lapangan ({fields.length})
                  </h2>
                  <button
                    onClick={() => setActiveTab("create")}
                    className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                  >
                    + Tambah Lapangan
                  </button>
                </div>
                {fields.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border">
                    <p className="text-gray-500 mb-4">Belum ada lapangan</p>
                    <button
                      onClick={() => setActiveTab("create")}
                      className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg"
                    >
                      Tambah Lapangan Pertama
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field) => (
                      <FieldCard key={field.id} field={field} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Create Field Tab */}
            {activeTab === "create" && (
              <CreateFieldForm onSuccess={handleFieldCreated} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// Create Field Form Component
function CreateFieldForm({ onSuccess }: { onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    try {
      await createField(formData);
      alert("Lapangan berhasil ditambahkan!");
      form.reset();
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Gagal menambahkan lapangan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Tambah Lapangan Baru
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lapangan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Contoh: Lapangan Futsal A"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            />
          </div>

          {/* Field Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Lapangan <span className="text-red-500">*</span>
            </label>
            <select
              name="field_type"
              required
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white"
            >
              <option value="">Pilih jenis lapangan</option>
              <option value="Futsal">Futsal</option>
              <option value="Mini Soccer">Mini Soccer</option>
              <option value="Badminton">Badminton</option>
              <option value="Basket">Basket</option>
              <option value="Tenis">Tenis</option>
              <option value="Voli">Voli</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Harga per Jam (Rp) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price_per_hour"
              required
              min="0"
              step="1000"
              placeholder="100000"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deskripsi <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              required
              rows={4}
              placeholder="Deskripsi fasilitas dan keterangan lapangan..."
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto Lapangan
            </label>
            <input
              type="file"
              name="images"
              multiple
              accept="image/*"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none bg-white file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <p className="mt-1 text-xs text-gray-500">
              Upload satu atau lebih foto lapangan (opsional)
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {submitting ? "Menyimpan..." : "Simpan Lapangan"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Admin Booking Card
function AdminBookingCard({
  booking,
  onConfirm,
  onCancel,
}: {
  booking: Booking;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const statusConfig: Record<string, { label: string; className: string }> = {
    pending: { label: "Menunggu", className: "bg-yellow-100 text-yellow-800" },
    confirmed: {
      label: "Dikonfirmasi",
      className: "bg-green-100 text-green-800",
    },
    cancelled: { label: "Dibatalkan", className: "bg-red-100 text-red-800" },
    completed: { label: "Selesai", className: "bg-gray-100 text-gray-800" },
  };

  const config = statusConfig[booking.status] || statusConfig.pending;
  const canConfirm = booking.status === "pending";
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
            {booking.customer?.full_name} • {booking.customer?.email}
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
        <div className="flex gap-2">
          {canConfirm && (
            <button
              onClick={onConfirm}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Konfirmasi
            </button>
          )}
          {canCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
            >
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Field Card Component
function FieldCard({ field }: { field: Field }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="relative h-32 bg-gray-100">
        {field.images && field.images.length > 0 ? (
          <img
            src={
              typeof field.images[0] === "string"
                ? field.images[0]
                : field.images[0].url
            }
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
        {field.is_active && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Aktif
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900">{field.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {field.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Per jam</span>
          <span className="font-bold text-gray-900">
            {formatPrice(field.price_per_hour)}
          </span>
        </div>
      </div>
    </div>
  );
}
