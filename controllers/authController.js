const User =require("../models/userSchema");
const asyncHandler =require("../utils/asyncHandler");
const AppError =require("../utils/appError");
const bcrypt =require("bcryptjs");
const jwt =require("jsonwebtoken");

const register = asyncHandler(async(req, res)=>{
      const {name, email, password} =req.body;
        const userExist = await User.findOne({email});
        if(userExist){
           throw new AppError("User already exists", 400);
        };
        
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const newUser =new User({
            name,
            email,
            password: passwordHashed,
            role:"attendee"
        });

        await newUser.save();


        const payload ={
        userId :user._id,
        role:user.role
        };

        const token =jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2d"});


        res.status(201).json({
            message: "user registered successfully",
            token:token,
            user:{
                userId: newUser._id,
                email:newUser.email,
                role: newUser.role,
            }
        });
});


const login =asyncHandler(async(req, res)=>{
            const {email, password} =req.body;

        const user =await User.findOne({email}).select("+password");
        if(!user){
          throw new AppError("Invalid credentials", 401);
        };

        const matching =await bcrypt.compare(password, user.password);
        if(!matching){
          throw new AppError("Invalid credentials", 401);
        }

        const payload ={
            userId :user._id,
            role:user.role
        };

        const token =jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: "2d"});

        res.status(200).json({
            message:"Logged in successfully",
            token: token
        });
});
module.exports ={register, login};