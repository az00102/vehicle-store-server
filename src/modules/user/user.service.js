"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userServices = void 0;
const db_1 = require("../../config/db");
// get all users
const getAllUsers = async () => {
    const result = await db_1.pool.query(`SELECT  
        id,
        name,
        email,
        phone,
        role
        FROM Users;
        `);
    return result.rows;
};
// update User 
const updateUser = async (id, current_user_role, user) => {
    const { name, email, phone, role } = user;
    if (current_user_role === 'admin') {
        const result = await db_1.pool.query(`
        UPDATE Users
        SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone),
            role = COALESCE($4, role)
        WHERE id = $5
        RETURNING id, name, email, phone, role
        `, [
            name ?? null,
            email ?? null,
            phone ?? null,
            role ?? null,
            id
        ]);
        return result.rows[0] || null;
    }
    if (current_user_role === 'customer') {
        const result = await db_1.pool.query(`
        UPDATE Users
         SET 
            name = COALESCE($1, name),
            email = COALESCE($2, email),
            phone = COALESCE($3, phone)
        WHERE id = $4
        RETURNING id, name, email, phone, role
        `, [
            name ?? null,
            email ?? null,
            phone ?? null,
            id
        ]);
        return result.rows[0] || null;
    }
};
// delete user
const deleteUser = async (payload) => {
    const active_booking_check = await db_1.pool.query(`
        SELECT status
        FROM bookings
        WHERE customer_id = $1
            AND status = 'active'
        `, [payload]);
    if (active_booking_check.rows.length > 0) {
        throw new Error('User can not be deleted. They have an active booking status');
    }
    const result = await db_1.pool.query(`
         DELETE FROM users
         WHERE id = $1 
         RETURNING 
            id,
            name, 
            email, 
            phone, 
            role
        `, [payload]);
    return result.rows[0] || null;
};
exports.userServices = {
    getAllUsers,
    updateUser,
    deleteUser
};
