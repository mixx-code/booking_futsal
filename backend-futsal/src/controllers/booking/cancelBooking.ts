import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const cancelBooking = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(String(token));
        const customer_id = decoded.id;

        if (!customer_id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Check if booking exists and belongs to user
        const existingBooking = await prisma.bookings.findFirst({
            where: {
                id: parseInt(id),
                customer_id: Number(customer_id)
            }
        });

        if (!existingBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or unauthorized'
            });
        }

        // Check if booking can be cancelled
        if (existingBooking.status === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Booking is already cancelled'
            });
        }

        if (existingBooking.status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel completed booking'
            });
        }

        // Check if the cancellation is at least 1 hour before the booking starts
        const bookingStartTime = new Date(existingBooking.start_time);
        const currentTime = new Date();
        const timeDifference = bookingStartTime.getTime() - currentTime.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference < 1) {
            return res.status(400).json({
                success: false,
                message: 'Booking cannot be cancelled less than 1 hour before start time'
            });
        }

        // Update booking status to cancelled
        const cancelledBooking = await prisma.bookings.update({
            where: {
                id: parseInt(id)
            },
            data: {
                status: 'cancelled',
                // Tidak ada updated_at field
            },
            include: {
                field: {
                    select: {
                        name: true,
                        field_type: true,
                        price_per_hour: true
                    }
                },
                customer: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: cancelledBooking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error instanceof Error ? error.message : error
        });
    }
}