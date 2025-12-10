import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const getBookingById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization?.split(" ")[1];
        const decoded = verifyToken(String(token));
        const customer_id = decoded.id;
        const role = decoded.role;

        if (!customer_id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Build where clause based on role
        const whereClause: any = {
            id: parseInt(id)
        };

        // If user is not admin, only show their own booking
        if (role !== 'admin') {
            whereClause.customer_id = Number(customer_id);
        }

        const booking = await prisma.bookings.findUnique({
            where: whereClause,
            include: {
                field: {
                    select: {
                        id: true,
                        name: true,
                        field_type: true,
                        price_per_hour: true,
                        is_active: true,
                        description: true,
                        images: true
                    }
                },
                customer: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        phone: true
                    }
                }
            }
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found or unauthorized'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking details',
            error: error instanceof Error ? error.message : error
        });
    }
}