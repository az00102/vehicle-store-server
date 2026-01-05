import { NextFunction, Request, Response } from "express"
import { AuthRequest } from "../interface/interface"

const authorizeRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "Unauthorized User Role!"
            })
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
                error: "Unauthorized!"
            })
        }

        next();
    }
}

export default authorizeRole;