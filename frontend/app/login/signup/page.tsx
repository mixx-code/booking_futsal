"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SignUpPage() {
  const router = useRouter();
  const [entering, setEntering] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const body = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      password: String(data.get("password") || ""),
    };

    try {
      const res = await fetch("/api/v1/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json?.message || "Pendaftaran gagal");
        setSubmitting(false);
        return;
      }

      // success -> animate out then redirect
      setClosing(true);
      setTimeout(() => router.push("/"), 340);
    } catch (err) {
      setError("Kesalahan jaringan");
      setSubmitting(false);
    }
  }

  function handleClose() {
    setClosing(true);
    setTimeout(() => router.push("/"), 340);
  }

  return (
    <div
      className={
        "min-h-screen flex " +
        (entering && !closing ? "fade-in-up " : "") +
        (closing ? "fade-out-down" : "")
      }
    >
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full px-8 py-12">
          <button
            onClick={handleClose}
            className="lg:hidden mb-6 p-2 rounded bg-gray-100"
            aria-label="Close sign up"
          >
            ✕
          </button>

          <button
            onClick={handleClose}
            className="hidden lg:block absolute left-4 top-4 p-2 rounded bg-white shadow"
            aria-label="Close sign up"
          >
            ✕
          </button>

          <h1 className="display-font text-5xl font-extrabold text-gray-900">
            Buat akun
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Buat akun untuk mulai memesan lapangan futsal.
          </p>

          <div className="mt-8 space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm bg-white">
              <span className="text-lg font-bold">G</span>
              <span className="flex-1 text-left">Lanjutkan dengan Google</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm bg-white">
              <span className="text-lg"></span>
              <span className="flex-1 text-left">Lanjutkan dengan Apple</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-xs text-gray-400">ATAU</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nama lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Kata sandi
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-3 rounded-md font-medium"
            >
              {submitting ? "Membuat akun..." : "Buat akun"}
            </button>
          </form>

          {error ? (
            <div className="mt-3 text-sm text-red-600">{error}</div>
          ) : null}

          <div className="mt-4 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link href="/login/signin" className="text-indigo-600">
              Masuk
            </Link>
          </div>

          <p className="mt-8 text-xs text-gray-500">
            Dengan melanjutkan, Anda menyetujui{" "}
            <a className="underline">Ketentuan Layanan</a>.
          </p>
        </div>
      </div>

      {/* Right - colorful panel */}
      <div className="hidden lg:block lg:w-1/2 fade-in-up">
        <div className="h-full w-full bg-gradient-to-br from-yellow-300 via-pink-300 to-indigo-300" />
      </div>
    </div>
  );
}
