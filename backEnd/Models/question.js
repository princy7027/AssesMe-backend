const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    questionData :[{
    questionId:{
        type:Number
    },
    topicName:{
        type:String
    },
    questionText: {
        type: String,
        required: true
    },
    queType: {
        type: String,
        enum: ["MCQ", "ShortAnswer", "fillInTheBlank"],
        required: true
    },
    options: [{
        type: String  // Only for MCQs
    }],
    correctAnswer: [{
        type: String  // Can be multiple answers for MCQ
    }],
    marks: {
        type: Number,
        required: true
    }
    }]
});

const Question = mongoose.model('Questions', QuestionSchema);
module.exports = Question;
