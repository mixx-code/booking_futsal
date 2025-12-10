import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const { id } = verifyToken(String(token));

    const bookings = await prisma.bookings.findMany({
      where: {
        customer_id: Number(id),
      },
      include: {
        field: {
          select: {
            id: true,
            name: true,
            field_type: true,
            price_per_hour: true,
            images: true,
          },
        },
      },
      orderBy: {
        booking_date: "desc",
      },
    });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error instanceof Error ? error.message : error,
    });
  }
};
