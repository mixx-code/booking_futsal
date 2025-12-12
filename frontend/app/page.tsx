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

        {/* Social Proof Section */}
        <section className="py-12 sm:py-16 border-t border-slate-100 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Intro Description */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12 sm:mb-16">
              {/* Left - Description Paragraph */}
              <div className="lg:col-span-3">
                <p className="text-base sm:text-lg leading-relaxed text-slate-600">
                  <span className="text-slate-900 font-semibold">
                    BookingFutsal
                  </span>{" "}
                  adalah platform{" "}
                  <span className="text-slate-900 font-medium">
                    pemesanan lapangan futsal tercepat dan termudah
                  </span>{" "}
                  untuk komunitas olahraga, tim futsal, dan siapa saja yang
                  ingin bermain.{" "}
                  <span className="text-slate-900 font-medium">
                    Cari lapangan terdekat
                  </span>{" "}
                  dengan harga terbaik, atau jelajahi berbagai pilihan venue di
                  kotamu. Lihat ketersediaan slot waktu, cek fasilitas, dan{" "}
                  <span className="text-slate-900 font-medium">
                    booking langsung dalam hitungan detik
                  </span>
                  . Kelola jadwal pertandinganmu dan bayar dengan aman—semua
                  dalam satu platform yang{" "}
                  <span className="text-slate-900 font-medium">
                    simpel dan modern
                  </span>
                  . Yuk, main futsal!
                </p>
              </div>

              {/* Right - Highlight Card */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
                  <p className="text-xs font-semibold tracking-[0.15em] text-slate-400 uppercase mb-4">
                    Slot Populer Hari Ini
                  </p>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-white"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M12 6v6l4 2"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-lg">
                        Sore 17:00 - 19:00
                      </h4>
                      <p className="text-sm text-slate-500 mt-1">
                        Waktu favorit untuk bermain futsal bersama rekan kerja
                        setelah jam kantor. Booking lebih awal untuk
                        ketersediaan!
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      Terisi 85% hari ini
                    </span>
                    <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full w-[85%] bg-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <p className="text-center text-xs sm:text-sm font-semibold tracking-[0.2em] text-slate-400 uppercase mb-8 sm:mb-10">
              Dipercaya oleh <span className="text-slate-600">1.000+</span>{" "}
              Komunitas Futsal &amp; Mitra Terpercaya
            </p>
          </div>

          {/* Marquee Container */}
          <div className="marquee-container">
            <div className="animate-marquee flex items-center gap-12 sm:gap-16 md:gap-20 w-max">
              {/* First set of logos */}
              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Kemenpora RI
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 2a10 10 0 0110 10l-5 2-5-2-5 2a10 10 0 0110-10z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">PSSI</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Liga Futsal ID
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M3 21h18M5 21V7l7-4 7 4v14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="9"
                    y="13"
                    width="6"
                    height="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  GOR Jakarta
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 4v4M12 16v4M4 12h4M16 12h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">SportHub</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <polygon
                    points="12,2 15,8.5 22,9.5 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.5 9,8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">
                  FutsalPro
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6l2 4 4 .5-3 2.5 1 4-4-2-4 2 1-4-3-2.5 4-.5 2-4z"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Arena Sports
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
                <span className="font-bold text-sm sm:text-base">PlayZone</span>
              </div>

              {/* Duplicate set for seamless loop */}
              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6v6l4 2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Kemenpora RI
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 2a10 10 0 0110 10l-5 2-5-2-5 2a10 10 0 0110-10z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">PSSI</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M8 12h8M12 8v8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Liga Futsal ID
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M3 21h18M5 21V7l7-4 7 4v14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <rect
                    x="9"
                    y="13"
                    width="6"
                    height="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  GOR Jakarta
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 4v4M12 16v4M4 12h4M16 12h4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">SportHub</span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <polygon
                    points="12,2 15,8.5 22,9.5 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.5 9,8.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base">
                  FutsalPro
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <path
                    d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M12 6l2 4 4 .5-3 2.5 1 4-4-2-4 2 1-4-3-2.5 4-.5 2-4z"
                    fill="currentColor"
                    fillOpacity="0.3"
                  />
                </svg>
                <span className="font-bold text-sm sm:text-base whitespace-nowrap">
                  Arena Sports
                </span>
              </div>

              <div className="flex items-center gap-2 text-slate-600 px-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <rect
                    x="2"
                    y="6"
                    width="20"
                    height="12"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M10 9l5 3-5 3V9z" fill="currentColor" />
                </svg>
                <span className="font-bold text-sm sm:text-base">PlayZone</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
