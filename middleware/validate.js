const {validationResult} =require("express-validator");

const validate =(req, res, next)=>{
    const error =validationResult(req);

    if(!error.isEmpty()){
       return res.status(422).json({
        status:"failed",
        errors:error.array().map(err =>({
            field: err.parameter ||err.path, message: err.message}))
       })
    };
    next();
};

module.exports =validate;