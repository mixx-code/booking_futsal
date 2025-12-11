"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { register } from "../../lib/api";

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

    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");
    const phone = String(data.get("phone") || "").trim();

    try {
      await register(name, email, password, phone);
      // success -> animate out then redirect
      setClosing(true);
      setTimeout(() => router.push("/login/signin"), 340);
    } catch (err: any) {
      setError(err.message || "Pendaftaran gagal");
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
        "min-h-screen flex bg-white " +
        (entering && !closing ? "fade-in-up " : "") +
        (closing ? "fade-out-down" : "")
      }
    >
      {/* Left - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6">
        <div className="max-w-md w-full py-8 sm:py-12">
          {/* Close button - mobile */}
          <button
            onClick={handleClose}
            className="lg:hidden mb-6 p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            aria-label="Close sign up"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Close button - desktop */}
          <button
            onClick={handleClose}
            className="hidden lg:flex absolute left-4 top-4 p-2.5 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow items-center justify-center"
            aria-label="Close sign up"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#1e293b"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <h1 className="display-font text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Buat akun
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
            Buat akun untuk mulai memesan lapangan futsal.
          </p>

          <form className="mt-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nama lengkap
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nomor Telepon
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  className="block w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Kata sandi
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-blue-600 text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30"
            >
              {submitting ? "Membuat akun..." : "Buat akun"}
            </button>
          </form>

          <div className="mt-4 text-sm text-slate-600 text-center">
            Sudah punya akun?{" "}
            <Link
              href="/login/signin"
              className="text-blue-600 font-semibold hover:underline"
            >
              Masuk
            </Link>
          </div>

          <p className="mt-8 text-xs text-slate-500 text-center">
            Dengan melanjutkan, Anda menyetujui{" "}
            <a href="#" className="underline hover:text-slate-700">
              Ketentuan Layanan
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right - colorful panel */}
      <div className="hidden lg:block lg:w-1/2 fade-in-up">
        <div className="h-full w-full bg-gradient-to-br from-yellow-300 via-pink-300 to-indigo-400" />
      </div>
    </div>
  );
}
