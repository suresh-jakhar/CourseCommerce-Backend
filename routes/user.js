require("dotenv").config();
const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

const mongoose = require("mongoose");
const { userModel, courseModel, enrollmentModel } = require("../db/db");
const { userAuth } = require("../middleware/userAuth");

const { z } = require("zod");


const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(2),
    lastName: z.string().min(2)
});

const signinSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

const courseIdSchema = z.object({
    courseId: z.string().min(1)
});


userRouter.post("/signup", async function(req, res){

    const parsedData = signupSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedData.error.issues
        });
    }

    const { email, password, firstName, lastName } = parsedData.data;

    try{

        const existingUser = await userModel.findOne({ email });

        if(existingUser){
            return res.status(409).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        res.json({
            message: "User signed up successfully"
        });

    }catch(err){
        res.status(500).json({
            message: "Error signing up"
        });
    }

});



userRouter.post("/signin", async function(req, res){

    try{

        const parsedData = signinSchema.safeParse(req.body);

        if(!parsedData.success){
            return res.status(400).json({
                message: "Invalid input",
                errors: parsedData.error.issues
            });
        }

        const { email, password } = parsedData.data;

        const user = await userModel.findOne({ email });

        if(!user){
            return res.status(403).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if(passwordMatch){

            const token = jwt.sign(
                { userId: user._id },
                USER_JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Signin successful",
                token: token
            });

        }else{
            res.status(403).json({
                message: "Invalid password"
            });
        }

    }catch(err){
        res.status(500).json({
            message: "Signin failed"
        });
    }

});

userRouter.get("/profile", userAuth, async function(req, res){

    try{

        const user = await userModel.findById(req.userId).select("email firstName lastName");

        if(!user){
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            user
        });

    }catch(err){
        res.status(500).json({
            message: "Error fetching user profile"
        });
    }

});



userRouter.post("/course/enroll", userAuth, async function(req, res){

    const parsedData = courseIdSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedData.error.issues
        });
    }

    try{

        const userId = req.userId;
        const { courseId } = parsedData.data;

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await courseModel.findById(courseId);

        if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        }

        const alreadyEnrolled = await enrollmentModel.findOne({
            userId: userId,
            courseId: courseId
        });

        if(alreadyEnrolled){
            return res.json({
                message: "Already enrolled in this course",
                alreadyEnrolled: true
            });
        }

        if(course.isFree){
            await enrollmentModel.create({
                userId: userId,
                courseId: courseId
            });

            return res.json({
                message: "Enrolled in free course successfully"
            });
        }

        res.json({
            message: "This is a paid course, proceed to purchase",
            courseId: course._id,
            price: course.price,
            paymentRequired: true
        });

    }catch(err){
        res.status(500).json({
            message: "Error enrolling in course"
        });
    }

});



userRouter.post("/course/purchase", userAuth, async function(req, res){

    const parsedData = courseIdSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedData.error.issues
        });
    }

    try{

        const userId = req.userId;
        const { courseId } = parsedData.data;

        if(!mongoose.Types.ObjectId.isValid(courseId)){
            return res.status(400).json({
                message: "Invalid course ID"
            });
        }

        const course = await courseModel.findById(courseId);

        if(!course){
            return res.status(404).json({
                message: "Course not found"
            });
        }

        if(course.isFree){
            return res.status(400).json({
                message: "This is a free course, use the enroll endpoint instead"
            });
        }

        const alreadyEnrolled = await enrollmentModel.findOne({
            userId: userId,
            courseId: courseId
        });

        if(alreadyEnrolled){
            return res.json({
                message: "Already enrolled in this course",
                alreadyEnrolled: true
            });
        }

        await enrollmentModel.create({
            userId: userId,
            courseId: courseId
        });

        res.json({
            message: "Course purchased and enrolled successfully"
        });

    }catch(err){
        res.status(500).json({
            message: "Error purchasing course"
        });
    }

});



userRouter.get("/my-courses", userAuth, async function(req, res){

    try{

        const userId = req.userId;

        const enrollments = await enrollmentModel.find({
            userId: userId
        });

        const courseIds = enrollments.map(e => e.courseId);

        const courses = await courseModel.find({
            _id: { $in: courseIds }
        });

        res.json({
            courses
        });

    }catch(err){

        res.status(500).json({
            message: "Error fetching my courses"
        });

    }

});


module.exports = {
    userRouter
};