import { Request, Response } from "express";
import { userServices } from "./user.service";
import { AuthRequest } from "../../interface/interface";

// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await userServices.getAllUsers();

        if (users.length === 0) {
            throw new Error("Could not find any user data")
        };

        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: users
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Failed to retrive user data",
            errors: error.message
        });
    }
}

// Update User
const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const id = Number(req.params.id);
        const current_user_id = Number(req.user?.id);
        const current_user_role = req.user?.role;

        // console.log(current_user_id, id)

        if (isNaN(id)) {
            throw new Error("Invalid user ID!")
        };

        if (current_user_role === 'customer' && id !== current_user_id) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: insufficient permissions",
                error: "Unauthorized!"
            })
        }

        const user = await userServices.updateUser(id, current_user_role as string, req.body);

        if (!user) {
            throw new Error("User not found!")
        };

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        })

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Failed to update user data",
            errors: error.message
        });
    }
}


// Delete User
const deleteUser = async (req: Request, res: Response) => {
    try {
        const user_id = Number(req.params.id);
        const result = await userServices.deleteUser(user_id);

        if(!result){
            res.status(404).json({
                success: false,
                message: "User deletion failed",
                error: "Could not find user"
            })
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Failed to delete user data",
            errors: error.message
        });
    }
}


export const userControllers = {
    getAllUsers,
    updateUser,
    deleteUser
}
