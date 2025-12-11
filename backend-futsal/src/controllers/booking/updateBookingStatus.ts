import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decoded = verifyToken(String(token));

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled", "completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    // Get the booking
    const booking = await prisma.bookings.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check permission: admin can update any, customer can only cancel their own
    if (decoded.role !== "admin") {
      if (booking.customer_id !== decoded.id) {
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
      // Customer can only cancel
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "You can only cancel your booking",
        });
      }
    }

    const updatedBooking = await prisma.bookings.update({
      where: { id: parseInt(id) },
      data: { status },
      include: {
        field: {
          select: {
            name: true,
            field_type: true,
          },
        },
        customer: {
          select: {
            full_name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Booking status updated",
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
