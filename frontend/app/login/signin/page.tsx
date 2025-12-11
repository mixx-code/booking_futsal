"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { login, setUser } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { setUser: setAuthUser } = useAuth();
  const [entering, setEntering] = useState(false);
  const [closing, setClosing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const email = String(data.get("email") || "").trim();
    const password = String(data.get("password") || "");

    try {
      const result = await login(email, password);

      // Update auth context
      setAuthUser(result.user);

      // Animate out then redirect based on role
      setClosing(true);
      setTimeout(() => {
        if (result.user.role === "admin") {
          router.push("/dashboard/provider");
        } else {
          router.push("/dashboard/user");
        }
      }, 340);
    } catch (err: any) {
      console.error("Login page error:", err);
      setError(err.message || "Gagal masuk");
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
            aria-label="Close sign in"
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
            aria-label="Close sign in"
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
            Selamat datang kembali
          </h1>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-slate-600">
            Masuk untuk melanjutkan pemesanan lapangan futsal
          </p>

          <form className="mt-6 sm:mt-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="contoh@email.com"
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
                  placeholder="••••••••"
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
              className="mt-6 w-full bg-slate-900 text-white px-4 py-3.5 rounded-xl font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20"
            >
              {submitting ? "Sedang masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 text-sm text-slate-600 text-center">
            Belum punya akun?{" "}
            <Link
              href="/login/signup"
              className="text-slate-900 font-semibold hover:underline"
            >
              Daftar
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
        <div className="h-full w-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600" />
      </div>
    </div>
  );
}
