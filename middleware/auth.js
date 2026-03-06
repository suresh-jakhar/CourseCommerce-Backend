const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

function auth(req, res, next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    try{

        const decoded = jwt.verify(token, JWT_SECRET);

        req.userId = decoded.userId;

        next();

    }catch(err){
        res.status(403).json({
            message: "Invalid token"
        });
    }
}

module.exports = {
    auth
};