const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const ExamSchema = new Schema({
    examName: {
        type: String,
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    examDate: {
        type: Date,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    startTime: {
        type: String,  // Format: "HH:MM AM/PM"
        required: true
    },
    duration: {
        type: Number, // In minutes
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const ExamModel = mongoose.model("exams", ExamSchema);
module.exports = ExamModel;
