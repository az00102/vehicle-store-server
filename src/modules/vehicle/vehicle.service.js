"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vehicleServices = void 0;
const db_1 = require("../../config/db");
// Create Vehicle
const createVehicle = async (payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    const result = await db_1.pool.query(`INSERT INTO Vehicles(vehicle_name, 
            type, 
            registration_number, 
            daily_rent_price,
            availability_status)
        VALUES($1, $2, $3, $4, $5) RETURNING *`, [vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status
    ]);
    return result.rows[0];
};
// Get All Vehicles
const getAllVehicle = async () => {
    // console.log("retriving...")
    const result = await db_1.pool.query(`SELECT id, 
        vehicle_name, 
        type,
        registration_number,
        daily_rent_price,
        availability_status
        FROM Vehicles`);
    // console.log("retrived!")
    return result.rows;
};
// Get Vehicle by ID
const getVehicleWithId = async (payload) => {
    // console.log("retriving...")
    const result = await db_1.pool.query(`SELECT id,
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status FROM Vehicles WHERE id = $1`, [payload]);
    // console.log("retrived!")
    return result.rows[0] || null;
};
// Update Vehicle
const updateVehicle = async (id, payload) => {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = payload;
    console.log("updating...");
    const result = await db_1.pool.query(`UPDATE Vehicles
         SET 
            vehicle_name = COALESCE($1, vehicle_name),
            type = COALESCE($2, type),
            registration_number = COALESCE($3, registration_number),
            daily_rent_price = COALESCE($4, daily_rent_price),
            availability_status = COALESCE($5, availability_status)
        WHERE id = $6
        RETURNING *;
        `, [
        vehicle_name ?? null,
        type ?? null,
        registration_number ?? null,
        daily_rent_price ?? null,
        availability_status ?? null,
        id
    ]);
    console.log("updated!");
    return result.rows[0] || null;
};
// Delete vehicle
const deleteVehicle = async (payload) => {
    const active_booking_check = await db_1.pool.query(`
        SELECT status
        FROM bookings
        WHERE vehicle_id = $1
            AND status = 'active'
        `, [payload]);
    if (active_booking_check.rows.length > 0) {
        throw new Error('Vehicle can not be deleted. It has an active booking status');
    }
    const result = await db_1.pool.query(`DELETE FROM Vehicles WHERE id = $1 RETURNING *`, [payload]);
    return result.rows[0] || null;
};
exports.vehicleServices = {
    createVehicle,
    getAllVehicle,
    getVehicleWithId,
    updateVehicle,
    deleteVehicle
};
