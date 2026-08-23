const mongoose =require("mongoose");

const registrationSchema =new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"]
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: [true, "Id is required"]
    },
    status:{
        type:String,
        enum:["Pending", "Confirmed", "Cancelled"],
        default: "Confirmed"
    }
},{timestamps: true});

registrationSchema.index({user:1, event:1}, {unique: true})

module.exports =mongoose.model("Registration", registrationSchema);