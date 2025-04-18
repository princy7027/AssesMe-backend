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
            isCurrentlyActive: false // Adding this field to match response
        };

        const updatedExam = await Exam.findOneAndUpdate(
            { _id: examId },
            updates,
            { 
                new: true,
                runValidators: true
            }
        ).lean(); // Using lean() to get plain JavaScript object

        if (!updatedExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        // Add id field to match response format
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

// ... existing code ...

exports.getUserExams = async (req, res) => {
    try {
        const { userId } = req.params;

        const exams = await Exam.find({ createdBy: userId })
            .sort('-createdAt')
            .select('examName subject startDate endDate duration totalMarks numberOfQuestions passingMarks isActive status');

        if (!exams || exams.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No exams found for this user"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User's exams fetched successfully",
            data: exams,
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
