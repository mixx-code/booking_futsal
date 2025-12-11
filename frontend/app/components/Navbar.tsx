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
            className="text-gray-700 hover:text-gray-900 cursor-pointer"
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
                className="text-gray-700 hover:text-gray-900"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <span className="text-gray-600">{user?.full_name}</span>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <Link href="/login/signin" className="flex items-center gap-4">
              <span className="text-gray-700">Masuk</span>
              <button className="px-4 py-2 bg-gray-900 text-white rounded cursor-pointer">
                Daftar
              </button>
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex lg:hidden items-center">
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded-md bg-gray-100"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 7H20"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 12H20"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 17H20"
                stroke="#111827"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden absolute right-0 mt-2 w-52 bg-white shadow-lg rounded-md p-3 z-50">
          <Link
            href="/services"
            className="block py-2 px-2 rounded hover:bg-gray-50"
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
                className="block py-2 px-2 rounded hover:bg-gray-50"
              >
                Dashboard
              </Link>
              <div className="mt-3 pt-3 border-t">
                <div className="px-2 text-sm text-gray-600 mb-2">
                  {user?.full_name}
                </div>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="w-full px-3 py-2 rounded bg-gray-100 text-gray-700"
                >
                  Keluar
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 flex gap-2">
              <Link
                href="/login/signin"
                className="flex-1 px-3 py-2 rounded border text-center"
              >
                Masuk
              </Link>
              <Link
                href="/login/signup"
                className="flex-1 px-3 py-2 rounded bg-gray-900 text-white text-center"
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
