"use client";

import React, { useState } from "react";

export default function SearchClient() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("Semua Kategori");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&category=${encodeURIComponent(
          category
        )}`
      );
      if (!res.ok) throw new Error("Respons jaringan bermasalah");
      const data = await res.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="mt-8 bg-white rounded-lg p-4 shadow-md flex gap-2 items-center"
      >
        <input
          aria-label="cari"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 p-3 rounded-md border border-gray-200"
          placeholder="Cari tempat, layanan, atau kota (mis. futsal Surabaya)"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-md border border-gray-200 bg-white"
        >
          <option>Semua Kategori</option>
          <option>Lapangan</option>
          <option>Pelatih</option>
          <option>Turnamen</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md"
        >
          {loading ? "Mencari..." : "Cari"}
        </button>
      </form>

      <div className="mt-4 text-sm text-indigo-100">
        Contoh: Lapangan futsal, Pelatih pribadi, Turnamen
      </div>

      <div className="mt-6">
        {loading && (
          <div className="text-sm text-gray-600">Memuat hasil...</div>
        )}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {!loading && !error && results.length === 0 && (
          <div className="text-sm text-gray-600">Tidak ada hasil.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {results.map((r) => (
            <div key={r.id} className="p-4 bg-white rounded shadow">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-500">
                {r.location} • {r.category}
              </div>
              <div className="mt-2 text-indigo-600 font-medium">{r.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
