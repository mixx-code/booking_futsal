import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { prisma } from "../../prisma/client";

export const getBookingSummary = async (req: Request, res: Response) => {
    try {
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
        const whereClause: any = role !== 'admin' 
            ? { customer_id: Number(customer_id) } 
            : {};

        // Get counts for different statuses
        const [totalBookings, pendingBookings, confirmedBookings, cancelledBookings, completedBookings] = 
            await Promise.all([
                prisma.bookings.count({ where: whereClause }),
                prisma.bookings.count({ where: { ...whereClause, status: 'pending' } }),
                prisma.bookings.count({ where: { ...whereClause, status: 'confirmed' } }),
                prisma.bookings.count({ where: { ...whereClause, status: 'cancelled' } }),
                prisma.bookings.count({ where: { ...whereClause, status: 'completed' } })
            ]);

        // Get total spending (only for non-cancelled bookings)
        const totalSpendingResult = await prisma.bookings.aggregate({
            where: {
                ...whereClause,
                status: {
                    in: ['confirmed', 'completed', 'pending']
                }
            },
            _sum: {
                total_price: true
            }
        });

        // Get upcoming bookings (next 7 days)
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const upcomingBookings = await prisma.bookings.count({
            where: {
                ...whereClause,
                status: {
                    in: ['pending', 'confirmed']
                },
                booking_date: {
                    gte: today,
                    lte: nextWeek
                }
            }
        });

        res.status(200).json({
            success: true,
            message: 'Booking summary retrieved successfully',
            data: {
                summary: {
                    total: totalBookings,
                    pending: pendingBookings,
                    confirmed: confirmedBookings,
                    cancelled: cancelledBookings,
                    completed: completedBookings,
                    upcoming: upcomingBookings,
                    total_spending: totalSpendingResult._sum.total_price?.toNumber() || 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking summary',
            error: error instanceof Error ? error.message : error
        });
    }
}