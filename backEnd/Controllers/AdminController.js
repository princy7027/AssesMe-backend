const User = require('../Models/user');
const Exam = require('../Models/exam');
const Result = require('../Models/result');

const getCreatorAnalytics = async (req, res) => {
    try {
        const creators = await User.find({ role: 'creator' });
        
        const analyticsData = await Promise.all(creators.map(async (creator) => {
            const exams = await Exam.find({ createdBy: creator._id });
            const examIds = exams.map(exam => exam._id);
            const totalStudents = await Result.countDocuments({ examId: { $in: examIds } });
            
            return {
                creatorName: creator.name,
                creatorEmail: creator.email,
                totalExams: exams.length,
                totalStudents,
                creatorId: creator._id,
                createdAt: creator.createdAt
            };
        }));

        res.status(200).json({
            success: true,
            data: analyticsData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching creator analytics",
            error: error.message
        });
    }
};

const removeCreator = async (req, res) => {
    try {
        const { creatorId } = req.params;
        const creator = await User.findById(creatorId);
        if (!creator || creator.role !== 'creator') {
            return res.status(404).json({
                success: false,
                message: "Creator not found"
            });
        }
        const exams = await Exam.find({ createdBy: creatorId });
        const examIds = exams.map(exam => exam._id);
        await Result.deleteMany({ examId: { $in: examIds } });
        await Exam.deleteMany({ createdBy: creatorId });
        await User.findByIdAndDelete(creatorId);

        res.status(200).json({
            success: true,
            message: "Creator and all associated data removed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing creator and associated data",
            error: error.message
        });
    }
};

module.exports = {
    getCreatorAnalytics,
    removeCreator
};