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
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,  // Duration in minutes
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
    status: {
        type: String,
        enum: ['draft', 'published', 'completed', 'cancelled'],
        default: 'draft'
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
    toJSON: { virtuals: true },    // Include virtuals when document is converted to JSON
    toObject: { virtuals: true }   // Include virtuals when document is converted to plain object
});


ExamSchema.methods.updateTotalMarks = async function() {
    const Question = mongoose.model('Questions');
    const questions = await Question.findOne({ examId: this._id });
    
    if (questions && questions.questionData) {
        this.totalMarks = questions.questionData.reduce((sum, question) => sum + question.marks, 0);
        this.numberOfQuestions = questions.questionData.length;
        await this.save();
    }
};
ExamSchema.virtual('isCurrentlyActive').get(function() {
    const now = new Date();
    const startDateTime = new Date(this.startDate);
    startDateTime.setHours(this.startTime.getHours(), this.startTime.getMinutes());
    
    const endDateTime = new Date(this.endDate);
    endDateTime.setHours(this.endTime.getHours(), this.endTime.getMinutes());
    
    return now >= startDateTime && now <= endDateTime && this.isActive;
});

// Method to update active status
ExamSchema.methods.updateActiveStatus = function() {
    const now = new Date();
    const startDateTime = new Date(this.startDate);
    startDateTime.setHours(this.startTime.getHours(), this.startTime.getMinutes());
    
    const endDateTime = new Date(this.endDate);
    endDateTime.setHours(this.endTime.getHours(), this.endTime.getMinutes());
    
    this.isActive = now >= startDateTime && now <= endDateTime;
    return this.isActive;
};

// Add validation to ensure endDate is after startDate
ExamSchema.pre('save', function(next) {
    if (this.endDate < this.startDate) {
        next(new Error('End date must be after start date'));
    }
    if (this.endTime < this.startTime) {
        next(new Error('End time must be after start time'));
    }
    next();
});

const Exam = mongoose.model('exams', ExamSchema, 'Exams');
module.exports = Exam;