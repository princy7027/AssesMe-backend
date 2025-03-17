const mongoose = require('mongoose');

const DiscussionSchema = new mongoose.Schema({
    examId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exams',
        required: true
    },
    comments: [
        {
            studentId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Students',
                required: true
            },
            commentText: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
});

const Discussion = mongoose.model('discussion', DiscussionSchema, 'Discussions');
module.exports = Discussion;