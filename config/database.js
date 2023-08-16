const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose
        .connect(process.env.DB_URI, { dbName: 'SanatnNepaliCalender' })
        .then((data) => {
            console.log(
                `mongodb connected with server ${data.connection.host}`
            );
        }) .catch((error) => {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
      });;
};

module.exports = connectDatabase;
