"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                error: "Unauthorized User Role!"
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
                error: "Unauthorized!"
            });
        }
        next();
    };
};
exports.default = authorizeRole;
