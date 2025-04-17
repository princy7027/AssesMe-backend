const mongoose = require('mongoose');

const parseAIResponse = (rawResponse) => {
    try {
        if (!rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Invalid response structure");
        }

        const text = rawResponse.candidates[0].content.parts[0].text;
        const cleanText = text.replace(/```json\n|\n```/g, '');
        
        try {
            const parsedData = JSON.parse(cleanText);
            if (!Array.isArray(parsedData)) {
                throw new Error("Response data is not an array");
            }

            const questions = parsedData.map((item, index) => {
                if (!item.questionData || !Array.isArray(item.questionData) || !item.questionData[0]) {
                    throw new Error(`Invalid question structure at index ${index}`);
                }

                const question = item.questionData[0];
                
                // Extract option texts from complex option objects
                const options = question.options.map(opt => 
                    typeof opt === 'string' ? opt : opt.optionText
                );

                // Extract correct answer
                const correctAnswer = typeof question.correctAnswer === 'string' ? 
                    question.correctAnswer : 
                    options.find((_, idx) => question.options[idx].isCorrect);

                return {
                    questionNumber: question.questionNumber || index + 1,
                    questionText: question.questionText.trim(),
                    questionTopic: question.questionTopic.trim(),
                    queType: question.queType,
                    options: options,
                    correctAnswer: correctAnswer
                };
            });

            // Validate questions
            questions.forEach(question => {
                if (!Array.isArray(question.options) || question.options.length !== 4) {
                    throw new Error(`Question "${question.questionText}" must have exactly 4 options`);
                }
                if (!question.correctAnswer) {
                    throw new Error(`Question "${question.questionText}" must have a correct answer`);
                }
            });

            return {
                success: true,
                data: questions
            };

        } catch (jsonError) {
            throw new Error(`JSON parsing error: ${jsonError.message}`);
        }

    } catch (error) {
        console.error("Parsing error:", error);
        return {
            success: false,
            error: 'Failed to parse AI response',
            details: error.message
        };
    }
};

module.exports = { parseAIResponse };