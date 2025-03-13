const Exam = require("../Models/exam");

// controller to create exam
exports.createExam = async (req, res) => {
    try {
        const examdata = req.body;

        const data = new Exam(examdata);

        // Save the exam to the database
        await data.save();

        return res.status(201).json({
            success: true,
            message: "Exam created successfully",
            data: data
        });

    } catch (error) {
        console.error("Error creating exam -->", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


exports.getAllExamData = async(req, res)=>{
    try {
        const data =await Exam.find();

        if(data){
            return res.status(200).json({
                success:true,
                data:data,
                message:"Data fetched successfully"
            })
        }
    } catch (error) {
        console.error("Error fetching exams -->", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}


exports.updateExam = async (req, res) => {
    try {
        const { id } = req.params;  // Get exam ID from URL
        const updatedData = req.body;  // Get new data

        const updatedExam = await Exam.findByIdAndUpdate(id, updatedData, {
            new: true,  // Return the updated document
        });

        if (!updatedExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Exam updated successfully",
            data: updatedExam
        });

    } catch (error) {
        console.error("Error updating exam -->", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.deleteExam = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedExam = await Exam.findByIdAndDelete(id);

        if (!deletedExam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Exam deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting exam -->", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};



exports.getExamById = async (req, res) => {
    try {
        const { id } = req.params;

        const exam = await Exam.findById(id);

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Exam retrieved successfully",
            data: exam
        });

    } catch (error) {
        console.error("Error retrieving exam -->", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

