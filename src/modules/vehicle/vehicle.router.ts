import { Router } from "express";
import { vehicleControllers } from "./vehicle.controller";
import authenticate from "../../middleware/auth";
import authorizeRole from "../../middleware/authorizeRole";


const router = Router();

router.post('/', authenticate, authorizeRole('admin'), vehicleControllers.createVehicle);
router.get('/', vehicleControllers.getAllVehicle);
router.get('/:id', vehicleControllers.getVehicleWithId);
router.put('/:id', authenticate, authorizeRole('admin'), vehicleControllers.updateVehicle)
router.delete('/:id', authenticate, authorizeRole('admin'), vehicleControllers.deleteVehicle)

export const vehicleRoutes = router;