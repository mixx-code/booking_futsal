import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(" ")[1]
    console.log("ini token: ", token)

    if (!token) return res.status(401).json({ message: "Unauthorized !!!" })

    try {
        const decoded = verifyToken(token);
        (res as any).user = decoded as any
        console.log(decoded)
        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token !!!" })
    }
}