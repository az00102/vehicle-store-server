import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface SignupPayload {
    name: string,
    email: string,
    password: string,
    phone: string,
    role: 'admin' | 'customer'
}

export interface SigninPayload {
    email: string,
    password: string
}

export interface AuthRequest extends Request {
    user?: {
        id: number,
        name: string,
        email: string,
        role: string
    }
}

export interface JwtUserPayload extends JwtPayload {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface Vehicle {
    vehicle_name: string;
    type: "car" | "bike" | "van" | "SUV";
    registration_number: string;
    daily_rent_price: number;
    availability_status: "available" | "booked";
}

export interface UpdateVehiclePayload {
    vehicle_name?: string;
    type?: "car" | "bike" | "van" | "SUV";
    registration_number?: string;
    daily_rent_price?: number;
    availability_status?: "available" | "booked";
}

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    phone?: string;
    role?: "admin" | "customer";
}

export interface CreateBookingPayload {
    customer_id: number;
    vehicle_id: number;
    rent_start_date: Date;
    rent_end_date: Date;
}

export interface UpdateBookingPayload {
    status: string;
}

