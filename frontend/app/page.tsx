import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      {/* Header */}
      <header className="border-b border-slate-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xl sm:text-2xl font-extrabold text-slate-900 hover:text-slate-700 transition-colors"
            >
              BookingFutsal
            </Link>
          </div>
          <Navbar />
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12">
            {/* Left - Big heading and CTAs */}
            <div className="order-2 lg:order-1">
              <h1 className="display-font text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[88px] font-extrabold tracking-tight leading-[1.05] text-slate-900">
                Pesan lapangan futsal terdekat dengan mudah
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 max-w-xl leading-relaxed">
                Temukan lapangan, atur jadwal, dan bayar secara aman dalam
                beberapa klik.
              </p>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  href="/dashboard/user"
                  className="px-6 py-3.5 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-slate-800 hover:shadow-xl text-base font-semibold text-center transition-all duration-200 hover:-translate-y-0.5"
                >
                  Pesan Sekarang
                </Link>
                <Link
                  href="/services"
                  className="px-6 py-3.5 bg-slate-100 text-slate-700 rounded-xl text-base font-medium text-center hover:bg-slate-200 transition-colors"
                >
                  Lihat Lapangan
                </Link>
              </div>
            </div>

            {/* Right - field illustrations */}
            <div className="order-1 lg:order-2 relative">
              {/* Mobile: Stack cards vertically */}
              <div className="flex flex-col gap-4 lg:hidden">
                {/* Main card */}
                <div className="relative rounded-2xl shadow-xl overflow-hidden h-48 sm:h-56">
                  <Image
                    src="/football-field.svg"
                    alt="lapangan futsal besar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-2 z-20">
                    <div className="bg-white/95 backdrop-blur-sm text-sm text-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 7V12L15 14"
                          stroke="#1e293b"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="#1e293b"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span className="font-medium">08:00 - 10:00</span>
                    </div>
                    <div className="bg-slate-900 text-sm text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"
                          stroke="rgba(255,255,255,0.9)"
                          strokeWidth="1.2"
                        />
                      </svg>
                      <span className="font-semibold">Rp200.000/jam</span>
                    </div>
                  </div>
                </div>

                {/* Secondary cards - side by side on mobile */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-xl shadow-lg overflow-hidden h-32">
                    <Image
                      src="/football-field-medium.svg"
                      alt="lapangan futsal medium"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute left-2 top-2 z-20">
                      <div className="bg-slate-900 text-xs text-white px-2 py-1 rounded-full shadow">
                        <span className="font-semibold">Rp150.000/jam</span>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-xl shadow-lg overflow-hidden h-32">
                    <Image
                      src="/football-field-small.svg"
                      alt="lapangan futsal kecil"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                    <div className="absolute left-2 top-2 z-20">
                      <div className="bg-slate-900 text-xs text-white px-2 py-1 rounded-full shadow">
                        <span className="font-semibold">Rp100.000/jam</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop: Staircase layout */}
              <div className="hidden lg:block relative h-96">
                {/* Large field (bottom step) */}
                <div className="absolute right-56 top-24 w-96 h-72 rounded-2xl shadow-2xl overflow-hidden">
                  <Image
                    src="/football-field.svg"
                    alt="lapangan futsal besar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute left-4 top-4 flex flex-col gap-2 z-20">
                    <div className="bg-white/95 backdrop-blur-sm text-base text-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg ring-1 ring-slate-200/50">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 7V12L15 14"
                          stroke="#1e293b"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="#1e293b"
                          strokeWidth="1.5"
                        />
                      </svg>
                      <span className="font-medium">08:00 - 10:00</span>
                    </div>
                    <div className="bg-slate-900 text-base text-white px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"
                          stroke="rgba(255,255,255,0.9)"
                          strokeWidth="1.2"
                        />
                      </svg>
                      <span className="font-semibold">Rp200.000/jam</span>
                    </div>
                  </div>
                </div>

                {/* Medium field (middle step) */}
                <div
                  className="absolute right-28 top-16 w-72 h-52 rounded-xl shadow-lg overflow-hidden"
                  style={{ transform: "rotate(-4deg)" }}
                >
                  <Image
                    src="/football-field-medium.svg"
                    alt="lapangan futsal medium"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute left-3 top-3 flex flex-col gap-2 z-20">
                    <div className="bg-white/95 backdrop-blur-sm text-sm text-slate-800 px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md ring-1 ring-slate-200/50">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M12 7V12L15 14"
                          stroke="#1e293b"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          stroke="#1e293b"
                          strokeWidth="1.4"
                        />
                      </svg>
                      <span className="font-medium">09:00 - 11:00</span>
                    </div>
                    <div className="bg-slate-900 text-sm text-white px-2.5 py-1.5 rounded-full flex items-center gap-2 shadow-md">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"
                          stroke="rgba(255,255,255,0.95)"
                          strokeWidth="1.1"
                        />
                      </svg>
                      <span className="font-semibold">Rp150.000/jam</span>
                    </div>
                  </div>
                </div>

                {/* Small field (top step) */}
                <div
                  className="absolute right-6 top-4 w-44 h-28 rounded-lg shadow-md overflow-hidden"
                  style={{ transform: "rotate(6deg)" }}
                >
                  <Image
                    src="/football-field-small.svg"
                    alt="lapangan futsal kecil"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute left-2 top-2 z-20">
                    <div className="bg-slate-900 text-sm text-white px-2.5 py-1 rounded-full flex items-center gap-2 shadow-md">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
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
                        />
                      </svg>
                      <span className="font-semibold">Rp100.000/jam</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="text-xl font-bold text-white">BookingFutsal</div>
              <div className="text-sm text-slate-400">
                © {new Date().getFullYear()} BookingFutsal. Semua hak
                dilindungi.
              </div>
            </div>

            <div className="hidden md:block text-sm text-slate-400">
              oleh Rizki & Danar
            </div>

            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2h10a5 5 0 015 5v10a5 5 0 01-5 5H7a5 5 0 01-5-5V7a5 5 0 015-5z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M17.5 6.5h.01"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                  />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
                aria-label="Facebook"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
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
        </div>
      </footer>
    </div>
  );
}
