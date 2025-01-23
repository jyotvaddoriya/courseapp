import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import config from '../config.js';
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

export const signup = async (req, resp) => {
    const { firstName, lastName, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    //serverside validation using zod
    const userSchema = z.object({
        firstName: z.string().min(2, { message: "firstName must 2char long" }),
        lastName: z.string().min(2, { message: "lastName must 2char long" }),
        email: z.string().email(),
        password: z.string().min(6, { message: "password must 6char long" })
    })

    const validatData = userSchema.safeParse(req.body);
    if (!validatData.success) {
        return resp.status(400).json({
            errors: validatData.error.issues.map((err) => err.message)
        });
    }

    try {
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return resp.status(400).json({errors: "User aleradey exists" })
        }
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        resp.status(201).json({ message: "signup succssedd", newUser });
    } catch (error) {
        resp.status(500).json({ errors: "error in signup" });
        console.log("error in sign up", error);
    }
};

export const login = async (req, resp) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!user || !isPasswordCorrect) {
            return resp.status(403).json({ errors: "invalid email or password" });
        }

        //jwt token code
        const token = jwt.sign(
            { id: user._id },
            config.JWT_USER_PASSWORD,
            { expiresIn: "1d" }
        );
        const cookieOption={
            expires : new Date(Date.now() +  24 * 60 * 60 * 1000),//1day
            httpOnly : true,
            secure : process.env.NODE_ENV === "production",
            sameSite:"Strict"
        }
        resp.cookie("jwt", token,cookieOption)
        resp.status(201).json({ message: "login succesfull", user, token });
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

export const purchases=async(req,resp) => { 
    const { id } = req.params;
    const userId=req.userId;
    try {
        const purchased=await Purchase.find({ userId:userId });

        let purchasedCourseId=[]

        for(let i = 0;i<purchased.length;i++){
            purchasedCourseId.push(purchased[i].courseId )
        }
        const courseData =await Course.find({
            _id:{$in:purchasedCourseId}
        });
        resp.status(200).json({ purchased,courseData });
    } catch (error) {
        resp.status(500).json({ errors: "error in purchases" });
        console.log("error in purchase",error);
    }
};


