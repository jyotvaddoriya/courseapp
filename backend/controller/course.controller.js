import { Course } from '../models/course.model.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/purchase.model.js';

export const createCourse = async (req, resp) => {
    const adminId = req.adminId;
    const { title, description, price } = req.body;
    console.log(title, description, price)

    try {
        if (!title || !description || !price) {
            return resp.status(400).json({ error: 'Please fill all fields' })
        }
        const { image } = req.files
        if (!req.files || Object.keys(req.files).length === 0) {
            return resp.status(400).json({ error: 'no file uploaded' })
        }

        const allowedFormat = ["image/png", "image/jpeg"]
        if (!allowedFormat.includes(image.mimetype)) {
            return resp.status(400).json({ error: 'invalid file format only png and jpeg are allowed' })
        }

        //cloudnairy code
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)
        if (!cloud_response || cloud_response.error) {
            return resp.status(400).json({ error: 'error uploading image to cloudnairy' })
        }

        const courseData = {
            title,
            description,
            price,
            image: {
                public_id: cloud_response.public_id,
                url: cloud_response.url,
            },
            creatorId:adminId
        }

        const course = await Course.create(courseData)
        resp.json({
            message: "course created succefully",
            course
        })
    } catch (error) {
        console.log(error);
        resp.status(500).json({ errors: "error creating course" })
    }
};

export const updateCourse = async (req, resp) => {
};

export const deleteCourse = async (req, resp) => {
    const adminId = req.adminId;
    const { courseId } = req.params;

    try {
        const course = await Course.findOneAndDelete({
            _id: courseId,
            creatorId: adminId,
        });
        if (!course) {
            return resp.status(404).josn({ errors: "can not delete ,created by other admin" });
        }
        resp.status(200).json({ message: "course deleted successfully" })
    } catch (error) {
        resp.status(500).json({ errors: "Error in deleting course" });
        console.log("error in deleting", error);
    }

}

export const getCourse = async (req, resp) => {
    try {
        const courses = await Course.find({});
        resp.status(201).json({ courses });
    } catch (error) {
        resp.status(500).json({ errors: "error in fetching courses" })
        console.log("error to get courses", error)
    }
}

export const courseDetail = async (req, resp) => {
    const { courseId } = req.params;
    try {
        const course = await Course.findById(courseId);
        if (!course) {
            return resp.status(404).json({ error: "course not found" })
        }
        resp.status(200).json({ course });
    } catch (error) {
        resp.status(500).json({ errors: "course not found" });
        console.log("Error in course detal", error);
    }
}

import Stripe from 'stripe';
import  config  from '../config.js';

const stripe = new Stripe(config.STRIPE_SECRET_KEY)

console.log(config.STRIPE_SECRET_KEY)
export const buyCourses = async (req, resp) => {
    const { userId } = req;
    const { courseID } = req.params;

    try {
        const course = await Course.findById(courseID);
        if (!course) {
            return resp.status(404).json({ errors: "Course not found" });
        }
        const existingPurchase = await Purchase.findOne({ userId, courseId: courseID });
        if (existingPurchase) {
            return resp.status(400).json({ errors: "You have already purchased this course" });
        }

        //stripe payment code
        const amount=course.price;
        const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",

   payment_method_types: ["card"],
  });
        const newPurchase = new Purchase({
            userId,
            courseId: courseID
        });
        await newPurchase.save();

        resp.status(201).json({ message: "Course purchased successfully", 
            newPurchase,
            course,
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        resp.status(500).json({ errors: "Error in buying course" });
        console.error("Error in buying course", error);
     
    }
};
