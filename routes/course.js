const express = require("express");
const Router = express.Router;

const courseRouter = Router();



courseRouter.post("/purchase", function(req,res){
    res.json({
        message : test// purchase end point
    })
})

courseRouter.get("/preview", function(req,res){
    res.json({
        message : test// all the courses end point
    })
})


module.exports={
    courseRouter : courseRouter
}