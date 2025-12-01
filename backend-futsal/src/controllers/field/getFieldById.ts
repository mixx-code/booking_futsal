import { Request, Response } from "express";
import { prisma } from "../../prisma/client";


export const getFieldById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const field = await prisma.field.findUnique({
            where: { id: parseInt(id) },
            include: {
                schedules: true,
                bookings: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                full_name: true,
                                email: true,
                                phone: true
                            }
                        }
                    }
                }
            }
        });

        if (!field) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        res.json({
            success: true,
            data: field
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching field',
            error: error instanceof Error ? error.message : error
        });
    }
}