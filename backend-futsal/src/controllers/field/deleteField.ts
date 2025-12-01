import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { prisma } from "../../prisma/client";


export const deleteField = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const token = req.headers.authorization?.split(" ")[1];
        const { role } = verifyToken(String(token));

        // Check if user is admin
        if (role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Only admin can create fields'
            });
        }


        await prisma.field.delete({
            where: { id: parseInt(id) }
        });

        res.json({
            success: true,
            message: 'Field deleted successfully'
        });
    } catch (error) {
        if (error instanceof Error && error.message.includes('Record to delete not found')) {
            return res.status(404).json({
                success: false,
                message: 'Field not found'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error deleting field',
            error: error instanceof Error ? error.message : error
        });
    }
}