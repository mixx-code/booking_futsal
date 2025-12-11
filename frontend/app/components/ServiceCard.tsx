"use client";

import Image from "next/image";
import Link from "next/link";
import { Service } from "../types";
import { formatPrice } from "../lib/api";

interface ServiceCardProps {
  service: Service;
  showActions?: boolean;
  onEdit?: (service: Service) => void;
  onDelete?: (service: Service) => void;
}

export default function ServiceCard({
  service,
  showActions = false,
  onEdit,
  onDelete,
}: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Image */}
      <div className="relative h-40 bg-gray-100">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.title}
            fill
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
              <path
                d="M3 16L8 11L13 16L21 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-gray-900 text-white text-xs font-medium rounded-full">
            {service.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg">{service.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
          {service.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
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
            <span>{service.duration} menit</span>
          </div>
          <div className="font-bold text-gray-900">
            {formatPrice(service.price)}
          </div>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          oleh {service.providerName}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {showActions ? (
            <>
              <button
                onClick={() => onEdit?.(service)}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete?.(service)}
                className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Hapus
              </button>
            </>
          ) : (
            <Link
              href={`/services/${service.id}`}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors text-center"
            >
              Lihat Detail
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
