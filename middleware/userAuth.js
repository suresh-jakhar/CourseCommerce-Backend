const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

function userAuth(req, res, next){

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = authHeader.split(" ")[1];

    try{

        const decoded = jwt.verify(token, USER_JWT_SECRET);

        req.userId = decoded.userId;

        next();

    }catch(err){
        return res.status(403).json({
            message: "Invalid user token"
        });
    }

}

module.exports = {
    userAuth
};