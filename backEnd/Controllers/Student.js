
const mongoose = require("mongoose");
const Student = require("../Models/student");

exports.submitAnswer = async (req, res) => {
    try {
        const { userId, examId, answer } = req.body;

        if (!userId || !examId || !answer) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let student = await Student.findOne({ userId, examId });

        if (student) {
            return res.status(400).json({ message: "Answers already submitted!" });
        }

        student = new Student({ userId, examId, answer });
        await student.save();

        res.status(201).json({ message: "Answer submitted successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getStudentAnswers = async (req, res) => {
    try {
        const { userId, examId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: "Invalid userId or examId" });
        }

        const student = await Student.findOne({ userId, examId });

        if (!student) {
            return res.status(404).json({ message: "No answers found!" });
        }

        res.status(200).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.updateAnswer = async (req, res) => {
    try {
        const { userId, examId, questionId, answer } = req.body;

        if (!userId || !examId || !questionId || !answer) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        let student = await Student.findOne({ userId, examId });

        if (!student) {
            return res.status(404).json({ message: "No submission found!" });
        }

        const index = student.answer.findIndex(q => q.questionId === questionId);
        if (index !== -1) {
            student.answer[index].answer = answer;
            student.answer[index].time = new Date();
        } else {
            student.answer.push({ questionId, answer, time: new Date() });
        }

        await student.save();
        res.status(200).json({ message: "Answer updated successfully!", student });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};


exports.deleteSubmission = async (req, res) => {
    try {
        const { userId, examId } = req.params;

        const student = await Student.findOneAndDelete({ userId, examId });

        if (!student) {
            return res.status(404).json({ message: "No submission found!" });
        }

        res.status(200).json({ message: "Submission deleted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
