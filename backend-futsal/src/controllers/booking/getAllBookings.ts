import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const getAllBookings = async (req: Request, res: Response) => {
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

        // Parse query parameters
        const {
            page = 1,
            limit = 10,
            status,
            field_id,
            start_date,
            end_date,
            sort_by = 'created_at',
            sort_order = 'desc'
        } = req.query;

        const pageNum = Math.max(1, parseInt(page as string));
        const limitNum = Math.max(1, Math.min(100, parseInt(limit as string)));
        const offset = (pageNum - 1) * limitNum;

        // Build where clause based on user role
        const whereClause: any = {};

        // If user is not admin, only show their own bookings
        if (role !== 'admin') {
            whereClause.customer_id = Number(customer_id);
        }

        // Apply filters if provided
        if (status) {
            whereClause.status = status;
        }

        if (field_id) {
            whereClause.field_id = parseInt(field_id as string);
        }

        if (start_date && end_date) {
            whereClause.booking_date = {
                gte: new Date(start_date as string),
                lte: new Date(end_date as string)
            };
        } else if (start_date) {
            whereClause.booking_date = {
                gte: new Date(start_date as string)
            };
        } else if (end_date) {
            whereClause.booking_date = {
                lte: new Date(end_date as string)
            };
        }

        // Validate sort parameters
        const validSortFields = [
            'created_at', 
            'booking_date', 
            'start_time', 
            'end_time',
            'total_price',
            'duration'
        ];
        
        const validSortOrders = ['asc', 'desc'];
        
        const sortField = validSortFields.includes(sort_by as string) 
            ? sort_by as string 
            : 'created_at';
            
        const sortOrder = validSortOrders.includes(sort_order as string)
            ? sort_order as string
            : 'desc';

        // Get total count for pagination
        const totalBookings = await prisma.bookings.count({
            where: whereClause
        });

        // Get bookings with pagination
        const bookings = await prisma.bookings.findMany({
            where: whereClause,
            include: {
                field: {
                    select: {
                        id: true,
                        name: true,
                        field_type: true,
                        price_per_hour: true,
                        is_active: true
                    }
                },
                customer: role === 'admin' ? {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        phone: true
                    }
                } : false
            },
            orderBy: {
                [sortField]: sortOrder
            },
            skip: offset,
            take: limitNum
        });

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalBookings / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPrevPage = pageNum > 1;

        res.status(200).json({
            success: true,
            message: role === 'admin' 
                ? 'All bookings retrieved successfully' 
                : 'Your bookings retrieved successfully',
            data: {
                bookings,
                pagination: {
                    current_page: pageNum,
                    total_pages: totalPages,
                    total_items: totalBookings,
                    items_per_page: limitNum,
                    has_next_page: hasNextPage,
                    has_prev_page: hasPrevPage,
                    next_page: hasNextPage ? pageNum + 1 : null,
                    prev_page: hasPrevPage ? pageNum - 1 : null
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error instanceof Error ? error.message : error
        });
    }
}