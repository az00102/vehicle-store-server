import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { error } from "console";

// Create Vehicle
const createVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Vehicle creation failed",
            errors: error.message
        });
    }
}

// Get All Vehicles
const getAllVehicle = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getAllVehicle();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result
        });
    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Could not retrive vehicle",
            errors: error.message
        });
    }
}

// Get Vehicle by ID
const getVehicleWithId = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID");
        };

        const vehicle = await vehicleServices.getVehicleWithId(id);

        if (!vehicle) {
            throw new Error("Vehicle not found")
        };

        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle
        });

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Could not retrive vehicle",
            errors: error.message
        });
    }
}

// Update Vehicle
const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID");
        }

        const updated_vehicle = await vehicleServices.updateVehicle(id, req.body);

        if (!updated_vehicle) {
            throw new Error("Vehicle not found")
        }

        // console.log(updated_vehicle)

        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updated_vehicle
        })

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Could not update vehicle",
            errors: error.message
        });
    }
}

// Delete vehicle
const deleteVehicle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID")
        };

        const deleted_vehicle = await vehicleServices.deleteVehicle(id);

        if (!deleted_vehicle) {
            throw new Error("Vehicle not found")
        };

        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: deleted_vehicle
        })

    } catch (error: any) {
        res.status(404).json({
            success: false,
            message: "Could not delete vehicle",
            errors: error.message
        });
    }
}

export const vehicleControllers = {
    createVehicle,
    getAllVehicle,
    getVehicleWithId,
    updateVehicle,
    deleteVehicle
}