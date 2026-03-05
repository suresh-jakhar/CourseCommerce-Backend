const express = require("express");
const Router = express.Router;

const userRouter = Router();

userRouter.post("/signup", function(req,res){
    res.json({
        message : test // sign up end point
    })
})

userRouter.post("/signin", function(req,res){
    res.json({
         message : test// sign in end point
    })
})

userRouter.get("/purchases", function(req,res){
    res.json({
        message : test// purchased courses end point
    })
})

module.exports={
    userRouter : userRouter
}  