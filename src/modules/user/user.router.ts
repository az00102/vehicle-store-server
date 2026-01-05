import { Router } from "express";
import authenticate from "../../middleware/auth";
import authorizeRole from "../../middleware/authorizeRole";
import { userControllers } from "./user.controller";

const router = Router();

router.get("/", authenticate, authorizeRole('admin'), userControllers.getAllUsers);
router.put("/:id", authenticate, authorizeRole('admin' , 'customer'), userControllers.updateUser);
router.delete("/:id", authenticate, authorizeRole('admin'), userControllers.deleteUser);

export const userRoutes = router;