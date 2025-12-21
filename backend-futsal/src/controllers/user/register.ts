import { Request, Response } from "express";
import { hashPassword } from "../../utils/bcrypt";
import { signToken } from "../../utils/jwt";
import { prisma } from "../../prisma/client";

/**
 * User registration
 * Creates new user account and returns JWT token
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { email, full_name, password, phone, role } = req.body;

    if (!email || !full_name || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, full_name, and password are required",
      });
    }

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.users.create({
      data: {
        email,
        full_name,
        password: passwordHash,
        phone,
        role: role || "customer",
      },
    });

    const token = signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil. Akun berhasil dibuat.",
      data: {
        user_id: newUser.id,
        full_name: newUser.full_name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating account",
      error: error instanceof Error ? error.message : error,
    });
  }
};
