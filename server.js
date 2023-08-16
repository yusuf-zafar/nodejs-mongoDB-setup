const app = require('./app')

require("dotenv").config();
const connectDatabase = require("./config/database");



// Handling Uncaught Exception
process.on("uncaughtException",(err)=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise Rejection`);
    process.exit(1);
});

// connecting to database
connectDatabase();


const server = app.listen(process.env.PORT,()=>{
    console.log(`Server is running at http://localhost:${process.env.PORT}`)
});


// Unhandled Promise Rejection
process.on("unhandledRejection",err=>{
    console.log(`Error: ${err.message}`);
    console.log(`shutting down the server due to unhandled Promise Rejection`);

    server.close(()=>{
        process.exit(1);
    });
});