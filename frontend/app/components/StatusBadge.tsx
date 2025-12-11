"use client";

import { BookingStatus } from "../types";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

const statusConfig: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Menunggu",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  confirmed: {
    label: "Dikonfirmasi",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  cancelled: {
    label: "Dibatalkan",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  completed: {
    label: "Selesai",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const sizeClasses =
    size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${config.className} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
