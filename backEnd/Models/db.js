const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project";

async function connectDB() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 60000, // Increased timeout
            socketTimeoutMS: 60000, // Increased timeout
            connectTimeoutMS: 60000, // Increased timeout
            retryWrites: true,
            w: 'majority',
            family: 4,  
            maxPoolSize: 50, 
            minPoolSize: 10, // Increased min pool
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            autoIndex: true,
            retryReads: true, // Added retry reads
            heartbeatFrequencyMS: 10000 // Added heartbeat check
        });
        
        // Connection event handlers remain the same
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            // Attempt to reconnect
            setTimeout(() => connectDB(), 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
            // Attempt to reconnect
            setTimeout(() => connectDB(), 5000);
        });

        console.log("MongoDB Atlas connected successfully!");
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err.message);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => connectDB(), 5000);
    }
}

module.exports = connectDB;