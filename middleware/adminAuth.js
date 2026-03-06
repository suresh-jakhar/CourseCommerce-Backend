const jwt = require("jsonwebtoken");

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

function adminAuth(req, res, next){

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const parts = authHeader.split(" ");

    if(parts.length !== 2 || parts[0] !== "Bearer"){
        return res.status(401).json({
            message: "Invalid token format"
        });
    }

    const token = parts[1];

    try{

        const decoded = jwt.verify(token, ADMIN_JWT_SECRET);

        req.adminId = decoded.adminId;

        next();

    }catch(err){
        return res.status(403).json({
            message: "Invalid admin token"
        });
    }

}

module.exports = {
    adminAuth
};