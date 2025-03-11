const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const ExamSchema = new Schema({
    examName: {
        type: String,
        // required: true
    },
    subject: {
        type: String,
        // required: true
    },
    examDate: {
        type: Date,
        // required: true
    },
    startTime: {
        type: Date, 
        // required: true
    },
    endTime: {
        type: Date,  
        // required: true
    },
    totalMarks: {
        type: Number,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String
    },
    editedAt: {
        type: Date
    },
    editedBy: {
        type: String
    },
    questions: [{
        type: Schema.Types.ObjectId, 
        ref: "Question"  
    }]
});

const Exam = mongoose.model('Exam', ExamSchema);
module.exports = Exam;
