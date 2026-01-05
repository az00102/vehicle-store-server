import { Router } from "express";
import authenticate from "../../middleware/auth";
import authorizeRole from "../../middleware/authorizeRole";
import { bookingController } from "./booking.controller";

const router = Router();

router.post('/', authenticate, authorizeRole('customer', 'admin'), bookingController.createBooking);
router.get('/', authenticate, authorizeRole('customer', 'admin'), bookingController.getAllBookings);
router.put('/:id', authenticate, authorizeRole('customer', 'admin'), bookingController.updateBooking)

export const bookingRoutes = router;


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