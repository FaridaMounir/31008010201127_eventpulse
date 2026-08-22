const Event =require("../models/eventSchema");
const Catgory =require("../models/categorySchema");
const asyncHandler =require("../utils/asyncHandler");
const AppError =require("../utils/appError");

const getEvents =asyncHandler(async(req, res)=>{


    const {category, city, startDate, endDate, page =1, limit =10, sortBy, search}= req.query;

   let query ={};

   if(category) query.category =category;
   if(city) query.city ={$regex:"city", $options: "i"};
   if(startDate || endDate){
    query.date={};
    if(startDate) query.date.$gte =new Date(startDate);
    if(endDate) query.date.$lte =new Date(endDate);
   }

   if(search){
    query.$or=[
        {title: {$regex:search, $options: "i"}},
        {description:{$regex:search, $options: "i"}}
    ];
   }

    let sorting={};

    if (sortBy ==="date") sorting.date= -1;
    if(sortBy ==="registrations") sorting.registrationCount =-1;


    const skip =(Number(page) -1) *Number(limit);
    const total =await Event.countDocuments(query);

    const events =await Event.find(query)
      .populate("category")
      .sort(sorting)
      .skip(skip)
      .limit(Number(limit))

      res.status(200).json({
        status: "Success",
        results: events.length,
        total:total,
        page:Number(page),
        limit: Number(limit),
        data: {events}
      });

});



const getById =asyncHandler(async(req, res)=>{
    const event =await Event.findById(req.params.id).populate("category");

    if(!event){
        throw new AppError("No events found", 404);
    };

    res.status(200).json({
        status:"Success",
        data: {event}
    })
})

const createEvent= asyncHandler(async(req, res)=>{
    const {title, description, capacity, date, city, category} =req.body;
    const event =await Event.create({title, description, capacity, date, city, category});
    res.status(201).json({
        status: "success",
        data: {event}
    });
});


const updateEvent = asyncHandler(async(req, res)=>{
    const event =await Event.findByIdAndUpdate(req.params.id, req.body ,{
        new: true,
        runValidators:true
    });
    if(!event){
    throw new AppError("No events found", 404);
    };

    res.status(200).json({
        status:"success",
        data:{event}
    });
});


const deleteEvent =asyncHandler(async(req, res)=>{
    const event =await Event.findByIdAndDelete(req.params.id);

    if(!event){
       throw new AppError("No event found", 404);
    };

    res.status(204).json({
        status: "success",
        data: null
    });
});


module.exports ={getEvents, getById, createEvent, updateEvent, deleteEvent};