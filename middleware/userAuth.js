const jwt = require("jsonwebtoken");

const USER_JWT_SECRET = process.env.USER_JWT_SECRET;

function userAuth(req, res, next){

    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            message: "Token missing"
        });
    }

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