import { Request, Response } from "express";
import { hashPassword } from "../../utils/bcrypt";
import { signToken } from "../../utils/jwt";
import { prisma } from "../../prisma/client";

export const register = async (req: Request, res: Response) => {
    const { email, full_name, password, phone, role } = req.body

    const passwordHash = await hashPassword(password)

    const createUser = await prisma.users.create({
        data: {
            email,
            full_name,
            password: passwordHash,
            phone,
            role: role || "customer"
        }
    })

    const token = signToken({
        id: createUser.id,
        email: createUser.email,
        role: createUser.role
    })

    return res.status(201).json({
        "code": 200,
        "status": "success",
        message: "Registrasi berhasil. Akun berhasil dibuat.",
        data: {
            user_id: createUser.id,
            full_name: createUser.password,
            email: createUser.email,
            phone: createUser.phone,
            role: createUser.role
        },
        token: token
    })
}