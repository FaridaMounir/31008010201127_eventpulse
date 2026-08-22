const jwt =require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/appError");

const requireAuth =asyncHandler(async(req, res, next)=>{
    const authHeader =req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new AppError("Cannot access. Token missing",401);
    };

    const token =authHeader.split(" ")[1];
    try{

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user =decoded;
        next();
    }catch(error){
        throw new AppError("Invalid token", 401);
    }
});
    const requireRole =(role) =>{
        return (req, res, next)=>{
            if (!req.user || req.user.role !== role){
                throw new AppError("Access denied", 403);
            };
            next();
        };
    };


module.exports ={requireAuth, requireRole};