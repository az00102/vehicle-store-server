import { NextFunction, Response } from "express";
import { AuthRequest, JwtUserPayload } from "../interface/interface";
import jwt from "jsonwebtoken";
import config from "../config";

const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Authentication Required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Authentication token missing"
        });
    }

    try {
        const decoded = jwt.verify(token, config.secret as string) as JwtUserPayload;
        req.user = decoded;
        console.log(req.user)
        next();
    } catch (error: any) {
        return res.status(401).json({
            success: false,
            message: "Auhtentication Failed",
            error: error.message
        })
    }
}

export default authenticate;