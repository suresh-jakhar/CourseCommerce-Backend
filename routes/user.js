const express = require("express");
const userRouter = express.Router();
const {userModel, adminModel, courseModel, purchaseModel} = require("./db");

userRouter.post("/signup", function(req, res){
    res.json({
        message: "signup endpoint"
    });
});

userRouter.post("/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    });
});

userRouter.get("/purchases", function(req, res){
    res.json({
        message: "purchased courses endpoint"
    });
});

module.exports = {
    userRouter : userRouter
};