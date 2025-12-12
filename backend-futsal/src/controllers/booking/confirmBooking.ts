import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

/**
 * Confirm a booking (admin only)
 * Admin can confirm pending bookings
 */
export const confirmBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = verifyToken(token);

    // Only admin can confirm bookings
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can confirm bookings",
      });
    }

    // Find booking
    const booking = await prisma.bookings.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only pending bookings can be confirmed
    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be confirmed",
      });
    }

    // Confirm the booking
    const confirmedBooking = await prisma.bookings.update({
      where: { id: parseInt(id) },
      data: { status: "confirmed" },
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
      message: "Booking confirmed successfully",
      data: confirmedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error confirming booking",
      error: error instanceof Error ? error.message : error,
    });
  }
};
