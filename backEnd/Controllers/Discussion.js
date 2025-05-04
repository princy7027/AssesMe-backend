const Discussion = require("../Models/discussion");
const Exam = require("../Models/exam");

exports.createDiscussion = async (req, res) => {
    try {
        const { examId, text } = req.body;
        const studentId = req.user._id; 

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        const newDiscussion = new Discussion({
            examId,
            studentId,
            text
        });

        await newDiscussion.save();

        return res.status(201).json({
            success: true,
            message: "Discussion added successfully",
            data: newDiscussion,
            token: req.token
        });
    } catch (error) {
        console.error("Error adding discussion:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to add discussion",
            error: error.message
        });
    }
};

exports.getDiscussionsByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        const discussions = await Discussion.find({ examId, isActive: true })
            .populate("studentId", "name email")
            .populate("examId", "examName") 
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Discussions fetched successfully",
            data: discussions,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch discussions",
            error: error.message
        });
    }
};


exports.deleteDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({
                success: false,
                message: "Discussion not found"
            });
        }

        discussion.isActive = false;  // Soft delete
        await discussion.save();

        return res.status(200).json({
            success: true,
            message: "Discussion deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting discussion:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete discussion",
            error: error.message
        });
    }
};
