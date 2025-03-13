const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

const StudentSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId, 
        ref: "Users"  
    },
    examId:{
        type: Schema.Types.ObjectId, 
        ref: "Exams" 
    },
    answer:[
        {
            questionId:Number,
            answer:String,
            time:Date //after what second user go to next questions 
        }
    ]
});

const Student = mongoose.model('students', StudentSchema);
module.exports = Student;
