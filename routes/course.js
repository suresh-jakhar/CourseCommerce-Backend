const express = require("express");
const courseRouter = express.Router();
const { courseModel } = require("../db/db");

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