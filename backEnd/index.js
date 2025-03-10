const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const AuthRouter = require('./Routers/AuthRouter');
const QuestionRouter = require('./Routers/QuestionRouter'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/assessMe", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected successfully!");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.get('/p', (req, res) => {
    res.send('HI Kalyani Dave');
});

app.use('/auth', AuthRouter);
app.use('/questions', QuestionRouter);


app.listen(PORT, () => {
    console.log(`Server is Running on PORT ${PORT}`);
});
