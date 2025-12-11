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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-slate-700 transition-colors"
            >
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
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/login/signin"
                  className="px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-10 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h1 className="display-font text-2xl sm:text-3xl md:text-4xl font-extrabold">
            Temukan Lapangan
          </h1>
          <p className="mt-2 sm:mt-3 text-slate-300 max-w-xl text-sm sm:text-base">
            Pilih lapangan yang sesuai dengan kebutuhan Anda dan booking
            sekarang.
          </p>
        </div>
      </div>

      {/* Fields Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
            <p className="mt-4 text-slate-600">Memuat data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-600">{error}</p>
          </div>
        ) : fields.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-600">Tidak ada lapangan tersedia</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
                {fields.length} Lapangan Tersedia
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="relative h-36 sm:h-40 bg-slate-100 overflow-hidden">
                    {field.images && field.images.length > 0 ? (
                      <Image
                        src={
                          typeof field.images[0] === "string"
                            ? field.images[0]
                            : field.images[0].url
                        }
                        alt={field.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
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
                      <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                        {field.field_type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-lg">
                      {field.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                      {field.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
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
                      <div className="font-bold text-slate-900 text-lg">
                        {formatPrice(field.price_per_hour)}
                      </div>
                    </div>

                    <Link
                      href={`/services/${field.id}`}
                      className="mt-4 block w-full px-4 py-3 text-sm font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors text-center shadow-sm"
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
