const { parseAIResponse } = require('../utils/aiQuestionParser');
const Question = require('../Models/question');

exports.generateAndSaveQuestions = async (req, res) => {
    try {
        const { examId, aiResponse } = req.body;

        const parsedQuestions = parseAIResponse(aiResponse);
        
        if (!parsedQuestions.success) {
            return res.status(400).json({
                success: false,
                message: "Failed to parse AI response",
                error: parsedQuestions.error
            });
        }

        // Find or create questions document
        let questions = await Question.findOne({ examId });
        if (!questions) {
            questions = new Question({
                examId,
                questionData: []
            });
        }

        // Add all new questions
        questions.questionData.push(...parsedQuestions.data);
        await questions.save();

        return res.status(201).json({
            success: true,
            message: "AI questions added successfully",
            data: parsedQuestions.data,
            token: req.token
        });
    } catch (error) {
        console.error("Error generating questions:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to generate questions",
            error: error.message
        });
    }
};