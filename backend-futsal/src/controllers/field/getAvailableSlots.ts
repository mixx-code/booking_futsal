import { Request, Response } from "express";
import { prisma } from "../../prisma/client";

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { date } = req.query; // Format: YYYY-MM-DD

        if (!date) {
            return res.status(400).json({
                success: false,
                message: 'Date parameter is required'
            });
        }

        const selectedDate = new Date(date as string);
        const dayOfWeek = selectedDate.getDay(); // 0-6, 0=Minggu

        // Get field schedule for the day
        const fieldSchedule = await prisma.schedules.findFirst({
            where: {
                field_id: parseInt(id),
                day_of_week: dayOfWeek,
                is_available: true
            }
        });

        if (!fieldSchedule) {
            return res.json({
                success: true,
                data: [],
                message: 'Field is not available on this day'
            });
        }

        // Get existing bookings for the date
        const existingBookings = await prisma.bookings.findMany({
            where: {
                field_id: parseInt(id),
                booking_date: {
                    gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
                    lt: new Date(selectedDate.setHours(23, 59, 59, 999))
                },
                status: {
                    in: ['confirmed', 'pending']
                }
            },
            select: {
                start_time: true,
                end_time: true
            }
        });

        // Generate available time slots (1 hour intervals)
        const availableSlots = [];
        const startTime = new Date(fieldSchedule.start_time);
        const endTime = new Date(fieldSchedule.end_time);

        let currentTime = new Date(startTime);

        while (currentTime < endTime) {
            const slotStart = new Date(currentTime);
            const slotEnd = new Date(currentTime.getTime() + 60 * 60 * 1000); // +1 hour

            // Check if slot is not booked
            const isBooked = existingBookings.some(booking => {
                const bookingStart = new Date(booking.start_time);
                const bookingEnd = new Date(booking.end_time);
                return slotStart < bookingEnd && slotEnd > bookingStart;
            });

            if (!isBooked && slotEnd <= endTime) {
                availableSlots.push({
                    start_time: new Date(slotStart),
                    end_time: new Date(slotEnd)
                });
            }

            currentTime.setHours(currentTime.getHours() + 1);
        }

        res.json({
            success: true,
            data: availableSlots
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching available slots',
            error: error instanceof Error ? error.message : error
        });
    }
}