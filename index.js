const express = require("express");
const app = express();


app.post("/user/signup", function(req,res){
    res.json({
        // sign up end point
    })
})

app.post("/user/signin", function(req,res){
    res.json({
        // sign in end point
    })
})

app.get("/user/purchases", function(req,res){
    res.json({
        // purchased courses end point
    })
})

app.get("/courses", function(req,res){
    res.json({
        // all the courses end point
    })
})


app.post("/course/purchase", function(req,res){
    res.json({
        // purchase end point
    })
})