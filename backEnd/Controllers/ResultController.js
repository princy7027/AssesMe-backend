const Question = require('../Models/question');
const Result = require('../Models/result');
const Exam = require('../Models/exam');
const User = require('../Models/user');
exports.calculateResult = async (req, res) => {
    try {
        const { examId, userId } = req.params;
        const { responses } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        

        const questions = await Question.findOne({ examId });
        if (!questions) {
            return res.status(404).json({
                success: false,
                message: "Questions not found"
            });
        }

        const allResults = await Result.find({ examId })
        .populate({
            path: 'userId',
            select: 'name',
            model: 'User'
        })
            .select('obtainedMarks percentage userId');
            

            const examStatistics = {
                totalStudents: allResults.length,
                averageMarks: allResults.length > 0 ? 
                    allResults.reduce((acc, curr) => acc + curr.obtainedMarks, 0) / allResults.length : 0,
                highestMarks: allResults.length > 0 ? 
                    Math.max(...allResults.map(r => r.obtainedMarks)) : 0,
                lowestMarks: allResults.length > 0 ? 
                    Math.min(...allResults.map(r => r.obtainedMarks)) : 0,
                studentsPerformance: allResults.map(r => ({
                    studentName: r.userId.name,
                    marks: r.obtainedMarks,
                    percentage: r.percentage
                }))
            };

        let obtainedMarks = 0;
        const totalMarks = exam.totalMarks;
        const marksPerQuestion = totalMarks / questions.questionData.length;
        const strongAreas = [];
        const weakAreas = [];


        // ... existing code ...

        questions.questionData.forEach((question) => {
            const userResponse = responses.find(r => r.questionNumber === question.questionNumber);
            if (userResponse) {
                const isCorrect = userResponse.selectedAnswer.trim().toLowerCase() === 
                                question.correctAnswer.trim().toLowerCase();
                
                if (isCorrect) {
                    obtainedMarks += marksPerQuestion;
                    strongAreas.push({
                        questionText: question.questionText,
                        questionTopic: question.questionTopic,
                        questionNumber: question.questionNumber,
                        queType: question.queType
                    });
                } else {
                    weakAreas.push({
                        questionText: question.questionText,
                        questionTopic: question.questionTopic,
                        questionNumber: question.questionNumber,
                        queType: question.queType,
                        correctAnswer: question.correctAnswer,
                        userAnswer: userResponse.selectedAnswer
                    });
                }
            }
        });

// ... rest of the code remains the same ...


        const percentage = (obtainedMarks / totalMarks) * 100;
        const isPassed = percentage >= exam.passingMarks;

        const result = new Result({
            userId,
            examId,
            totalMarks,
            obtainedMarks,
            percentage,
            passingMarks: exam.passingMarks,
            isPassed,
            strongAreas,
            weakAreas,
            submittedAt: new Date()
        });

        await result.save();

        return res.status(200).json({
            success: true,
            message: `Result calculated successfully. Student has ${isPassed ? 'passed' : 'failed'} the exam.`,
            data: {
                result,
                examDetails: {
                    examName: exam.examName,
                    subject: exam.subject,
                    totalMarks,
                    passingMarks: exam.passingMarks,
                    obtainedMarks,
                    percentage,
                    status: isPassed ? 'PASSED' : 'FAILED',
                    correctAnswers: strongAreas.length,
                    incorrectAnswers: weakAreas.length,
                    totalQuestions: questions.questionData.length
                },examStatistics 
            },
            token: req.token
        });

    } catch (error) {
        console.error("Error calculating result:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to calculate result",
            error: error.message
        });
    }
};

exports.getExamResults = async (req, res) => {
    try {
        const { examId } = req.params;
        
        const results = await Result.find({ examId })
            .populate('userId', 'name email')
            .populate('examId', 'examName subject totalMarks passingMarks')
            .sort('-createdAt');

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No results found for this exam"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Results fetched successfully",
            data: results,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching exam results:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch exam results",
            error: error.message
        });
    }
};

exports.getStudentResults = async (req, res) => {
    try {
        const { userId } = req.params;

        const results = await Result.find({ userId })
            .populate('examId', 'examName subject totalMarks passingMarks')
            .sort('-createdAt');

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No results found for this student"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Results fetched successfully",
            data: results,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching student results:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student results",
            error: error.message
        });
    }
};

exports.getStudentExamResult = async (req, res) => {
    try {
        const { examId, userId } = req.params;

        const result = await Result.findOne({ examId, userId })
            .populate('userId', 'name email')
            .populate('examId', 'examName subject totalMarks passingMarks');

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "No result found for this student in this exam"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Result fetched successfully",
            data: result,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching student exam result:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student exam result",
            error: error.message
        });
    }
};

exports.deleteResult = async (req, res) => {
    try {
        const { resultId } = req.params;

        const result = await Result.findByIdAndDelete(resultId);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Result deleted successfully",
            token: req.token
        });
    } catch (error) {
        console.error("Error deleting result:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete result",
            error: error.message
        });
    }
};