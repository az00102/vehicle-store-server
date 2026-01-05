import express, { Request, Response } from "express";
// import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.router";
import { vehicleRoutes } from "./modules/vehicle/vehicle.router";
import { userRoutes } from "./modules/user/user.router";
import { bookingRoutes } from "./modules/booking/booking.router";

const app = express();
// const port = config.port;

//parser
app.use(express.json());

let dbReady: Promise<void> | null = null;

async function ensureDB() {
    if (!dbReady) dbReady = initDB(); 
    await dbReady;
}

export default async function handler(req: any, res: any) {
    try {
        await ensureDB();
        return app(req, res);
    } catch (err) {
        console.error("Startup/DB error:", err);
        return res.status(500).json({ ok: false, message: "Server crashed on startup" });
    }
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bookings", bookingRoutes)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ ok: true, message: "API is running" });
});



// app.listen(() => {
//     console.log(`App is running`)
// });