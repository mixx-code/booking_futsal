import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";


export const createBooking = async (req: Request, res: Response) => {
    try {
        const {
            field_id,
            booking_date,
            start_time,
            end_time,
            duration
        } = req.body;

        const token = req.headers.authorization?.split(" ")[1];
        const { id } = verifyToken(String(token));
        const customer_id = id;

        if (!customer_id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        // Validate required fields
        if (!field_id || !booking_date || !start_time || !end_time || !duration) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if field exists and get price
        const field = await prisma.field.findUnique({
            where: { id: parseInt(field_id) }
        });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        if (!field.is_active) {
            return res.status(400).json({
                success: false,
                message: 'Field is not available for booking'
            });
        }

        // Calculate total price
        const total_price = field.price_per_hour.toNumber() * parseInt(duration);

        // Check for overlapping bookings
        const overlappingBooking = await prisma.bookings.findFirst({
            where: {
                field_id: parseInt(field_id),
                booking_date: new Date(booking_date),
                OR: [
                    {
                        start_time: {
                            lt: new Date(end_time)
                        },
                        end_time: {
                            gt: new Date(start_time)
                        }
                    }
                ],
                status: {
                    in: ['confirmed', 'pending']
                }
            }
        });

        if (overlappingBooking) {
            return res.status(400).json({
                success: false,
                message: 'Time slot is already booked'
            });
        }

        // Create booking
        const booking = await prisma.bookings.create({
            data: {
                customer_id: Number(customer_id),
                field_id: parseInt(field_id),
                booking_date: new Date(booking_date),
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                duration: parseInt(duration),
                total_price
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

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error instanceof Error ? error.message : error
        });
    }
}