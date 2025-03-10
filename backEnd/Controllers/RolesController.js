const { roleSchema } = require("../Models/Roles");
//from frontend we'll call this api where rolename will be passed in req bdy from there fetch name here 
// and see which rights have to particular user
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
            return //here return role right 
        }
    } catch (error) {
        return res.status.json({
            success:false,
            message:"Something went wrong"
        })
    }
}