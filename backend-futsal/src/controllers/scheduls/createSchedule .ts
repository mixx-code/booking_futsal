import { Request, Response } from "express";
import { prisma } from "../../prisma/client";
import { verifyToken } from "../../utils/jwt";

export const createSchedule = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    const decoded = verifyToken(String(token));
    const role = decoded.role;

    // Hanya admin yang bisa membuat schedule
    if (role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admin can create schedules",
      });
    }

    const {
      field_id,
      day_of_week,
      start_time, // Format: "2025-12-12 08:00:00"
      end_time, // Format: "2025-12-12 22:00:00"
      is_available = true,
    } = req.body;

    // Validasi required fields
    if (!field_id || day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({
        success: false,
        message: "field_id, day_of_week, start_time, and end_time are required",
      });
    }

    // Validasi day_of_week (0-6)
    if (day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({
        success: false,
        message: "day_of_week must be between 0 (Sunday) and 6 (Saturday)",
      });
    }

    // Parse waktu
    const startTime = new Date(start_time);
    const endTime = new Date(end_time);

    // Validasi waktu
    if (startTime >= endTime) {
      return res.status(400).json({
        success: false,
        message: "start_time must be before end_time",
      });
    }

    // Check jika field exists
    const field = await prisma.field.findUnique({
      where: { id: parseInt(field_id) },
    });

    if (!field) {
      return res.status(404).json({
        success: false,
        message: "Field not found",
      });
    }

    // Check for existing schedule pada hari yang sama
    const existingSchedule = await prisma.schedules.findFirst({
      where: {
        field_id: parseInt(field_id),
        day_of_week: parseInt(day_of_week),
      },
    });

    if (existingSchedule) {
      return res.status(400).json({
        success: false,
        message: `Schedule already exists for day ${day_of_week}`,
        data: existingSchedule,
      });
    }

    // Create schedule
    const schedule = await prisma.schedules.create({
      data: {
        field_id: parseInt(field_id),
        day_of_week: parseInt(day_of_week),
        start_time: startTime,
        end_time: endTime,
        is_available: Boolean(is_available),
      },
      include: {
        field: {
          select: {
            id: true,
            name: true,
            field_type: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Schedule created successfully",
      data: schedule,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating schedule",
      error: error instanceof Error ? error.message : error,
    });
  }
};
