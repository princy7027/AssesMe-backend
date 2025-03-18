const Discussion = require("../Models/discussion");
const Exam = require("../Models/exam");

exports.createDiscussion = async (req, res) => {
    try {
        const { examId, studentId, text } = req.body;

        // Check if the exam exists
        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: "Exam not found" });
        }

        // Create a new discussion
        const newDiscussion = new Discussion({
            examId,
            studentId,
            text
        });

        await newDiscussion.save();

        return res.status(201).json({ 
            message: "Discussion added successfully", 
            discussion: newDiscussion 
        });
    } catch (error) {
        console.error("Error adding discussion:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getDiscussionsByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        // Fetch discussions for the given exam ID
        const discussions = await Discussion.find({ examId })
            // .populate("studentId", "name") // Populate student details
            // .sort({ createdAt: -1 }); // Sort by latest first

        return res.status(200).json({
            discussions,
            message: "Discussions fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching discussions:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteDiscussion = async (req, res) => {
    try {
        const { discussionId } = req.params;
        const { studentId } = req.body; // Student ID should be passed to verify ownership

        // Find the discussion
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        // Ensure only the author can delete their discussion
        if (discussion.studentId.toString() !== studentId) {
            return res.status(403).json({ message: "Unauthorized to delete this discussion" });
        }

        await Discussion.findByIdAndDelete(discussionId);

        return res.status(200).json({ message: "Discussion deleted successfully" });
    } catch (error) {
        console.error("Error deleting discussion:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
