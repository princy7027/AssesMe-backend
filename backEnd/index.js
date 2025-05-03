const express = require('express'); // using express js 
const http = require('http'); 
const mongoose = require('mongoose');
const cors = require('cors'); //use for the different domain like gemini ai and calling from the local domain 
const dotenv = require('dotenv');//env file me se enviroment variable load here 
const socketIo = require('socket.io'); // real-time communication

const UserRouter = require('./Routers/UserRouter');
const AuthRouter = require('./Routers/AuthRouter');
const ExamRouter = require('./Routers/ExamRoutes');
const QuestionRouter = require('./Routers/Question');
const Discussion = require('./Routers/Discussion'); 
const aiQuestionRouter = require('./Routers/AIQuestion');
const ResultRouter = require('./Routers/Result');
const AdminRouter = require('./Routers/AdminRouter');

dotenv.config();

const app = express();
const server = http.createServer(app); //created our own http server 
const io = socketIo(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 8080;

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://kalyanidave2004:kd7jan2004@project.pbdln.mongodb.net/assessMe?retryWrites=true&w=majority&appName=Project", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Atlas connected successfully!");
    } catch (err) {
        console.error("MongoDB Atlas connection error:", err);
        process.exit(1);
    }
}

require('./Models/user');
require('./Models/exam');
require('./Models/question');
require('./Models/result');


app.use(cors());


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/p', (req, res) => {
    res.send('HI Kalyani Dave');
});

app.use('/user', UserRouter); //if my url starts with this /user then redirect to usercontoller right 
app.use('/auth', AuthRouter);
app.use('/question', QuestionRouter);
app.use('/exam', ExamRouter);
app.use('/discussion', Discussion);
app.use('/ai-question', aiQuestionRouter);
app.use('/result', ResultRouter);
app.use('/admin', AdminRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: err.message
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('newDiscussion', async (data) => {
        try {
            io.emit('updateDiscussions', data);
        } catch (error) {
            console.error('Socket error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

connectDB().then(() => {
    try {
        server.listen(PORT, () => { //now you hve strtlistening all req on this port 
            console.log(`Server is Running on PORT ${PORT}`);
        }).on('error', (error) => {
            console.error('Server startup error:', error);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}).catch(err => {
    console.error("Server startup failed:", err);
    process.exit(1);
});