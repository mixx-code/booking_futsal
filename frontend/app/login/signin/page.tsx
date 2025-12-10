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
            aria-label="Close sign in"
          >
            ✕
          </button>

          <button
            onClick={handleClose}
            className="hidden lg:block absolute left-4 top-4 p-2 rounded bg-white shadow"
            aria-label="Close sign in"
          >
            ✕
          </button>

          <h1 className="display-font text-5xl font-extrabold text-gray-900">
            Selamat datang kembali
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Masuk untuk melanjutkan pemesanan lapangan futsal
          </p>

          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="contoh@email.com"
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
                  placeholder="••••••••"
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-gray-900 text-white px-4 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? "Sedang masuk..." : "Masuk"}
            </button>
          </form>

          {error && <div className="mt-3 text-sm text-red-600">{error}</div>}

          <div className="mt-6 text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/login/signup"
              className="text-gray-900 font-medium hover:underline"
            >
              Daftar
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
        <div className="h-full w-full bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600" />
      </div>
    </div>
  );
}
