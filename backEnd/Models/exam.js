const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    examName: {
        type: String,
        required: true,
        trim: true
    },
    subject: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    duration: {
        type: Number, 
        required: true
    },
    totalMarks: {
        type: Number,
        required: true,
        min: 0
    },
    numberOfQuestions: {
        type: Number,
        required: true,
        min: 1
    },
    instructions: {
        type: String,
        trim: true
    },
    passingMarks: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isAIGenerated: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    editedAt: {
        type: Date
    },
    editedBy: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    }
},{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});
ExamSchema.statics.updateExamStatuses = async function() {
    const currentDate = new Date();
    await this.updateMany(
        { endDate: { $lt: currentDate } },
        { $set: { isActive: false } }
    );
    console.log('Exam statuses updated based on end dates');
};

// Add this to automatically check status when finding exams
ExamSchema.pre('find', function() {
    const currentDate = new Date();
    this.where({ endDate: { $lt: currentDate } }).updateOne({}, { isActive: false });
});

const Exam = mongoose.model('exams', ExamSchema, 'Exams');
Exam.updateExamStatuses();
setInterval(() => {
    Exam.updateExamStatuses();
}, 3600000);

module.exports = Exam;