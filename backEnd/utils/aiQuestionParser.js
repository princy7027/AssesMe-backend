// const parseAIResponse = (rawResponse, topic) => {
//     try {
//         const text = rawResponse?.candidates?.[0]?.content?.parts?.[0]?.text;
//         console.log("Raw text received:", text);

//         if (!text) {
//             throw new Error("Invalid response structure");
//         }

//         const questions = [];
//         const questionBlocks = text.split(/Question \d+:/).filter(block => block.trim());
        
//         questionBlocks.forEach((block, index) => {
//             const lines = block.split('\n').filter(line => line.trim());
            
//             const currentQuestion = {
//                 questionNumber: index + 1,
//                 questionText: lines[0].trim(),
//                 questionTopic: topic, 
//                 queType: "MCQ",
//                 options: [],
//                 correctAnswer: ''
//             };

            
//             lines.forEach(line => {
//                 const optionMatch = line.match(/^([a-d])\)(.*)/);
//                 if (optionMatch) {
//                     const optionText = optionMatch[2].trim();
//                     currentQuestion.options.push(optionText);
                    
//                     if (optionText.includes('(Correct)')) {
//                         currentQuestion.correctAnswer = optionText.replace('(Correct)', '').trim();
//                     }
//                 }
//             });

//             if (currentQuestion.options.length >= 2 && currentQuestion.correctAnswer) {
//                 currentQuestion.options = currentQuestion.options.map(opt => 
//                     opt.replace('(Correct)', '').trim()
//                 );
//                 questions.push(currentQuestion);
//             }
//         });

//         if (questions.length === 0) {
//             throw new Error("No valid questions found in the response");
//         }

//         return {
//             success: true,
//             data: {
//                 questionData: questions
//             }
//         };

//     } catch (error) {
//         console.error("Parsing error:", error);
//         return {
//             success: false,
//             error: error.message
//         };
//     }
// };

// module.exports = { parseAIResponse };


const parseAIResponse = (response, mainTopic) => {
    try {
        const text = response.candidates[0].content.parts[0].text;
        const questions = text.split('\n\n');
        
        const questionData = questions.map((q, index) => {
            const lines = q.trim().split('\n');
            
            // Extract topic and question
            const topicLine = lines.find(line => line.startsWith('Topic:'));
            const questionTopic = topicLine ? 
                topicLine.split(':')[1].trim() : 
                mainTopic;

            const questionLine = lines.find(line => line.startsWith('Question'));
            const questionText = questionLine ? 
                questionLine.split(':')[1].trim() : 
                '';

            // Extract options and correct answer
            const options = lines.filter(line => /^[a-d]\)/.test(line.trim()))
                .map(line => line.trim().substring(3).trim());
            
            const correctLine = lines.find(line => line.includes('(Correct)'));
            const correctAnswer = correctLine ? 
                correctLine.substring(3, correctLine.indexOf('(Correct)')).trim() :
                options[0];

            return {
                questionNumber: index + 1,
                questionTopic,
                questionText,
                queType: "MCQ",
                options,
                correctAnswer,
            };
        }).filter(q => q.questionText && q.options.length > 0);

        return {
            success: true,
            data: {
                questionData
            }
        };
    } catch (error) {
        console.error('Error parsing AI response:', error);
        return {
            success: false,
            error: 'Failed to parse AI response'
        };
    }
};

module.exports = { parseAIResponse };