const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ResultSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    examId: {
        type: Schema.Types.ObjectId,
        ref: 'Exams',
        required: true
    },
    totalMarks: {
        type: Number,
        required: true
    },
    obtainedMarks: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    passingMarks: {
        type: Number,
        required: true
    },
    isPassed: {
        type: Boolean,
        required: true
    },
    strongAreas: [{
        questionText: String,
        questionTopic: String,
        questionNumber: Number,
        queType: String
    }],
    weakAreas: [{
        questionText: String,
        questionTopic: String,
        questionNumber: Number,
        queType: String,
        correctAnswer: String,
        userAnswer: String
    }],
    submittedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

ResultSchema.index({ userId: 1, examId: 1 });

const Result = mongoose.model('Results', ResultSchema);
module.exports = Result;