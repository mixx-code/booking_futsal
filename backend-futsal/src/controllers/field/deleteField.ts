import { Request, Response } from "express";
import { verifyToken } from "../../utils/jwt";
import { prisma } from "../../prisma/client";

export const deleteField = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fieldId = parseInt(id);

    const token = req.headers.authorization?.split(" ")[1];
    const { role } = verifyToken(String(token));

    // Check if user is admin
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can delete fields",
      });
    }

    // Check if field exists
    const field = await prisma.field.findUnique({
      where: { id: fieldId },
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    // Delete related records first (in correct order due to foreign key constraints)
    // 1. Delete bookings
    await prisma.bookings.deleteMany({
      where: { field_id: fieldId },
    });

    // 2. Delete schedules
    await prisma.schedules.deleteMany({
      where: { field_id: fieldId },
    });

    // 3. Finally delete the field (images are stored as JSON in field table)
    await prisma.field.delete({
      where: { id: fieldId },
    });

    res.json({
      success: true,
      message: "Field deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting field:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting field",
      error: error instanceof Error ? error.message : error,
    });
  }
};
