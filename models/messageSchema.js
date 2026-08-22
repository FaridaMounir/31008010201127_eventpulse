const mongoose =require("mongoose");

const messageSchema =new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true, "Sender is required"]
    },
    event:{
        type:mongoose.Schema.Types.ObjectId,
    },
    content:{
        type: String,
        required:[true, "Message content is required"]
    },

},{timestamps: true});

module.exports = mongoose.model("Message", messageSchema);