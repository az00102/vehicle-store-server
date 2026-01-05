"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const authorizeRole_1 = __importDefault(require("../../middleware/authorizeRole"));
const booking_controller_1 = require("./booking.controller");
const router = (0, express_1.Router)();
router.post('/', auth_1.default, (0, authorizeRole_1.default)('customer', 'admin'), booking_controller_1.bookingController.createBooking);
router.get('/', auth_1.default, (0, authorizeRole_1.default)('customer', 'admin'), booking_controller_1.bookingController.getAllBookings);
router.put('/:id', auth_1.default, (0, authorizeRole_1.default)('customer', 'admin'), booking_controller_1.bookingController.updateBooking);
exports.bookingRoutes = router;
/*{
{
  "email": "john.updated@example.com",
  "password": "securePassword123"
}
{
  "email": "admin@example.com",
  "password": "admin123"
}

}*/ 
