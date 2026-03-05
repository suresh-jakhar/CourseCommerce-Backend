const express = require("express");
const adminRouter = express.Router();

adminRouter.post("/signup", function(req, res){
    res.json({
        message: "signup endpoint"
    });
});

adminRouter.post("/signin", function(req, res){
    res.json({
        message: "signin endpoint"
    });
});

adminRouter.put("/course",function(req,res){
    res.json({
        message : "course creation end point"
    })
})

adminRouter.get("/course/bulk", function(req,res){
    res.json({
        message : "course bulk end point"
    })
})

module.exports={
    adminRouter : adminRouter
}