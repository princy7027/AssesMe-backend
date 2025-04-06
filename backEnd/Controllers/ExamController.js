const Exam = require("../Models/exam");
const Question = require("../Models/question");

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
        const exams = await Exam.find();
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