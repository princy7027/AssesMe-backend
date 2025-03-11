const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const QuestionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "exams",
        required: true
    },
    topicName: {
        type: String,
        required: true
    },
    questionText: {
        type: String,
        required: true
    },
    questionType: {
        type: String,
        enum: ["MCQ", "Short", "Fill"],
        required: true
    },
    options: {
        type: Map,
        of: String,
        default: null // Only for MCQ
    },
    correctAnswer: {
        type: Schema.Types.Mixed, // Can be a string or an array
        required: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, { timestamps: true });

const QuestionModel = mongoose.model("questions", QuestionSchema);
module.exports = QuestionModel;
