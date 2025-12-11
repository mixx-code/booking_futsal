"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoginClient() {
  const router = useRouter();
  const [closing, setClosing] = useState(false);
  const [entering, setEntering] = useState(false);

  function handleClose() {
    setClosing(true);
    // wait for the animation to finish then navigate
    setTimeout(() => {
      router.push("/");
    }, 340);
  }

  useEffect(() => {
    // Trigger entry animation on next frame so CSS animation runs reliably
    const raf = requestAnimationFrame(() => setEntering(true));
    return () => cancelAnimationFrame(raf);
  }, []);

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
            aria-label="Close login"
          >
            ✕
          </button>

          <button
            onClick={handleClose}
            className="hidden lg:block absolute left-4 top-4 p-2 rounded bg-white shadow"
            aria-label="Close login"
          >
            ✕
          </button>

          <h1 className="display-font text-5xl font-extrabold text-gray-900">
            Halo!
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Gunakan email atau layanan lain untuk melanjutkan
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

          <button
            onClick={() => router.push("/login/signup")}
            className="mt-6 w-full bg-blue-600 text-white px-4 py-3 rounded-md font-medium"
          >
            Lanjutkan dengan email
          </button>

          <p className="mt-8 text-xs text-gray-500">
            Dengan melanjutkan, Anda menyetujui{" "}
            <a className="underline">Ketentuan Layanan</a>. Baca juga{" "}
            <a className="underline">Kebijakan Privasi</a>.
          </p>
        </div>
      </div>

      {/* Right - colorful panel (replace background with photo later). Fade-in on mount. */}
      <div className="hidden lg:block lg:w-1/2 fade-in-up">
        <div className="h-full w-full bg-gradient-to-br from-yellow-300 via-pink-300 to-indigo-300" />
      </div>
    </div>
  );
}
