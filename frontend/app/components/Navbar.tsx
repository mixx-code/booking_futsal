"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-4">
        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <Link
            href="/services"
            className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
          >
            Lapangan
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={
                  user?.role === "admin"
                    ? "/dashboard/provider"
                    : "/dashboard/user"
                }
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm">
                  {user?.full_name}
                </span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login/signin"
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors py-2"
              >
                Masuk
              </Link>
              <Link
                href="/login/signup"
                className="px-4 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center">
          <button
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="p-3 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-200"
              style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
            >
              {open ? (
                <path
                  d="M6 6L18 18M6 18L18 6"
                  stroke="#1e293b"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              ) : (
                <>
                  <path
                    d="M4 7H20"
                    stroke="#1e293b"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 12H20"
                    stroke="#1e293b"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 17H20"
                    stroke="#1e293b"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden absolute right-0 mt-2 w-56 bg-white shadow-xl rounded-xl p-2 z-50 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <Link
            href="/services"
            onClick={() => setOpen(false)}
            className="block py-3 px-4 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            Lapangan
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href={
                  user?.role === "admin"
                    ? "/dashboard/provider"
                    : "/dashboard/user"
                }
                onClick={() => setOpen(false)}
                className="block py-3 px-4 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <div className="mt-2 pt-2 border-t border-slate-100">
                <div className="px-4 py-2 text-sm text-slate-500">
                  {user?.full_name}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full mt-1 px-4 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors text-left"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2 p-2">
              <Link
                href="/login/signin"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-200 text-center text-slate-700 font-medium hover:bg-slate-50 transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/login/signup"
                onClick={() => setOpen(false)}
                className="flex-1 px-4 py-3 rounded-lg bg-slate-900 text-white text-center font-medium hover:bg-slate-800 transition-colors"
              >
                Daftar
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
