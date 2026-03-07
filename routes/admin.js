require("dotenv").config();
const express = require("express");
const adminRouter = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { z } = require("zod");

const { adminModel, courseModel } = require("../db/db");
const { adminAuth } = require("../middleware/adminAuth");

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;



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

const courseSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    price: z.number().positive(),
    imageUrl: z.string().url()
});



adminRouter.post("/signup", async function(req, res){

    const parsedData = signupSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedData.error.issues
        });
    }

    const { email, password, firstName, lastName } = parsedData.data;

    try{

        const existingAdmin = await adminModel.findOne({ email });

        if(existingAdmin){
            return res.status(409).json({
                message: "Admin already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await adminModel.create({
            email,
            password: hashedPassword,
            firstName,
            lastName
        });

        res.json({
            message: "Admin signup successful"
        });

    }catch(err){
        res.status(500).json({
            message: "Error signing up admin"
        });
    }

});



adminRouter.post("/signin", async function(req, res){

    try{

        const parsedData = signinSchema.safeParse(req.body);

        if(!parsedData.success){
            return res.status(400).json({
                message: "Invalid input",
                errors: parsedData.error.issues
            });
        }

        const { email, password } = parsedData.data;

        const admin = await adminModel.findOne({ email });

        if(!admin){
            return res.status(403).json({
                message: "Admin not found"
            });
        }

        const passwordMatch = await bcrypt.compare(password, admin.password);

        if(passwordMatch){

            const token = jwt.sign(
                { adminId: admin._id },
                ADMIN_JWT_SECRET,
                { expiresIn: "1d" }
            );

            res.json({
                message: "Admin signin successful",
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



adminRouter.post("/course", adminAuth, async function(req,res){

    const parsedData = courseSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid course input",
            errors: parsedData.error.issues
        });
    }

    try{

        const adminId = req.adminId;

        const { title, description, imageUrl, price } = parsedData.data;

        const course = await courseModel.create({
            title,
            description,
            imageUrl,
            price,
            creatorId: adminId
        });

        res.json({
            message: "Course created successfully",
            courseId: course._id
        });

    }catch(err){
        res.status(500).json({
            message: "Error creating course"
        });
    }

});



adminRouter.get("/course/bulk", adminAuth, async function(req,res){

    try{

        const adminId = req.adminId;

        const courses = await courseModel.find({
            creatorId: adminId
        });

        res.json({
            courses
        });

    }catch(err){
        res.status(500).json({
            message: "Error fetching courses"
        });
    }

});


module.exports = {
    adminRouter
};