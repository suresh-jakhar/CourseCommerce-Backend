const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const {userModel, adminModel, courseModel, purchaseModel} = require("../db/db");

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
        const hashedPassword = await bcrypt.hash(password, 10);

        await userModel.create({
            email: email,
            password: hashedPassword,
            firstName: firstName,
            lastName: lastName
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

    const parsedData = signinSchema.safeParse(req.body);

    if(!parsedData.success){
        return res.status(400).json({
            message: "Invalid input",
            errors: parsedData.error.issues
        });
    }

    const { email, password } = parsedData.data;

    const user = await userModel.findOne({ email: email });

    if(!user){
        return res.status(403).json({
            message: "User not found"
        });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if(passwordMatch){
        res.json({
            message: "Signin successful"
        });
    }else{
        res.status(403).json({
            message: "Invalid password"
        });
    }
});

userRouter.get("/purchases", function(req, res){
    res.json({
        message: "purchased courses endpoint"
    });
});

module.exports = {
    userRouter : userRouter
};