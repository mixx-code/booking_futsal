"use client";

import Link from "next/link";
import { Booking } from "../types";
import { formatDate, formatPrice } from "../lib/api";
import StatusBadge from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  showActions?: boolean;
  isProvider?: boolean;
  onCancel?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
  onConfirm?: (booking: Booking) => void;
}

export default function BookingCard({
  booking,
  showActions = true,
  isProvider = false,
  onCancel,
  onReschedule,
  onConfirm,
}: BookingCardProps) {
  const canCancel =
    booking.status === "pending" || booking.status === "confirmed";
  const canReschedule =
    booking.status === "pending" || booking.status === "confirmed";
  const canConfirm = isProvider && booking.status === "pending";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg truncate">
              {booking.serviceTitle}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {isProvider ? booking.userName : booking.providerName}
            </p>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        {/* Details */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M8 2V6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M16 2V6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>{formatDate(booking.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 7V12L15 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">Total</span>
          <span className="font-bold text-gray-900">
            {formatPrice(booking.totalPrice)}
          </span>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Catatan:</span> {booking.notes}
            </p>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={`/bookings/${booking.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Detail
            </Link>

            {canConfirm && (
              <button
                onClick={() => onConfirm?.(booking)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                Konfirmasi
              </button>
            )}

            {canReschedule && !isProvider && (
              <button
                onClick={() => onReschedule?.(booking)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Reschedule
              </button>
            )}

            {canCancel && (
              <button
                onClick={() => onCancel?.(booking)}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Batalkan
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
