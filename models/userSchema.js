const mongoose =require("mongoose");
const bcrypt =require("bcryptjs");

const userSchema =new mongoose.Schema({
    name:{
        type: String,
        required:[true, "Name is required"],
        trim: true,

    },
    email:{
        type: String,
        required:[true, "Email is required"],
        unique: true, 
        trim: true,
        lowercase:true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
        
    },
    password:{
        type:String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be atleast 6 characters"],

    },
    role:{
        type: String,
        enum:["attendee", "admin"],
        default: "attendee"
    }

},{timestamps: true});

    
module.exports =mongoose.model("User", userSchema);