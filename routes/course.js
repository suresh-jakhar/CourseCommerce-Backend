const express = require("express");
const courseRouter = express.Router();
const {userModel, adminModel, courseModel, purchaseModel} = require("./db");

courseRouter.post("/purchase", function(req, res){
    res.json({
        message: "purchase endpoint"
    });
});

courseRouter.get("/preview", function(req, res){
    res.json({
        message: "all courses endpoint"
    });
});

module.exports = {
    courseRouter :courseRouter
};