"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleControllers = void 0;
const vehicle_service_1 = require("./vehicle.service");
// Create Vehicle
const createVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.createVehicle(req.body);
        res.status(201).json({
            success: true,
            message: "Vehicle created successfully",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: "Vehicle creation failed",
            errors: error.message
        });
    }
};
// Get All Vehicles
const getAllVehicle = async (req, res) => {
    try {
        const result = await vehicle_service_1.vehicleServices.getAllVehicle();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not retrive vehicle",
            errors: error.message
        });
    }
};
// Get Vehicle by ID
const getVehicleWithId = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID");
        }
        ;
        const vehicle = await vehicle_service_1.vehicleServices.getVehicleWithId(id);
        if (!vehicle) {
            throw new Error("Vehicle not found");
        }
        ;
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: vehicle
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not retrive vehicle",
            errors: error.message
        });
    }
};
// Update Vehicle
const updateVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID");
        }
        const updated_vehicle = await vehicle_service_1.vehicleServices.updateVehicle(id, req.body);
        if (!updated_vehicle) {
            throw new Error("Vehicle not found");
        }
        // console.log(updated_vehicle)
        res.status(200).json({
            success: true,
            message: "Vehicle updated successfully",
            data: updated_vehicle
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not update vehicle",
            errors: error.message
        });
    }
};
// Delete vehicle
const deleteVehicle = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            throw new Error("Invalid vehicle ID");
        }
        ;
        const deleted_vehicle = await vehicle_service_1.vehicleServices.deleteVehicle(id);
        if (!deleted_vehicle) {
            throw new Error("Vehicle not found");
        }
        ;
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully",
            data: deleted_vehicle
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: "Could not delete vehicle",
            errors: error.message
        });
    }
};
exports.vehicleControllers = {
    createVehicle,
    getAllVehicle,
    getVehicleWithId,
    updateVehicle,
    deleteVehicle
};
