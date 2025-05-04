const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
    examId: {
        type: Schema.Types.ObjectId,
        ref: "Exams",
        required: true
    },
    questionData: [{
        questionNumber: {
            type: Number
        },
        questionTopic:{
            type:String,
            required:true,
            trim:true
        },
        questionText: {
            type: String,
            required: true,
            trim: true
        },
        queType: {
            type: String,
            enum: ["MCQ", "ShortAnswer"],
            required: true
        },
        options: {
            type: [String],  
            validate: {
                validator: function(options) {
                    if (this.queType === 'MCQ') {
                        return options.length >= 2; 
                    }
                    return true;
                },
                message: 'MCQ questions must have at least 2 options'
            }
        },
        correctAnswer: {
            type: String,
            required: true,
            trim: true
        }
    }]
}, {
    timestamps: true
});

QuestionSchema.pre('save', function(next) {
    try {
        if (this.questionData && this.questionData.length > 0) {
            this.questionData.forEach((question, index) => {
                question.questionNumber = index + 1;
            });
        }

        this.questionData.forEach(question => {
            if (question.queType === 'MCQ') {
                if (!question.options || question.options.length < 2) {
                    throw new Error('MCQ questions must have at least 2 options');
                }
                if (!question.options.includes(question.correctAnswer)) {
                    throw new Error('Correct answer must be one of the options for MCQ');
                }
            }
        });
        next();
    } catch (error) {
        next(error);
    }
});

QuestionSchema.index({ examId: 1 });
QuestionSchema.index({ 'questionData.questionNumber': 1 });

const Question = mongoose.model('Questions', QuestionSchema);
module.exports = Question;