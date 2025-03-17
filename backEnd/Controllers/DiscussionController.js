const Discussion = require("../Models/discussion");
const Exam = require("../Models/exam");
const Student = require("../Models/student");
const mongoose = require("mongoose");

exports.addDiscussion = async (req, res) => {
    try {
        const { examId, studentId, discussionText } = req.body;

        // Validate examId and studentId
        if (!examId || !studentId || !discussionText) {
            return res.status(400).json({ error: "examId, studentId, and discussionText are required" });
        }

        // Ensure examId and studentId are valid MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(examId) || !mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ error: "Invalid examId or studentId" });
        }

        // Find existing discussion for the exam
        let discussion = await Discussion.findOne({ examId });

        if (!discussion) {
            discussion = new Discussion({ examId, discussions: [] });
        }

        // Ensure discussions is an array
        if (!Array.isArray(discussion.discussions)) {
            discussion.discussions = [];
        }

        // Create a new discussion entry
        const newDiscussion = { studentId, discussionText, createdAt: new Date() };
        discussion.discussions.push(newDiscussion);

        // Save updated document
        await discussion.save();

        res.status(201).json(newDiscussion);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add discussion', details: error.message });
    }
};

exports.getDiscussionByExam = async (req, res) => {
    try {
        const { examId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ error: "Invalid examId" });
        }

        // Use `comments` instead of `discussions`
        const discussion = await Discussion.findOne({ examId })
            .populate('comments.studentId', 'name');

        res.status(200).json(discussion || { examId, comments: [] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch discussion', details: error.message });
    }
};



exports.editDiscussion = async (req, res) => {
    try {
        const { examId, discussionId } = req.params;
        const { discussionText } = req.body;

        if (!mongoose.Types.ObjectId.isValid(examId) || !mongoose.Types.ObjectId.isValid(discussionId)) {
            return res.status(400).json({ error: "Invalid examId or discussionId" });
        }

        const discussion = await Discussion.findOneAndUpdate(
            { examId, 'discussions._id': discussionId },
            { $set: { 'discussions.$.discussionText': discussionText } },
            { new: true }
        );

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.status(200).json({ message: 'Discussion updated' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update discussion' });
    }
};

exports.deleteDiscussion = async (req, res) => {
    try {
        const { examId, discussionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(examId) || !mongoose.Types.ObjectId.isValid(discussionId)) {
            return res.status(400).json({ error: "Invalid examId or discussionId" });
        }

        const updatedDiscussion = await Discussion.findOneAndUpdate(
            { examId },
            { $pull: { discussions: { _id: discussionId } } },
            { new: true }
        );

        if (!updatedDiscussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.status(200).json({ message: 'Discussion deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete discussion' });
    }
};
