"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorizeRole_1 = __importDefault(require("../../middleware/authorizeRole"));
const user_controller_1 = require("./user.controller");
const router = (0, express_1.Router)();
router.get("/", auth_1.default, (0, authorizeRole_1.default)('admin'), user_controller_1.userControllers.getAllUsers);
router.put("/:id", auth_1.default, (0, authorizeRole_1.default)('admin', 'customer'), user_controller_1.userControllers.updateUser);
router.delete("/:id", auth_1.default, (0, authorizeRole_1.default)('admin'), user_controller_1.userControllers.deleteUser);
exports.userRoutes = router;
