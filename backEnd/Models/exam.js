const mongoose = require("mongoose");
const User = require('./user');
const Schema = mongoose.Schema;

const ExamSchema = new Schema({
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
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


// // ... schema definition remains the same ...
// // ... existing schema definition ...

// // Add a virtual populate for creator's information
// ExamSchema.virtual('creator', {
//     ref: 'users',
//     localField: 'createdBy',
//     foreignField: '_id',
//     justOne: true
// });

// // Modify any static methods that get exams to populate creator
// ExamSchema.statics.getAllExams = async function() {
//     try {
//         return await this.find()
//             .populate('createdBy', 'name email') // Populate only name and email fields
//             .sort({ createdAt: -1 });
//     } catch (error) {
//         console.error('Error fetching exams:', error);
//         throw error;
//     }
// };

// // ... rest of your existing code ...
// // Improved pre-save validation
// ExamSchema.pre('save', function(next) {
//     const currentDate = new Date();
    
//     // Validate date order
//     if (this.startDate >= this.endDate) {
//         return next(new Error('End date must be after start date'));
//     }
    
//     // Validate duration matches date range
//     const examDurationInMinutes = (this.endDate - this.startDate) / (1000 * 60);
//     if (examDurationInMinutes < this.duration) {
//         return next(new Error('Exam time window must be greater than or equal to exam duration'));
//     }
    
//     // Only check for past dates on new exams
//     if (this.startDate < currentDate && this.isNew) {
//         return next(new Error('Start date cannot be in the past for new exams'));
//     }
    
//     next();
// });
// ExamSchema.pre('save', function(next) {
//     const currentDate = new Date();
    
//     // Validate date order
//     if (this.startDate >= this.endDate) {
//         return next(new Error('End date must be after start date'));
//     }
    
//     // Validate duration matches date range
//     const examDurationInMinutes = (this.endDate - this.startDate) / (1000 * 60);
//     if (examDurationInMinutes < this.duration) {
//         return next(new Error('Exam time window must be greater than or equal to exam duration'));
//     }
    
//     // Only check for past dates on new exams
//     if (this.startDate < currentDate && this.isNew) {
//         return next(new Error('Start date cannot be in the past for new exams'));
//     }
    
//     next();
// });

// // Enhanced virtual status
// ExamSchema.virtual('status').get(function() {
//     const currentDate = new Date();
//     const isInTimeWindow = currentDate >= this.startDate && currentDate <= this.endDate;
//     const isUpcoming = currentDate < this.startDate;
//     const timeLeftMs = this.endDate - currentDate;
    
//     return {
//         isActive: isInTimeWindow,
//         state: isInTimeWindow ? 'ONGOING' : 
//                isUpcoming ? 'UPCOMING' : 'COMPLETED',
//         timeLeft: isInTimeWindow ? Math.floor(timeLeftMs / 1000) : 0,
//         startTimeLeft: isUpcoming ? Math.floor((this.startDate - currentDate) / 1000) : 0
//     };
// });

// // ... existing code ...

// ExamSchema.statics.updateExamStatuses = async function() {
//     const currentDate = new Date();
//     try {
//         const result = await this.updateMany(
//             { 
//                 $or: [
//                     { isActive: true, endDate: { $lt: currentDate } },  // For deactivating expired exams
//                     { isActive: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }  // For reactivating valid exams
//                 ]
//             },
//             [
//                 {
//                     $set: {
//                         isActive: {
//                             $and: [
//                                 { $lte: ['$startDate', currentDate] },
//                                 { $gte: ['$endDate', currentDate] }
//                             ]
//                         }
//                     }
//                 }
//             ]
//         );
//         if (result.modifiedCount > 0) {
//             console.log(`Updated ${result.modifiedCount} exam statuses at: ${currentDate.toISOString()}`);
//         }
//     } catch (error) {
//         console.error('Failed to update exam statuses:', error.message);
//     }
// };
// const Exam = mongoose.model('exams', ExamSchema, 'Exams');

// // Initial status update
// Exam.updateExamStatuses();

// // Regular status updates (every 5 minutes)
// setInterval(() => {
//     Exam.updateExamStatuses();
// }, 300000);

// module.exports = Exam;

// Pre-save validation
// ExamSchema.pre('save', function(next) {
//     const currentDate = new Date();
    
//     if (this.startDate >= this.endDate) {
//         return next(new Error('End date must be after start date'));
//     }
    
//     const examDurationInMinutes = (this.endDate - this.startDate) / (1000 * 60);
//     if (examDurationInMinutes < this.duration) {
//         return next(new Error('Exam time window must be greater than or equal to exam duration'));
//     }
    
//     if (this.startDate < currentDate && this.isNew) {
//         return next(new Error('Start date cannot be in the past for new exams'));
//     }
    
//     next();
// });

ExamSchema.pre('save', function(next) {
    const currentDate = new Date();
    const startDateTime = new Date(this.startDate);
    const endDateTime = new Date(this.endDate);
    
    // Only validate dates for new exams
    if (this.isNew) {
        // Allow same-day exams
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const examDate = new Date(startDateTime);
        examDate.setHours(0, 0, 0, 0);

        if (examDate < today) {
            return next(new Error('Start date cannot be in the past'));
        }
    }
    
    if (endDateTime <= startDateTime) {
        return next(new Error('End date/time must be after start date/time'));
    }
    
    const examDurationInMinutes = (endDateTime - startDateTime) / (1000 * 60);
    if (examDurationInMinutes < this.duration) {
        return next(new Error('Exam time window must be greater than or equal to exam duration'));
    }
    
    next();
});


ExamSchema.virtual('creator', {
    ref: 'users',
    localField: 'createdBy',
    foreignField: '_id',
    justOne: true
});

ExamSchema.virtual('examStatus').get(function() {
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



ExamSchema.statics.getAllExams = async function() {
    try {
        return await this.find()
            .populate({
                path: 'createdBy',
                select: 'name' 
            })
            .populate({
                path: 'editedBy',
                select: 'name' 
            })
            .sort({ createdAt: -1 });
    } catch (error) {
        console.error('Error fetching exams:', error);
        throw error;
    }
};
ExamSchema.statics.updateExamStatuses = async function() {
    const currentDate = new Date();
    try {
        const result = await this.updateMany(
            { 
                $or: [
                    { isActive: true, endDate: { $lt: currentDate } },
                    { isActive: false, startDate: { $lte: currentDate }, endDate: { $gte: currentDate } }
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
        ).maxTimeMS(5000);

        if (result.modifiedCount > 0) {
            console.log(`Updated ${result.modifiedCount} exam statuses at: ${currentDate.toISOString()}`);
        }
    } catch (error) {
        console.error('Failed to update exam statuses:', error.message);
    }
};

const Exam = mongoose.model('Exams', ExamSchema, 'Exams');

const startStatusUpdates = async () => {
    try {
        await Exam.updateExamStatuses();
        setInterval(async () => {
            try {
                await Exam.updateExamStatuses();
            } catch (error) {
                console.error('Status update failed:', error.message);
            }
        }, 300000); 
    } catch (error) {
        console.error('Initial status update failed:', error.message);
    }
};


mongoose.connection.once('connected', () => {
    startStatusUpdates();
});

module.exports = Exam;