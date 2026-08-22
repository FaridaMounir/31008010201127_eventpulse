const errorHandler =(err, req, res, next)=>{
    let error ={...err}

    let statusCode =err.statusCode || 500;
    let message =err.message ||"Something went wrong";


    if(err.name ==="ValidationError"){
        statusCode =400;
        message =Object.values(err.errors).map((e)=> e.message).join(", ");
    };

    if(err.name ==="CastError"){
        statusCode =400;
        message = `Invalid value for :${err.path}`;
    };

    if(err.code ===11000){
        statusCode =409;
        message ="This field already exists";
    };

    res.status(statusCode).json({
        status: statusCode >= 500? "error" : "fail",
        message: message,
        ...(err.errors && {errors:err.errors}),
        ...(process.env.NODE_ENV ==="development" &&{stack: err.stack})
    })
};


module.exports =errorHandler;