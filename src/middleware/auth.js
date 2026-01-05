"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.secret);
        req.user = decoded;
        console.log(req.user);
        next();
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: "Auhtentication Failed",
            error: error.message
        });
    }
};
exports.default = authenticate;
