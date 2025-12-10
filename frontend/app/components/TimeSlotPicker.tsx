"use client";

import { useState, useMemo } from "react";
import { TimeSlot } from "../types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  onSelectSlot: (slot: TimeSlot) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelectSlot,
  selectedDate,
  onDateChange,
}: TimeSlotPickerProps) {
  // Generate next 7 days
  const dates = useMemo(() => {
    const result: { date: string; label: string; dayName: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      result.push({
        date: dateStr,
        label: date.getDate().toString(),
        dayName: date.toLocaleDateString("id-ID", { weekday: "short" }),
      });
    }

    return result;
  }, []);

  // Filter slots for selected date
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => slot.date === selectedDate);
  }, [slots, selectedDate]);

  return (
    <div className="space-y-4">
      {/* Date selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Tanggal
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => onDateChange(d.date)}
              className={`flex-shrink-0 flex flex-col items-center justify-center w-14 h-16 rounded-lg border transition-colors ${
                selectedDate === d.date
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-xs font-medium">{d.dayName}</span>
              <span className="text-lg font-bold">{d.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pilih Waktu
        </label>
        {filteredSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada slot tersedia untuk tanggal ini
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
            {filteredSlots.map((slot) => {
              const isSelected = selectedSlot?.id === slot.id;
              const isDisabled = !slot.isAvailable;

              return (
                <button
                  key={slot.id}
                  onClick={() => slot.isAvailable && onSelectSlot(slot)}
                  disabled={isDisabled}
                  className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    isDisabled
                      ? "bg-gray-100 text-gray-400 border-gray-100 cursor-not-allowed"
                      : isSelected
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {slot.startTime}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-white border border-gray-200"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-100"></div>
          <span>Tidak Tersedia</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-900"></div>
          <span>Dipilih</span>
        </div>
      </div>
    </div>
  );
}
