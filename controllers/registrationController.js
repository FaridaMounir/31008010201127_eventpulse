const Registration =require("../models/registrationSchema");
const Event= require("../models/eventSchema");
const asyncHandler =require("../utils/asyncHandler");
const AppError =require("../utils/appError");

const eventRegister =asyncHandler(async(req, res)=>{
    const {eventId} = req.body;
   const userId = req.user.userId || req.user._id || req.user.id;

    const event =await Event.findById(eventId);
    if(!event){
        throw new AppError("Event not found", 404);
    };

    const registerExist =await Registration.findOne({
        user: userId,
        event: eventId,
        status: {$ne:"Cancelled"}
    });

    if(registerExist){
        throw new AppError("You are already registered!", 400);
    };

    const currentCounts =await Registration.countDocuments({
        event:eventId,
        status:"Confirmed"
    });

    if(currentCounts >= event.capacity){
        throw new AppError("Event is full", 400);
    };

    const registration =await Registration.create({
        user:userId,
        event:eventId,
        status:"Confirmed"
    });

    res.status(201).json({
        status:"Success",
        message:"Successfully registered!",
        registration: registration
    });

});


const getUserRegister =asyncHandler(async(req, res)=>{
   const userId =req.user._id || req.user.id|| req.user.userId;
    const registration =await Registration.find({
        status:"Confirmed",
    }).populate("event");

    res.status(200).json({
        status:"Success",
        registrations:registration
    });

});


const cancelRegister=asyncHandler(async(req, res)=>{

    const userId =req.user._id || req.user.id|| req.user.userId;

    const registration =await Registration.findById(req.params.id);

    if(!registration){
        throw new AppError("Registration not found", 404);
    };

    if(registration.user.toString() !==userId.toString()){
        throw new AppError("Unable to cancel registration. Access denied.", 403);
    };

    await registration.deleteOne();

    res.status(200).json({
        status:"Success",
        message:"Registration cancelled successfully"
    });
});

module.exports ={eventRegister, getUserRegister, cancelRegister};