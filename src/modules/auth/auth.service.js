"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const config_1 = __importDefault(require("../../config"));
const db_1 = require("../../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signupUser = async (payload) => {
    const { name, email, password, phone, role } = payload;
    //Hashing password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    //constraint checks
    const lower_case_email = email.toLowerCase();
    if (password.length > 5) {
        const result = await db_1.pool.query(`INSERT INTO Users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, lower_case_email, hashedPassword, phone, role]);
        return result.rows[0];
    }
    else {
        throw new Error("Password must be at least 6 characters long");
    }
};
const signinUser = async (payload) => {
    const { email, password } = payload;
    const result = await db_1.pool.query(`SELECT * FROM Users WHERE email=$1`, [email]);
    if (result.rows.length === 0) {
        throw new Error("User not found !");
    }
    const user = result.rows[0];
    const match = await bcryptjs_1.default.compare(password, user.password);
    if (!match) {
        throw new Error("Incorrect password!!");
    }
    ;
    const token = jsonwebtoken_1.default.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, config_1.default.secret, { expiresIn: "1D" });
    return { token, user };
};
exports.authServices = {
    signupUser,
    signinUser
};
