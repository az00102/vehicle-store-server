"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userControllers = void 0;
const user_service_1 = require("./user.service");
// Get All Users
const getAllUsers = async (req, res) => {
    try {
        const users = await user_service_1.userServices.getAllUsers();
        if (users.length === 0) {
            throw new Error("Could not find any user data");
        }
        ;
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to retrive user data",
            errors: error.message
        });
    }
};
// Update User
const updateUser = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const current_user_id = Number(req.user?.id);
        const current_user_role = req.user?.role;
        // console.log(current_user_id, id)
        if (isNaN(id)) {
            throw new Error("Invalid user ID!");
        }
        ;
        if (current_user_role === 'customer' && id !== current_user_id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
                error: "Unauthorized!"
            });
        }
        const user = await user_service_1.userServices.updateUser(id, current_user_role, req.body);
        if (!user) {
            throw new Error("User not found!");
        }
        ;
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to update user data",
            errors: error.message
        });
    }
};
// Delete User
const deleteUser = async (req, res) => {
    try {
        const user_id = Number(req.params.id);
        const result = await user_service_1.userServices.deleteUser(user_id);
        if (!result) {
            res.status(404).json({
                success: false,
                message: "User deletion failed",
                error: "Could not find user"
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Failed to delete user data",
            errors: error.message
        });
    }
};
exports.userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
};
