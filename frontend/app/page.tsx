import Image from "next/image";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-extrabold text-gray-900">
              BookingFutsal
            </div>
          </div>
          <Navbar />
        </div>
      </header>

      <main>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
            {/* Left - Big heading and CTAs */}
            <div className="order-1">
              <h1 className="display-font text-[62px] md:text-[88px] lg:text-[104px] font-extrabold tracking-tight leading-[0.92]">
                Pesan lapangan futsal terdekat dengan mudah
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl">
                Temukan lapangan, atur jadwal, dan bayar secara aman dalam
                beberapa klik.
              </p>

              <div className="mt-8 flex items-center gap-4">
                <button className="px-6 py-3 bg-gray-900 text-white rounded-lg shadow text-base md:text-lg font-semibold">
                  Pesan Sekarang
                </button>
                <button className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg text-base md:text-lg">
                  Lihat Lapangan
                </button>
              </div>
            </div>

            {/* Right - field illustrations (different sizes). Mobile: stacked. Desktop: staircase. */}
            <div className="order-2 lg:order-2 relative lg:h-96">
              {/* Large field (bottom step on lg, first in flow on mobile) */}
              <div className="static mx-auto mb-6 lg:absolute lg:right-56 lg:top-24 lg:w-96 lg:h-72 rounded-2xl shadow-2xl overflow-hidden w-11/12 h-48">
                <Image
                  src="/football-field.svg"
                  alt="lapangan futsal besar"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute left-4 top-4 flex flex-col gap-2 z-20">
                  <div className="bg-white text-sm md:text-base text-gray-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg ring-1 ring-gray-200">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7V12L15 14"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#111827"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">08:00 - 10:00</span>
                  </div>
                  <div className="bg-gray-900 text-sm md:text-base text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"
                        stroke="rgba(255,255,255,0.9)"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold">Rp200.000/jam</span>
                  </div>
                </div>
              </div>

              {/* Medium field (middle step on lg, second in flow on mobile) */}
              <div
                className="static mx-auto mb-6 lg:absolute lg:right-28 lg:top-16 lg:w-72 lg:h-52 rounded-xl shadow-lg overflow-hidden w-9/12 h-40"
                style={{ transform: "rotate(-4deg)" }}
              >
                <Image
                  src="/football-field-medium.svg"
                  alt="lapangan futsal medium"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute left-3 top-3 flex flex-col gap-2 z-20">
                  <div className="bg-white text-sm text-gray-800 px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md ring-1 ring-gray-200">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7V12L15 14"
                        stroke="#111827"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#111827"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-medium">09:00 - 11:00</span>
                  </div>
                  <div className="bg-gray-900 text-sm text-white px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"
                        stroke="rgba(255,255,255,0.95)"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold">Rp150.000/jam</span>
                  </div>
                </div>
              </div>

              {/* Small field (top step on lg, last in flow on mobile) */}
              <div
                className="static mx-auto mb-0 lg:absolute lg:right-6 lg:top-4 lg:w-44 lg:h-28 rounded-lg shadow-md overflow-hidden w-8/12 h-28"
                style={{ transform: "rotate(6deg)" }}
              >
                <Image
                  src="/football-field-small.svg"
                  alt="lapangan futsal kecil"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute left-2 top-2 z-20">
                  <div className="bg-gray-900 text-sm text-white px-2.5 py-1 rounded-full flex items-center gap-2 shadow-md">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 7V12L15 14"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="9"
                        stroke="#ffffff"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="font-semibold">Rp100.000/jam</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="text-xl font-bold text-white">BookingFutsal</div>
            <div className="text-sm text-gray-400">
              © {new Date().getFullYear()} BookingFutsal. Semua hak dilindungi.
            </div>
          </div>

          <div className="hidden md:block text-sm text-gray-400">
            oleh Rizki & Danar
          </div>

          <div className="flex gap-3">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17.5 6.5h.01"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 2.01L2 2"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 8a6 6 0 10-8 0v4H7v4h3v6h4v-6h3l1-4h-4V8z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
