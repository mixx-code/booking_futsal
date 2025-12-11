import { Request, Response } from "express";
import { signToken } from "../../utils/jwt";
import { comparePassword } from "../../utils/bcrypt";
import { prisma } from "../../prisma/client";

export const login = async (req: Request, res: Response) => {
  console.log("LOGIN BODY:", req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cekPassword = await comparePassword(password, user.password);
    if (!cekPassword)
      return res.status(404).json({ message: "Email atau password salah" });

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token: token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
