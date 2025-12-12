"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../../../../context/AuthContext";
import {
  getFieldById,
  updateField,
  formatPrice,
  Field,
} from "../../../../lib/api";
import ImageLightbox from "../../../../components/ImageLightbox";

export default function AdminFieldDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoggedIn, isLoading } = useAuth();
  const fieldId = parseInt(params.id as string);

  const [field, setField] = useState<Field | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editFieldType, setEditFieldType] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push("/login/signin");
    }
    if (!isLoading && isLoggedIn && user?.role !== "admin") {
      router.push("/dashboard/user");
    }
  }, [isLoading, isLoggedIn, user, router]);

  useEffect(() => {
    async function fetchField() {
      try {
        const data = await getFieldById(fieldId);
        setField(data);
        // Initialize edit form
        setEditName(data.name);
        setEditFieldType(data.field_type);
        setEditPrice(data.price_per_hour.toString());
        setEditDescription(data.description || "");
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (isLoggedIn && user?.role === "admin") {
      fetchField();
    }
  }, [fieldId, isLoggedIn, user]);

  async function handleSubmitEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!field) return;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("field_type", editFieldType);
      formData.append("price_per_hour", editPrice);
      formData.append("description", editDescription);

      await updateField(field.id, formData);

      // Update local state
      setField({
        ...field,
        name: editName,
        field_type: editFieldType,
        price_per_hour: parseFloat(editPrice),
        description: editDescription,
      });

      setIsEditing(false);
      alert("Lapangan berhasil diperbarui!");
    } catch (err: any) {
      alert(err.message || "Gagal memperbarui lapangan");
    } finally {
      setSubmitting(false);
    }
  }

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Lapangan tidak ditemukan
          </h1>
          <Link
            href="/dashboard/provider"
            className="text-slate-600 hover:text-slate-900 underline"
          >
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/provider"
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
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
                <h1 className="text-xl font-bold text-slate-900">
                  Detail Lapangan
                </h1>
                <p className="text-sm text-slate-500">Dashboard Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          {/* Field Image Carousel */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 mb-6">
            <div className="relative h-48 md:h-80 bg-slate-100">
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
                      alt={`${field.name} - Gambar ${currentImageIndex + 1}`}
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

                  {/* Dot Indicators - hidden on mobile, shown on desktop */}
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

                  {/* Image Counter - centered on mobile, bottom-right on desktop */}
                  {field.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-3 px-3 py-1.5 bg-black/60 text-white text-xs md:text-sm font-medium rounded-full">
                      {currentImageIndex + 1} / {field.images.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
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
                <span className="px-3 py-1.5 bg-slate-900 text-white text-sm font-medium rounded-full">
                  {field.field_type}
                </span>
              </div>
              {field.is_active && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1.5 bg-emerald-500 text-white text-sm font-medium rounded-full">
                    Aktif
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Field Info / Edit Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            {isEditing ? (
              <form onSubmit={handleSubmitEdit} className="space-y-5">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                  Edit Lapangan
                </h2>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Nama Lapangan
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Jenis Lapangan
                  </label>
                  <select
                    value={editFieldType}
                    onChange={(e) => setEditFieldType(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none bg-white"
                  >
                    <option value="Indoor">Indoor</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Harga per Jam (Rp)
                  </label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    min="0"
                    step="1000"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Deskripsi
                  </label>
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2.5 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      {field.name}
                    </h2>
                    <p className="text-slate-500 mt-1">ID: {field.id}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Edit
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500">Jenis Lapangan</span>
                    <span className="font-medium text-slate-900">
                      {field.field_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500">Harga per Jam</span>
                    <span className="font-bold text-slate-900">
                      {formatPrice(field.price_per_hour)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <span className="text-slate-500">Status</span>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full ${
                        field.is_active
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {field.is_active ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </div>

                  <div className="pt-3">
                    <span className="text-slate-500 block mb-2">Deskripsi</span>
                    <p className="text-slate-900">
                      {field.description || "Tidak ada deskripsi"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    href="/dashboard/provider"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M19 12H5M5 12L12 19M5 12L12 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Kembali ke Dashboard
                  </Link>
                </div>
              </>
            )}
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
