const { roleSchema } = require("../Models/Roles");
exports.fetchRoleByName = async(req,res)=>{
    try {
        const roleName = req.body;
        const role = roleSchema.find(roleName);
        if(!role){
            return res.status.json({
                success:true,
                data:"No role Found",
                message:"Role Name Not matched"
            })
        }
        if(role){
            return 
        }
    } catch (error) {
        return res.status.json({
            success:false,
            message:"Something went wrong"
        })
    }
}