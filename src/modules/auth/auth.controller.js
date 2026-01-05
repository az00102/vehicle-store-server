"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const auth_service_1 = require("./auth.service");
const signupUser = async (req, res) => {
    try {
        const result = await auth_service_1.authServices.signupUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "SignUp failed",
            errors: error.message
        });
    }
};
const signinUser = async (req, res) => {
    try {
        const result = await auth_service_1.authServices.signinUser(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "SignIn failed",
            errors: error.message
        });
    }
};
exports.authControllers = {
    signupUser,
    signinUser
};
