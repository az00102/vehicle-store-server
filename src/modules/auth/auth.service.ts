import config from "../../config";
import { pool } from "../../config/db";
import { SigninPayload, SignupPayload } from "../../interface/interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const signupUser = async (payload: SignupPayload) => {
    const { name, email, password, phone, role } = payload;

    //Hashing password
    const hashedPassword = await bcrypt.hash(password as string, 10);

    //constraint checks
    const lower_case_email = email.toLowerCase();
    if (password.length > 5) {
        const result = await pool.query(
            `INSERT INTO Users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, lower_case_email, hashedPassword, phone, role]
        )
        return result.rows[0];
    }
    else {
        throw new Error("Password must be at least 6 characters long");
    }

};

const signinUser = async (payload: SigninPayload) => {
    const { email, password } = payload;

    const result = await pool.query(
        `SELECT * FROM Users WHERE email=$1`, [email]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found !")
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw new Error("Incorrect password!!")
    };

    const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role}, config.secret as string, { expiresIn: "1D" });

    return { token, user }
}

export const authServices = {
    signupUser,
    signinUser
}