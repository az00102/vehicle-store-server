import { Request, Response } from "express";
import { bookingServices } from "./booking.service";
import { AuthRequest } from "../../interface/interface";

const createBooking = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.createBooking(req.body);

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result
        })

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Booking creation failed!",
            error: error.message
        })
    }
}

// Get All Bookings
const getAllBookings = async (req: AuthRequest, res: Response) => {
    try {

        // current user info
        const current_user_id = Number(req.user?.id);
        const current_user_role = req.user?.role;
        const booking_data = await bookingServices.getAllBookings(current_user_id, current_user_role as string);

        // console.log(booking_data)

        if (!booking_data || booking_data.length === 0) {
            throw new Error("Sorry, you do not have any bookings at this moment.")
        }

        if (current_user_role === 'admin') {
            res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: booking_data
            })
        }

        if (current_user_role === 'customer') {
            res.status(200).json({
                success: true,
                message: "Your bookings retrieved successfully",
                data: booking_data
            })
        }

    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to retrive booking data!",
            error: error.message
        })
    }
}

//update booking
const updateBooking = async (req: AuthRequest, res: Response) => {
    const current_user_role = req.user?.role;
    const current_user_id = req.user?.id
    const booking_id = Number(req.params.id)

    console.log(req.body)
    try {
        const result = await bookingServices.updateBooking(req.body, current_user_role as string, booking_id, current_user_id as number);

        if(!result || result.length === 0){
            throw new Error("Booking update failed !")
        }

        if (current_user_role === 'admin') {
            res.status(200).json({
                success: true,
                message: "Booking marked as returned. Vehicle is now available",
                data: result
            })
        }

        if (current_user_role === 'customer') {
            res.status(200).json({
                success: true,
                message: "Booking cancelled successfully",
                data: result
            })
        }
    } catch (error: any) {
        res.status(400).json({
            success: false,
            message: "Failed to update booking data!",
            error: error.message
        })
    }
}

export const bookingController = {
    createBooking,
    getAllBookings,
    updateBooking
}