const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exam",
        required: true
    },
    questionData: [{
        questionNumber: {
            type: Number
        },
        topicName: {
            type: String,
            required: true,
            trim: true
        },
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        difficultyLevel: {
            type: String,
            enum: ['easy', 'medium', 'hard'],
            default: 'medium'
        },
        queType: {
            type: String,
            enum: ["MCQ", "ShortAnswer", "fillInTheBlank"],
            required: true
        },
        options: [{
            optionText: {
                type: String,
                trim: true
            },
            isCorrect: {
                type: Boolean,
                default: false
            }
        }],
        correctAnswer: [{
            type: String,
            trim: true
        }],
        explanation: {
            type: String,
            trim: true
        },
        marks: {
            type: Number,
            required: true,
            min: 0
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }]
}, {
    timestamps: true
});

// Pre-save middleware for validation and question numbering
QuestionSchema.pre('save', function(next) {
    try {
        // Number questions sequentially
        if (this.questionData && this.questionData.length > 0) {
            this.questionData.forEach((question, index) => {
                question.questionNumber = index + 1;
            });
        }

        // Validate each question
        this.questionData.forEach(question => {
            if (question.queType === 'MCQ') {
                if (!question.options || question.options.length === 0) {
                    throw new Error('MCQ questions must have options');
                }
                const hasCorrectOption = question.options.some(option => option.isCorrect);
                if (!hasCorrectOption) {
                    throw new Error('MCQ questions must have at least one correct option');
                }
            } else {
                if (!question.correctAnswer || question.correctAnswer.length === 0) {
                    throw new Error(`${question.queType} questions must have at least one correct answer`);
                }
            }
        });
        next();
    } catch (error) {
        next(error);
    }
});

QuestionSchema.methods.calculateTotalMarks = function() {
    return this.questionData.reduce((sum, question) => sum + question.marks, 0);
};

// Add index for better query performance
QuestionSchema.index({ examId: 1 });
QuestionSchema.index({ 'questionData.questionNumber': 1 });

const Question = mongoose.model('Questions', QuestionSchema);
module.exports = Question;