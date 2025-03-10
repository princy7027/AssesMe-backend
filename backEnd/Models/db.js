const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:1234@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Atlas connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
