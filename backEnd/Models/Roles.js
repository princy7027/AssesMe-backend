const roleSchema = new Schema({
    roleName:{
        type:String,
        required:true
    },
    rights:[],

})
//Example:
// roleName: examiner,
// right: [create-exams , marks , students-data , terminate-user]

exports.roleSchema = new mongoose.model('roles' , roleSchema);