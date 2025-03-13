const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/Student");


router.post("/submit", studentController.submitAnswer);
router.get("/:userId/:examId", studentController.getStudentAnswers);
router.put("/update", studentController.updateAnswer);
router.delete("/:userId/:examId", studentController.deleteSubmission);

module.exports = router;
