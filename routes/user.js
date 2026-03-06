const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");

const {userModel, adminModel, courseModel, purchaseModel} = require("../db/db");

userRouter.post("/signup", async function(req, res){
    const { email, password, firstName, lastName } = req.body;

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

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email
    });

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