const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');

const AuthRouter = require('./Routers/AuthRouter');
const ExamRouter = require('./Routers/ExamRoutes');
const QuestionRouter = require('./Routers/Question');
const StudentRouter = require('./Routers/Student');
const DiscussionRouter = require('./Routers/DiscussionRouter'); // Added discussion routes

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project", {
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
app.use('/question', QuestionRouter);
app.use('/exam', ExamRouter);
app.use('/student', StudentRouter);
app.use('/discussion', DiscussionRouter);
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('newDiscussion', async (data) => {
        io.emit('updateDiscussions', data); 
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Start Server
server.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
