import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

// Indonesia timezone offset (WIB = UTC+7)
const INDONESIA_OFFSET_HOURS = 7;

/**
 * Get available time slots for a field on a specific date
 * Handles timezone conversion from UTC (database) to local time (Indonesia WIB)
 */
export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // Format: YYYY-MM-DD

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const selectedDate = new Date(date as string);
    const dayOfWeek = selectedDate.getDay(); // 0-6, 0=Minggu

    // Get field schedule for the day
    const fieldSchedule = await prisma.schedules.findFirst({
      where: {
        field_id: parseInt(id),
        day_of_week: dayOfWeek,
        is_available: true,
      },
    });

    if (!fieldSchedule) {
      return res.json({
        success: true,
        data: [],
        message: "Field is not available on this day",
      });
    }

    // Get existing bookings for the date
    const startOfDay = new Date(date as string);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date as string);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingBookings = await prisma.bookings.findMany({
      where: {
        field_id: parseInt(id),
        booking_date: {
          gte: startOfDay,
          lt: endOfDay,
        },
        status: {
          in: ["confirmed", "pending"],
        },
      },
      select: {
        start_time: true,
        end_time: true,
      },
    });

    // Extract hours from schedule
    // Database stores UTC, we need to convert to local Indonesia time (UTC+7)
    const scheduleStartTime = new Date(fieldSchedule.start_time);
    const scheduleEndTime = new Date(fieldSchedule.end_time);

    // Get UTC hours and add Indonesia offset to get local hours
    let scheduleStartHour =
      scheduleStartTime.getUTCHours() + INDONESIA_OFFSET_HOURS;
    let scheduleEndHour =
      scheduleEndTime.getUTCHours() + INDONESIA_OFFSET_HOURS;

    // Handle day overflow (e.g., if UTC+7 pushes to next day)
    if (scheduleStartHour >= 24) scheduleStartHour -= 24;
    if (scheduleEndHour >= 24) scheduleEndHour -= 24;
    if (scheduleEndHour === 0) scheduleEndHour = 24; // Handle midnight as 24 for end time

    console.log(
      `Schedule (WIB): ${scheduleStartHour}:00 - ${scheduleEndHour}:00`
    );

    // Generate available time slots (1 hour intervals)
    const availableSlots = [];

    for (let hour = scheduleStartHour; hour < scheduleEndHour; hour++) {
      // Create slot times - use local hour directly
      // The frontend will receive these as local Indonesia times
      const slotStart = new Date(date as string);
      slotStart.setUTCHours(hour - INDONESIA_OFFSET_HOURS, 0, 0, 0);

      const slotEnd = new Date(date as string);
      slotEnd.setUTCHours(hour + 1 - INDONESIA_OFFSET_HOURS, 0, 0, 0);

      // Check if slot is not booked
      const isBooked = existingBookings.some((booking) => {
        const bookingStart = new Date(booking.start_time);
        const bookingEnd = new Date(booking.end_time);

        // Convert booking times to local hours for comparison
        const bookingStartHour =
          bookingStart.getUTCHours() + INDONESIA_OFFSET_HOURS;
        const bookingEndHour =
          bookingEnd.getUTCHours() + INDONESIA_OFFSET_HOURS;

        return hour >= bookingStartHour && hour < bookingEndHour;
      });

      if (!isBooked) {
        availableSlots.push({
          start_time: slotStart.toISOString(),
          end_time: slotEnd.toISOString(),
        });
      }
    }

    res.json({
      success: true,
      data: availableSlots,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching available slots",
      error: error instanceof Error ? error.message : error,
    });
  }
};
