const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project";

async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 60000, // Increased timeout further
            socketTimeoutMS: 60000, // Increased socket timeout
            connectTimeoutMS: 60000, // Added connect timeout
            retryWrites: true,
            w: 'majority',
            family: 4, // Force IPv4
            maxPoolSize: 10, // Added connection pool size
            keepAlive: true, // Keep connection alive
            keepAliveInitialDelay: 300000 // 5 minutes
        });
        console.log("MongoDB Atlas connected successfully!");
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;