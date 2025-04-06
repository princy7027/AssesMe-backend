const Question = require("../Models/question");
const Exam = require("../Models/exam");

exports.createQuestions = async (req, res) => {
    try {
        const { examId } = req.params;
        const { questionData } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        const questions = new Question({
            examId,
            questionData
        });

        await questions.save();

        return res.status(201).json({
            success: true,
            message: "Questions created successfully",
            data: questions,
            token: req.token
        });
    } catch (error) {
        console.error("Error creating questions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create questions",
            error: error.message
        });
    }
};

exports.getQuestionsByExamId = async (req, res) => {
    try {
        const { examId } = req.params;
        const questions = await Question.findOne({ examId });

        if (!questions) {
            return res.status(404).json({
                success: false,
                message: "No questions found for this exam"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            data: questions,
            token: req.token
        });
    } catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch questions",
            error: error.message
        });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { examId } = req.params;
        const { questionNumber, updates } = req.body;

        const questions = await Question.findOne({ examId });
        if (!questions) {
            return res.status(404).json({
                success: false,
                message: "Questions not found"
            });
        }

        const questionIndex = questions.questionData.findIndex(
            q => q.questionNumber === questionNumber
        );

        if (questionIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Question not found"
            });
        }

        // Handle options update if present
        if (updates.options) {
            updates.options = updates.options.map(updateOption => {
                const existingOption = questions.questionData[questionIndex].options.find(
                    opt => opt._id.toString() === updateOption._id
                );
                if (existingOption) {
                    return {
                        ...existingOption.toObject(),
                        ...updateOption
                    };
                }
                return updateOption;
            });
        }

        Object.assign(questions.questionData[questionIndex], updates);
        await questions.save();

        // Return only the updated question
        const updatedQuestion = questions.questionData[questionIndex];

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion,
            token: req.token
        });
    } catch (error) {
        console.error("Error updating question:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to update question",
            error: error.message
        });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { examId } = req.params;
        const { questionNumber } = req.body;

        const questions = await Question.findOne({ examId });
        if (!questions) {
            return res.status(404).json({
                success: false,
                message: "Questions not found"
            });
        }

        questions.questionData = questions.questionData.filter(
            q => q.questionNumber !== questionNumber
        );
        await questions.save();

        return res.status(200).json({
            success: true,
            message: "Question deleted successfully",
            data: questions,
            token: req.token
        });
    } catch (error) {
        console.error("Error deleting question:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete question",
            error: error.message
        });
    }
};