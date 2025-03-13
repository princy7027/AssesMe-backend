const Question = require("../Models/question");
const Exam = require("../Models/exam");
const mongoose = require("mongoose");

// Create a new question and add reference in Exam
const createQuestion = async (req, res) => {
    try {
        const { examId, questionData } = req.body;

        if (!mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: "Invalid Exam ID" });
        }

        const newQuestion = new Question({
            examId,
            questionData
        });

        const savedQuestion = await newQuestion.save();

        // Add the question reference to the Exam model
        await Exam.findByIdAndUpdate(examId, {
            $push: { questions: savedQuestion._id }
        });

        res.status(201).json({ message: "Question created successfully", question: savedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error creating question", error: error.message });
    }
};

// Get all questions with Exam details
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find().populate("examId");

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching questions", error: error.message });
    }
};

// Get a single question by ID
const getQuestionById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Invalid Question ID" });
        }

        const question = await Question.findById(req.params.id).populate("examId");

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ message: "Error fetching question", error: error.message });
    }
};

// Update a question and ensure Exam reference is maintained
const updateQuestion = async (req, res) => {
    try {
        const { examId, questionData } = req.body;
        const questionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(questionId) || !mongoose.Types.ObjectId.isValid(examId)) {
            return res.status(400).json({ message: "Invalid ID" });
        }

        const existingQuestion = await Question.findById(questionId);
        if (!existingQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Update the question
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { examId, questionData },
            { new: true }
        );

        // If the examId was changed, update the Exam references
        if (existingQuestion.examId.toString() !== examId) {
            await Exam.findByIdAndUpdate(existingQuestion.examId, {
                $pull: { questions: questionId }
            });

            await Exam.findByIdAndUpdate(examId, {
                $push: { questions: questionId }
            });
        }

        res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Error updating question", error: error.message });
    }
};

// Delete a question and remove reference from Exam
const deleteQuestion = async (req, res) => {
    try {
        const questionId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ message: "Invalid Question ID" });
        }

        const deletedQuestion = await Question.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        // Remove question reference from Exam
        await Exam.findByIdAndUpdate(deletedQuestion.examId, {
            $pull: { questions: questionId }
        });

        res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting question", error: error.message });
    }
};

module.exports = {
    createQuestion,
    getAllQuestions,
    getQuestionById,
    updateQuestion,
    deleteQuestion
};
