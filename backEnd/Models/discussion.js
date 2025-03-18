const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DiscussionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    text: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;
