import express from 'express';
import userMiddleware from '../middlewares/user.mid.js';
import adminMiddleware from '../middlewares/admin.mid.js';
import {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    courseDetail,
    buyCourses
} from '../controller/course.controller.js';



const router = express.Router();

router.post("/create",adminMiddleware ,createCourse)
router.put("/update/:courseId",adminMiddleware , updateCourse)
router.delete("/delete/:courseId",adminMiddleware , deleteCourse);
router.get("/courses", getCourse);
router.get("/:courseId", courseDetail)

router.post("/buy/:courseID", userMiddleware, buyCourses);

export default router;