const ErrorHandler = require('../utils/errorhandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong Mongodb Id error
    if(err.name === "CastError"){
        const message = `Resource not found. invalid: ${err.path}`;
        err = new ErrorHandler(message,404);
    }

    // Mongoose duplicate key error
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,404);
    }

     // Wrong JWT error
     if(err.name === "JsonWebTokenError"){
        const message = `Json web token is invalid, Try again `;
        err = new ErrorHandler(message,404);
    }

     // JWT EXPIRE ERROR
     if(err.name === "TokenExpiredError"){
        const message = `Json web token is Expired, Try again `;
        err = new ErrorHandler(message,404);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};