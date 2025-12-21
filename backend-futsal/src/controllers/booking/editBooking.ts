import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

/**
 * Update/reschedule a booking
 * Users can modify their own pending/confirmed bookings
 */
export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { field_id, booking_date, start_time, end_time, duration } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = verifyToken(token);
    const customerId = decoded.id;

    // Find booking and verify ownership
    const existingBooking = await prisma.bookings.findFirst({
      where: {
        id: parseInt(id),
        customer_id: Number(customerId),
      },
      include: { field: true },
    });

    if (!existingBooking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found or unauthorized",
      });
    }

    // Validate booking status
    if (
      existingBooking.status === "cancelled" ||
      existingBooking.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message: `Cannot modify ${existingBooking.status} booking`,
      });
    }

    // Use new values or existing values if not provided
    const newFieldId = field_id ? parseInt(field_id) : existingBooking.field_id;
    const newBookingDate = booking_date
      ? new Date(booking_date)
      : existingBooking.booking_date;
    const newStartTime = start_time
      ? new Date(start_time)
      : existingBooking.start_time;
    const newEndTime = end_time ? new Date(end_time) : existingBooking.end_time;
    const newDuration = duration
      ? parseInt(duration)
      : existingBooking.duration;

    // Check if field exists and is active
    const field = await prisma.field.findUnique({
      where: { id: newFieldId },
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    if (!field.is_active) {
      return res.status(400).json({
        success: false,
        message: "Field is not available for booking",
      });
    }

    // Calculate new total price
    const newTotalPrice = field.price_per_hour.toNumber() * newDuration;

    // Check for overlapping bookings (excluding current booking)
    const overlappingBooking = await prisma.bookings.findFirst({
      where: {
        field_id: newFieldId,
        booking_date: newBookingDate,
        id: { not: parseInt(id) },
        OR: [
          {
            start_time: { lt: newEndTime },
            end_time: { gt: newStartTime },
          },
        ],
        status: { in: ["confirmed", "pending"] },
      },
    });

    if (overlappingBooking) {
      return res.status(400).json({
        success: false,
        message: "Time slot is already booked",
      });
    }

    // Update booking
    const updatedBooking = await prisma.bookings.update({
      where: { id: parseInt(id) },
      data: {
        field_id: newFieldId,
        booking_date: newBookingDate,
        start_time: newStartTime,
        end_time: newEndTime,
        duration: newDuration,
        total_price: newTotalPrice,
      },
      include: {
        field: {
          select: {
            name: true,
            field_type: true,
            price_per_hour: true,
          },
        },
        customer: {
          select: {
            full_name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking",
      error: error instanceof Error ? error.message : error,
    });
  }
};
