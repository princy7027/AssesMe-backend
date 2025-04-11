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

        // Format question data
        const formattedQuestionData = questionData.map(q => ({
            questionText: q.questionText,
            questionTopic: q.questionTopic,
            queType: q.queType,
            options: q.queType === 'MCQ' ? q.options : [],
            correctAnswer: q.correctAnswer.trim(),
            marks: q.marks || 1
        }));

        const questions = new Question({
            examId,
            questionData: formattedQuestionData
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
        const { questionNumber, questionText, questionTopic, queType, options, correctAnswer, marks } = req.body;

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

        // Update question with new data
        questions.questionData[questionIndex] = {
            ...questions.questionData[questionIndex],
            questionText: questionText || questions.questionData[questionIndex].questionText,
            questionTopic: questionTopic || questions.questionData[questionIndex].questionTopic,
            queType: queType || questions.questionData[questionIndex].queType,
            options: queType === 'MCQ' ? options : [],
            correctAnswer: correctAnswer ? correctAnswer.trim() : questions.questionData[questionIndex].correctAnswer,
            marks: marks || questions.questionData[questionIndex].marks
        };

        await questions.save();

        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: questions.questionData[questionIndex],
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

        // Remove the question
        questions.questionData = questions.questionData.filter(
            q => q.questionNumber !== questionNumber
        );

        // Renumber remaining questions
        questions.questionData.forEach((q, index) => {
            q.questionNumber = index + 1;
        });

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