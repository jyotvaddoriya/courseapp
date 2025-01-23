import { Admin } from "../models/admin.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import config from '../config.js';


export const signup = async (req, resp) => {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //serverside validation using zod
    const adminSchema = z.object({
        firstName: z.string().min(2, { message: "firstName must 2char long" }),
        lastName: z.string().min(2, { message: "lastName must 2char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must 6char long" })
    })

    const validatData = adminSchema.safeParse(req.body);
    if (!validatData.success) {
        return resp.status(400).json({
            error: validatData.error.issues.map(err => err.message)
        });
    }

    try {
        const existingAdmin = await Admin.findOne({ email: email });
        if (existingAdmin) {
            return resp.status(400).json({ errors: "Admin aleradey exists" })
        }
        const newAdmin = new Admin({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await newAdmin.save();
        resp.status(201).json({ message: "signup succssedd", newAdmin });
    } catch (error) {
        resp.status(500).json({ errors: "error in" });
        console.log("error in sign up", error);
    }
};

export const login = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, admin.password);
        if (!admin || !isPasswordCorrect) {
            return resp.status(403).json({ errors: "invalid email or password" });
        }

        //jwt token code
        const token = jwt.sign(
            { id: admin._id },
            config.JWT_ADMIN_PASSWORD,
            { expiresIn: "1d" }
        );
        
        const cookieOption={
            expires : new Date(Date.now() +  24 * 60 * 60 * 1000),//1day
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite:"Strict"
        }
        resp.cookie("jwt", token,cookieOption)
        resp.status(201).json({ message: "login succesfull", admin, token });
    } catch (error) {
        resp.status(500).json({ errors: "error in login" });
        console.log("error in login", error);
    }
};

export const logout = async (req, resp) => {
    try {
        if(!req.cookies.jwt){
            return resp.status(401).json({ errors: "kindly login in first" });
        }
        resp.clearCookie("jwt");
        resp.status(200).json({ message: " logout succesfull" });
    } catch (error) {
        resp.status(500).json({ errors: "error in logout" })
        console.log("erron in logout", error)
    }
};