"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleRoutes = void 0;
const express_1 = require("express");
const vehicle_controller_1 = require("./vehicle.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorizeRole_1 = __importDefault(require("../../middleware/authorizeRole"));
const router = (0, express_1.Router)();
router.post('/', auth_1.default, (0, authorizeRole_1.default)('admin'), vehicle_controller_1.vehicleControllers.createVehicle);
router.get('/', vehicle_controller_1.vehicleControllers.getAllVehicle);
router.get('/:id', vehicle_controller_1.vehicleControllers.getVehicleWithId);
router.put('/:id', auth_1.default, (0, authorizeRole_1.default)('admin'), vehicle_controller_1.vehicleControllers.updateVehicle);
router.delete('/:id', auth_1.default, (0, authorizeRole_1.default)('admin'), vehicle_controller_1.vehicleControllers.deleteVehicle);
exports.vehicleRoutes = router;
