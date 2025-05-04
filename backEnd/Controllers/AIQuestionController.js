const Question = require('../Models/question');
const { parseAIResponse } = require('../utils/aiQuestionParser');
const axios = require('axios');

const AIQuestionController = {
    generateQuestionsWithAI: async (req, res) => {
        try {
            const { examId, numberOfQuestions, topic } = req.body;
            const token = req.token; 

            if (!examId || !numberOfQuestions || !topic) {
                return res.status(400).json({
                    success: false,
                    message: "Missing required fields",
                    token
                });
            }

            const prompt = {
                contents: [{
                    parts: [{
                        text: `Create ${numberOfQuestions} questions about ${topic} with multiple choice answers. Make sure questions are related to ${topic}
                        concepts and knowledge. Format each question exactly like this: Question 1: [Write the question here]a) [option]b) [option]c) [option]d) [option]Add (Correct) 
                        after the right answer.Leave one blank line between questions.`
                    }]
                }]
            };
            // const prompt = {
            //     contents: [{
            //         parts: [{
            //             text: `Create ${numberOfQuestions} questions about ${topic} with multiple choice answers. Make sure questions are related to ${topic}
            //             concepts and knowledge. Format each question exactly like this: 
            //             Topic: [Specific subtopic related to the question]
            //             Question 1: [Write the question here]a) [option]b) [option]c) [option]d) [option]Add (Correct) after the right answer.Leave one blank line between questions.`
            //         }]
            //     }]
            // };
            const geminiResponse = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAYglf4vywoUI4v_w-gRUp3wJcfukVsn88',
                prompt,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const parsedQuestions = parseAIResponse(geminiResponse.data, topic);
            
            if (!parsedQuestions.success) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to parse AI response",
                    error: parsedQuestions.error,
                    token
                });
            }

            const questionDoc = await Question.findOneAndUpdate(
                { examId },
                { 
                    examId,
                    questionData: parsedQuestions.data.questionData
                },
                { 
                    new: true, 
                    upsert: true,
                    runValidators: true 
                }
            );

            return res.status(201).json({
                success: true,
                message: "Questions generated and saved successfully",
                data: questionDoc.questionData,
                token
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to generate questions",
                error: error.message,
                token: req.token
            });
        }
    },

    generateAndSaveQuestions: async (req, res) => {
        try {
            const { examId, aiResponse } = req.body;
            const token = req.token;

            if (!examId || !aiResponse) {
                return res.status(400).json({
                    success: false,
                    message: "Missing examId or AI response",
                    token
                });
            }

            const parsedQuestions = parseAIResponse(aiResponse, aiResponse.topic || "General");
            
            if (!parsedQuestions.success) {
                return res.status(400).json({
                    success: false,
                    message: "Failed to parse AI response",
                    error: parsedQuestions.error,
                    token
                });
            }

            const questionDoc = await Question.findOneAndUpdate(
                { examId },
                { 
                    examId,
                    questionData: parsedQuestions.data.questionData
                },
                { 
                    new: true, 
                    upsert: true,
                    runValidators: true 
                }
            );

            return res.status(201).json({
                success: true,
                message: "Questions saved successfully",
                data: questionDoc.questionData,
                token
            });

        } catch (error) {
            console.error("Error:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to save questions",
                error: error.message,
                token: req.token
            });
        }
    }
};

module.exports = AIQuestionController;
