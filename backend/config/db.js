const mongoose = require("mongoose");

function normalizeMongoUri(uri) {
    if (!uri || !uri.includes("mongodb.net")) {
        return uri;
    }

    // Atlas URL with no database name → use a stable default
    if (!uri.match(/mongodb\.net\/[^/?]+/)) {
        return uri.replace(/mongodb\.net\/?/, "mongodb.net/student-dashboard");
    }

    return uri;
}

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI && process.env.NODE_ENV === "production") {
            throw new Error("MONGO_URI is required in production");
        }

        const mongoURI = normalizeMongoUri(
            process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student-dashboard"
        );

        const conn = await mongoose.connect(mongoURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
