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
// ... existing code ...

// ... schema definition remains the same ...

// Improved pre-save validation
ExamSchema.pre('save', function(next) {
    const currentDate = new Date();
    
    // Validate date order
    if (this.startDate >= this.endDate) {
        return next(new Error('End date must be after start date'));
    }
    
    // Validate duration matches date range
    const examDurationInMinutes = (this.endDate - this.startDate) / (1000 * 60);
    if (examDurationInMinutes < this.duration) {
        return next(new Error('Exam time window must be greater than or equal to exam duration'));
    }
    
    // Only check for past dates on new exams
    if (this.startDate < currentDate && this.isNew) {
        return next(new Error('Start date cannot be in the past for new exams'));
    }
    
    next();
});

// Enhanced virtual status
ExamSchema.virtual('status').get(function() {
    const currentDate = new Date();
    const isInTimeWindow = currentDate >= this.startDate && currentDate <= this.endDate;
    const isUpcoming = currentDate < this.startDate;
    const timeLeftMs = this.endDate - currentDate;
    
    return {
        isActive: isInTimeWindow,
        state: isInTimeWindow ? 'ONGOING' : 
               isUpcoming ? 'UPCOMING' : 'COMPLETED',
        timeLeft: isInTimeWindow ? Math.floor(timeLeftMs / 1000) : 0,
        startTimeLeft: isUpcoming ? Math.floor((this.startDate - currentDate) / 1000) : 0
    };
});

// ... existing code ...

ExamSchema.statics.updateExamStatuses = async function() {
    const currentDate = new Date();
    try {
        const result = await this.updateMany(
            { 
                $or: [
                    { isActive: true, endDate: { $lt: currentDate } },  // For deactivating expired exams
                    { isActive: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }  // For reactivating valid exams
                ]
            },
            [
                {
                    $set: {
                        isActive: {
                            $and: [
                                { $lte: ['$startDate', currentDate] },
                                { $gte: ['$endDate', currentDate] }
                            ]
                        }
                    }
                }
            ]
        );
        if (result.modifiedCount > 0) {
            console.log(`Updated ${result.modifiedCount} exam statuses at: ${currentDate.toISOString()}`);
        }
    } catch (error) {
        console.error('Failed to update exam statuses:', error.message);
    }
};
const Exam = mongoose.model('exams', ExamSchema, 'Exams');

// Initial status update
Exam.updateExamStatuses();

// Regular status updates (every 5 minutes)
setInterval(() => {
    Exam.updateExamStatuses();
}, 300000);

module.exports = Exam;