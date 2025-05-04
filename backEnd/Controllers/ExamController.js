const Exam = require("../Models/exam");
const Question = require("../Models/question");
const Response = require("../Models/result");
const User = require("../Models/user");


exports.createExam = async (req, res) => {
    try {
        const examData = {
            ...req.body,
            createdBy: req.user._id,
            createdAt: new Date(),
            status: 'draft'
        };

        const exam = new Exam(examData);
        await exam.save();

        return res.status(201).json({
            success: true,
            message: "Exam created successfully",
            data: exam,
            token: req.token
        });
    } catch (error) {
        console.error("Error creating exam:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create exam",
            error: error.message
        });
    }
};

exports.getAllExams = async (req, res) => {
    try {
        const exams = await Exam.getAllExams(); 
        return res.status(200).json({
            success: true,
            message: "Exams fetched successfully",
            data: exams,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching exams:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch exams",
            error: error.message
        });
    }
};

exports.getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        const questions = await Question.findOne({ examId: req.params.id });

        return res.status(200).json({
            success: true,
            message: "Exam fetched successfully",
            data: {
                exam,
                questions: questions ? questions.questionData : []
            },
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching exam:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch exam",
            error: error.message
        });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const examId = req.params.id;
        await Question.deleteMany({ examId });
        const exam = await Exam.findByIdAndDelete(examId);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Exam and associated questions deleted successfully",
            token: req.token
        });
    } catch (error) {
        console.error("Error deleting exam:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete exam",
            error: error.message
        });
    }
};

exports.getActiveExams = async (req, res) => {
    try {
        const exams = await Exam.find({
            status: 'published',
            isActive: true
        });

        return res.status(200).json({
            success: true,
            message: "Active exams fetched successfully",
            data: exams,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching active exams:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch active exams",
            error: error.message
        });
    }
};
exports.updateExam = async (req, res) => {
    try {
        const examId = req.params.id;
        const updates = {
            ...req.body,
            editedAt: new Date(),
            editedBy: req.user._id,
            updatedAt: new Date(),
            isCurrentlyActive: false 
        };

        const updatedExam = await Exam.findOneAndUpdate(
            { _id: examId },
            updates,
            { 
                new: true,
                runValidators: true
            }
        ).lean(); 
        if (!updatedExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        updatedExam.id = updatedExam._id.toString();

        return res.status(200).json({
            success: true,
            message: "Exam updated successfully",
            data: updatedExam,
            token: req.token
        });
    } catch (error) {
        console.error("Error updating exam:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update exam",
            error: error.message
        });
    }
};

exports.getStudentExamResponses = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const responses = await Response.find({ userId: studentId })
            .populate({
                path: 'examId',
                select: 'examName subject startDate endDate duration totalMarks passingMarks'
            });

        const examsList = responses.map(response => ({
            exam: response.examId,
            submittedAt: response.submittedAt,
            score: response.score,
            isPassed: response.isPassed,
            totalQuestions: response.responses.length,
            correctAnswers: response.responses.filter(r => r.isCorrect).length
        }));

        return res.status(200).json({
            success: true,
            message: "Student's exam responses fetched successfully",
            data: examsList
        });

    } catch (error) {
        console.error("Error fetching student's exam responses:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student's exam responses",
            error: error.message
        });
    }
};

exports.getUserExams = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all exams created by the user
        const exams = await Exam.find({ createdBy: userId })
            .sort('-createdAt')
            .select('examName subject startDate endDate duration totalMarks numberOfQuestions passingMarks isActive status examStatus');

        if (!exams || exams.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No exams found for this user"
            });
        }

        // Get all responses for these exams
        const examIds = exams.map(exam => exam._id);
        const responses = await Response.find({ examId: { $in: examIds } })
            .populate([
                {
                    path: 'userId',
                    select: 'name email'
                },
                {
                    path: 'examId',
                    select: '_id'
                }
            ])
            .select('score isPassed submittedAt responses userId examId');

        // Combine exam data with responses
        const examsWithResponses = exams.map(exam => {
            const examResponses = responses.filter(response => 
                response.examId && response.examId._id.toString() === exam._id.toString()
            );

            return {
                ...exam.toObject(),
                responses: examResponses.map(response => ({
                    student: response.userId,
                    submittedAt: response.submittedAt,
                    score: response.score,
                    isPassed: response.isPassed,
                    totalAttempted: response.responses?.length || 0,
                    correctAnswers: response.responses?.filter(r => r.isCorrect).length || 0,
                    wrongAnswers: response.responses?.filter(r => !r.isCorrect).length || 0,
                    percentage: ((response.score / (exam.totalMarks || 1)) * 100).toFixed(2)
                })),
                totalSubmissions: examResponses.length,
                averageScore: examResponses.length > 0 
                    ? (examResponses.reduce((acc, curr) => acc + (curr.score || 0), 0) / examResponses.length).toFixed(2)
                    : 0
            };
        });

        return res.status(200).json({
            success: true,
            message: "User's exams and responses fetched successfully",
            data: examsWithResponses,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching user's exams:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user's exams",
            error: error.message
        });
    }
};

exports.getStudentExamsWithResults = async (req, res) => {
    try {
        const studentId = req.params.studentId;

        const student = await User.findOne({ _id: studentId, role: 'student' });
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        const examResponses = await Response.find({ userId: studentId })
            .populate({
                path: 'examId',
                select: 'examName subject startDate endDate duration totalMarks numberOfQuestions passingMarks'
            })
            .sort('-submittedAt');

        const examResults = examResponses.map(response => ({
            examDetails: {
                examId: response.examId?._id,
                examName: response.examId?.examName,
                subject: response.examId?.subject,
                totalMarks: response.examId?.totalMarks,
                passingMarks: response.examId?.passingMarks,
                duration: response.examId?.duration,
                numberOfQuestions: response.examId?.numberOfQuestions
            },
            resultDetails: {
                submittedAt: response.submittedAt,
                isPassed: response.isPassed,
                totalAttempted: response.totalAttempted,
                correctAnswers: response.correctAnswers,
                wrongAnswers: response.wrongAnswers,
                percentage: response.percentage
            }
        }));

        return res.status(200).json({
            success: true,
            message: "Student's exam results fetched successfully",
            data: {
                studentName: student.name,
                totalExamsAttempted: examResults.length,
                examResults
            },
            token: req.token
        });

    } catch (error) {
        console.error("Error fetching student's exam results:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student's exam results",
            error: error.message
        });
    }
};