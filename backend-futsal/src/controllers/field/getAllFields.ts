import { Request, Response } from "express";
import { prisma } from "../../prisma/client";


export const getAllFields = async (req: Request, res: Response) => {
    try {
        const fields = await prisma.field.findMany({
            where: {
                is_active: true
            },
            include: {
                schedules: true
            }
        });

        res.json({
            success: true,
            data: fields
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching fields',
            error: error instanceof Error ? error.message : error
        });
    }
}