"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ServiceForm {
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
}

export default function NewServicePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<ServiceForm>({
    title: "",
    description: "",
    category: "Futsal",
    duration: 60,
    price: 0,
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "price" ? Number(value) : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    // Mock API call - ready for backend integration
    try {
      // const res = await fetch("/api/v1/services", {
      //   method: "POST",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      // if (!res.ok) throw new Error("Failed to create service");

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      alert("Layanan berhasil dibuat! (mock)");
      router.push("/dashboard/provider");
    } catch (error) {
      alert("Gagal membuat layanan");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/provider"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                Tambah Layanan Baru
              </h1>
              <p className="text-sm text-gray-500">
                Isi detail layanan yang ingin Anda tawarkan
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Informasi Dasar
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Judul Layanan *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Contoh: Lapangan Futsal A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Deskripsi
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deskripsikan fasilitas dan keunggulan layanan Anda..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Kategori *
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow bg-white"
                >
                  <option value="Futsal">In Door</option>
                  <option value="Mini Soccer">Out Door</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing & Duration */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Harga & Durasi
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="duration"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Durasi (menit) *
                </label>
                <select
                  id="duration"
                  name="duration"
                  value={form.duration}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow bg-white"
                >
                  <option value={30}>30 menit</option>
                  <option value={60}>60 menit (1 jam)</option>
                  <option value={90}>90 menit (1.5 jam)</option>
                  <option value={120}>120 menit (2 jam)</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Harga (Rp) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={form.price || ""}
                    onChange={handleChange}
                    required
                    min={0}
                    step={5000}
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-shadow"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Harga per sesi ({form.duration} menit)
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload (Placeholder) */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Foto Layanan
            </h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-10 h-10 mx-auto"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                Drag & drop atau klik untuk upload
              </p>
              <p className="text-xs text-gray-400">PNG, JPG hingga 5MB</p>
              <input type="file" accept="image/*" className="hidden" />
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/dashboard/provider"
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Menyimpan..." : "Simpan Layanan"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
