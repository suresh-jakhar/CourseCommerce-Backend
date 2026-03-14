const jwt = require("jsonwebtoken");

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET;

function adminAuth(req, res, next){

    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({
            message: "Token missing"
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

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