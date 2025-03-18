const express = require("express");
const { createDiscussion, getDiscussionsByExam, deleteDiscussion } = require("../Controllers/Discussion");
const router = express.Router();

// Create a new discussion
router.post("/add-Discussion", createDiscussion);

// Get all discussions for an exam
router.get("/:examId", getDiscussionsByExam);

// Delete a discussion
router.delete("/:discussionId", deleteDiscussion);

module.exports = router;
