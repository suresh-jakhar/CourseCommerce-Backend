const express = require("express");
const courseRouter = express.Router();
const {userModel, adminModel, courseModel, purchaseModel} = require("../db/db");
courseRouter.post("/purchase", function(req, res){
    res.json({
        message: "purchase endpoint"
    });
});

courseRouter.get("/preview", async function(req, res){

    try{

        const courses = await courseModel.find({});

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
    courseRouter :courseRouter
};