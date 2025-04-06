const mongoose = require('mongoose');

const parseAIResponse = (rawResponse) => {
    try {
        if (!rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text) {
            console.log('Raw response:', JSON.stringify(rawResponse, null, 2));
            throw new Error("Invalid response structure");
        }

        const text = rawResponse.candidates[0].content.parts[0].text;
        const questions = [];
        
        // Split by Question number
        const questionBlocks = text.split(/Question \d+:/);
        
        // Process each question block
        questionBlocks.forEach((block, index) => {
            if (!block.trim()) return; // Skip empty blocks

            const parts = block.split('\n');
            const questionText = parts[0].trim();
            
            // Extract options and correct answer
            const optionsText = parts[1];
            const optionsList = optionsText.split(/(?=[a-d]\))/);
            
            const currentQuestion = {
                _id: new mongoose.Types.ObjectId(),
                questionText,
                options: [],
                queType: "MCQ",
                difficultyLevel: "medium",
                marks: 5,
                isActive: true,
                topicName: "Networking",
                correctAnswer: [],
                questionNumber: index + 1
            };

            // Process options
            optionsList.forEach(opt => {
                if (!opt.trim()) return;
                
                const isCorrect = opt.includes('(Correct)');
                const cleanOption = opt.replace('(Correct)', '').trim();
                const [label, ...textParts] = cleanOption.split(')');
                const optionText = textParts.join(')').trim();

                if (isCorrect) {
                    currentQuestion.correctAnswer = [optionText];
                }

                currentQuestion.options.push({
                    _id: new mongoose.Types.ObjectId(),
                    label: label.trim(),
                    text: optionText,
                    isCorrect
                });
            });

            questions.push(currentQuestion);
        });

        if (questions.length === 0) {
            throw new Error("No questions found in the response");
        }

        // Validate questions
        questions.forEach(question => {
            if (!question.options.length) {
                throw new Error(`Question "${question.questionText}" has no options`);
            }
            if (!question.options.some(opt => opt.isCorrect)) {
                throw new Error(`Question "${question.questionText}" has no correct option marked`);
            }
        });

        return {
            success: true,
            data: questions
        };

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