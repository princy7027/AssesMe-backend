const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const AuthRouter = require('./Routers/AuthRouter');
const QuestionRouter = require('./Routers/QuestionRouter');
const ExamRouter = require('./Routers/ExamRoutes')

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas Connection
mongoose.connect("mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB Atlas connected successfully!");
}).catch((err) => {
    console.error("MongoDB Atlas connection error:", err);
});

// Test Route
app.get('/p', (req, res) => {
    res.send('HI Kalyani Dave');
});

// Routes
app.use('/auth', AuthRouter);
app.use('/questions', QuestionRouter);
app.use('/exam' , ExamRouter);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
