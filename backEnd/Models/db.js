const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project";

async function connectDB() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 60000, 
            socketTimeoutMS: 60000, 
            connectTimeoutMS: 60000, 
            retryWrites: true,
            w: 'majority',
            family: 4,  
            maxPoolSize: 50, 
            minPoolSize: 10, 
            keepAlive: true,
            keepAliveInitialDelay: 300000,
            autoIndex: true,
            retryReads: true, 
            heartbeatFrequencyMS: 10000 
        });
        
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB Atlas');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
            setTimeout(() => connectDB(), 5000);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
            setTimeout(() => connectDB(), 5000);
        });

        console.log("MongoDB Atlas connected successfully!");
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err.message);
        setTimeout(() => connectDB(), 5000);
    }
}

module.exports = connectDB; //this repesent the mongodb connection 