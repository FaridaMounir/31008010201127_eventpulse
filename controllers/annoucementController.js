const Message =require("../models/messageSchema");
const asyncHandler =require("../utils/asyncHandler");
const AppError =require("../utils/appError");

const announcementCreate = asyncHandler(async (req, res) => {
    const { eventId, content, message } = req.body;
    const bodyText = content || message;


    const senderId = req.user._id || req.user.id || req.user.userId;

    if (!eventId || !bodyText) {
        throw new AppError("Please enter both event id and content", 400);
    }

    const newMessage = await Message.create({
        event: eventId,
        sender: senderId,
        content: bodyText
    });

    const populate = await newMessage.populate("sender", "email name");

    const io = req.app.get("io");
    if (io) {
        io.to(eventId).emit("announcement", populate);
    }

    res.status(201).json({
        status: "Success",
        data: populate
    });
});


const getById = asyncHandler(async(req, res)=>{
    const {eventId} =req.params;

    if(!eventId){
        throw new AppError("please enter eventId",400);
    };

    const announcements =await Message.find({event: eventId})
      .populate("sender", "email name")
      .sort({createdAt: 1});


    res.status(200).json({
        status:"Success",
        results:announcements.length ,
        data:announcements
    });
});


module.exports ={announcementCreate, getById};