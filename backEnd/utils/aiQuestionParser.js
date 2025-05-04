const parseAIResponse = (rawResponse, topic) => {
    try {
        const text = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
        console.log("Raw text received:", text);

        if (!text) {
            throw new Error("Invalid response structure");
        }

        const questions = [];
        const questionBlocks = text.split(/Question \d+:/).filter(block => block.trim());
        
        questionBlocks.forEach((block, index) => {
            const lines = block.split('\n').filter(line => line.trim());
            
            const currentQuestion = {
                questionNumber: index + 1,
                questionText: lines[0].trim(),
                questionTopic: topic, 
                queType: "MCQ",
                options: [],
                correctAnswer: ''
            };

            
            lines.forEach(line => {
                const optionMatch = line.match(/^([a-d])\)(.*)/);
                if (optionMatch) {
                    const optionText = optionMatch[2].trim();
                    currentQuestion.options.push(optionText);
                    
                    if (optionText.includes('(Correct)')) {
                        currentQuestion.correctAnswer = optionText.replace('(Correct)', '').trim();
                    }
                }
            });

            if (currentQuestion.options.length >= 2 && currentQuestion.correctAnswer) {
                currentQuestion.options = currentQuestion.options.map(opt => 
                    opt.replace('(Correct)', '').trim()
                );
                questions.push(currentQuestion);
            }
        });

        if (questions.length === 0) {
            throw new Error("No valid questions found in the response");
        }

        return {
            success: true,
            data: {
                questionData: questions
            }
        };

    } catch (error) {
        console.error("Parsing error:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = { parseAIResponse };


