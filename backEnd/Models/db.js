const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project";

async function connectDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000, // Increased timeout
            socketTimeoutMS: 45000,
            retryWrites: true,
            w: 'majority',
            family: 4 // Force IPv4
        });
        console.log("MongoDB Atlas connected successfully!");
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err);
        process.exit(1);
    }
}

module.exports = connectDB;