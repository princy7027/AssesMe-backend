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
        ref: "User",  // Changed from "Student" to "User"
        required: true
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true  // This will add updatedAt field automatically
});

const Discussion = mongoose.model("Discussion", DiscussionSchema);
module.exports = Discussion;