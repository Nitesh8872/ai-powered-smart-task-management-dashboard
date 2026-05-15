const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI && process.env.NODE_ENV === "production") {
            throw new Error("MONGO_URI is required in production");
        }

        const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-dashboard";
        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
