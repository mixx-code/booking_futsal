"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFields, formatPrice, Field } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function ServicesPage() {
  const { user, isLoggedIn } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFields() {
      try {
        const data = await getFields();
        setFields(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchFields();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-extrabold text-gray-900">
              BookingFutsal
            </Link>
            <div className="flex items-center gap-3">
              {isLoggedIn ? (
                <Link
                  href={
                    user?.role === "admin"
                      ? "/dashboard/provider"
                      : "/dashboard/user"
                  }
                  className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login/signin"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="display-font text-3xl md:text-4xl font-extrabold">
            Temukan Lapangan
          </h1>
          <p className="mt-2 text-gray-300 max-w-xl">
            Pilih lapangan yang sesuai dengan kebutuhan Anda dan booking
            sekarang.
          </p>
        </div>
      </div>

      {/* Fields Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">{error}</p>
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600">Tidak ada lapangan tersedia</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {fields.length} Lapangan Tersedia
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-40 bg-gray-100">
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
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="3"
                            y="3"
                            width="18"
                            height="18"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle
                            cx="8.5"
                            cy="8.5"
                            r="1.5"
                            fill="currentColor"
                          />
                          <path
                            d="M3 16L8 11L13 16L21 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
                        {field.field_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {field.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {field.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg
                          width="16"
                          height="16"
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
                      <div className="font-bold text-gray-900">
                        {formatPrice(field.price_per_hour)}
                      </div>
                    </div>

                    <Link
                      href={`/services/${field.id}`}
                      className="mt-4 block w-full px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-center"
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
