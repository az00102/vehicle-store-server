import { pool } from "../../config/db";
import { AuthRequest, CreateBookingPayload, UpdateBookingPayload } from "../../interface/interface"

//auto-return
const autoReturnExpiredBooking = async () => {
    //update the booking
    await pool.query(
        `
        UPDATE bookings
        SET status = 'returned'
        WHERE status = 'active'
        AND rent_end_date < CURRENT_DATE;
        `
    )

    //update the vehicles
    await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'available'
        WHERE id IN (
            SELECT vehicle_id
            FROM bookings
            WHERE status = 'returned'
        )
        `
    )
}

// Create Booking
const createBooking = async (payload: CreateBookingPayload) => {
    const {
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date
    } = payload;

    //get vehicle 
    const vehicleResult = await pool.query(
        `
        SELECT vehicle_name, 
        daily_rent_price,
        availability_status
        FROM vehicles
        WHERE id = $1
        `,
        [vehicle_id]
    )

    if (vehicleResult.rowCount === 0) {
        throw new Error('Vehicle not found!');
    }

    const vehicle = vehicleResult.rows[0];

    if (vehicle.availability_status !== 'available') {
        throw new Error("Vehicle not available at this time.");
    }

    //Calculate total price
    const start = new Date(rent_start_date);
    const end = new Date(rent_end_date);
    const milisec_per_day = 1000 * 60 * 60 * 24;

    const rent_duration = Math.ceil(
        (end.getTime() - start.getTime()) / milisec_per_day
    );

    if (rent_duration === 0) {
        throw new Error('Invalid rental date range');
    }

    const total_price = rent_duration * Number(vehicle.daily_rent_price);

    // insert booking
    const bookingResult = await pool.query(
        `
        INSERT INTO bookings(
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price,
            status
            )
        VALUES($1, $2, $3, $4, $5, 'active') RETURNING *
        `,
        [
            customer_id,
            vehicle_id,
            rent_start_date,
            rent_end_date,
            total_price
        ]
    )

    // update vehicle status
    await pool.query(
        `
        UPDATE vehicles
        SET availability_status = 'booked'
        WHERE id = $1
        `,
        [vehicle_id]
    );

    const booking = bookingResult.rows[0];

    return {
        id: booking.id,
        customer_id: booking.customer_id,
        vehicle_id: booking.vehicle_id,
        rent_start_date: booking.rent_start_date.toISOString().split("T")[0],
        rent_end_date: booking.rent_end_date.toISOString().split("T")[0],
        total_price: booking.total_price,
        status: booking.status,
        vehicle: {
            vehicle_name: vehicle.vehicle_name,
            daily_rent_price: vehicle.daily_rent_price
        }
    }
}

// Get All Bookings
const getAllBookings = async (current_user_id: number, current_user_role: string) => {
    await autoReturnExpiredBooking();

    // admin view
    if (current_user_role === 'admin') {
        const result = await pool.query(
            `
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,

            u.name as customer_name,
            u.email as customer_email,

            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        `
        );

        return result.rows.map(row => ({
            id: row.id,
            customer_id: row.customer_id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            customer: {
                name: row.customer_name,
                email: row.customer_email
            },
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number
            }
        }))
    }

    //customer view
    if (current_user_role === 'customer') {
        const result = await pool.query(
            `
        SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,

            u.name as customer_name,
            u.email as customer_email,

            v.vehicle_name,
            v.registration_number,
            v.type
        FROM bookings b
        JOIN users u ON b.customer_id = u.id
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.customer_id = $1
        `,
            [current_user_id]
        );

        return result.rows.map(row => ({
            id: row.id,
            vehicle_id: row.vehicle_id,
            rent_start_date: row.rent_start_date,
            rent_end_date: row.rent_end_date,
            total_price: row.total_price,
            status: row.status,
            vehicle: {
                vehicle_name: row.vehicle_name,
                registration_number: row.registration_number,
                type: row.type
            }
        }));
    }
}

//update booking
const updateBooking = async (payload: UpdateBookingPayload, current_user_role: string, booking_id: number, current_user_id: number) => {

    const { status } = payload;

    // customer process
    if (current_user_role === 'customer') {
        if (status !== "cancelled") {
            throw new Error("Customers can only cancel bookings");
        }

        const result = await pool.query(
            `
            UPDATE bookings
            SET status = $1
            WHERE id = $2
                AND customer_id = $3
                AND status = 'active'
            RETURNING *
            `,
            [status, booking_id, current_user_id]
        )

        if (result.rowCount === 0) {
            throw new Error('Booking not found or can not be updated');
        }

        const vehicle_id = result.rows[0].vehicle_id;

        await pool.query(
            `
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = $1
            `,
            [vehicle_id]
        )

        return result.rows[0]
    }

    // admin process
    if (current_user_role === 'admin') {
        if (status !== "returned") {
            throw new Error("Customers can only return bookings");
        }

        const result = await pool.query(
            `UPDATE bookings
            SET status = $1
            WHERE id = $2
                AND status = 'active'
            RETURNING vehicle_id
            `,
            [status, booking_id]
        )


        if (result.rowCount === 0) {
            throw new Error("Booking not found or already returned/cancelled");
        }

        const vehicle_id = await result.rows[0].vehicle_id;

        await pool.query(
            `
            UPDATE vehicles
            SET availability_status = 'available'
            WHERE id = $1
            `,
            [vehicle_id]
        )

        const updatedResult = await pool.query(
            `
         SELECT 
            b.id,
            b.customer_id,
            b.vehicle_id,
            b.rent_start_date,
            b.rent_end_date,
            b.total_price,
            b.status,

            v.availability_status

        FROM bookings b
        JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.id = $1
        `,
            [booking_id]

        )

        const data = updatedResult.rows[0]

        return {
            id: data.id,
            customer_id: data.customer_id,
            vehicle_id: data.vehicle_id,
            rent_start_date: data.rent_start_date.toISOString().split("T")[0],
            rent_end_date: data.rent_end_date.toISOString().split("T")[0],
            total_price: data.total_price,
            status: data.status,
            vehicle: {
                availability_status: data.availability_status
            }
        }
    }
}


export const bookingServices = {
    createBooking,
    getAllBookings,
    updateBooking
}