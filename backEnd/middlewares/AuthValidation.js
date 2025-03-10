const Joi = require("joi");

const signupValidation = (req, res, next) => {
    console.log("Incoming Request Body:", req.body); 

    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string()
            .min(6)
            .max(100)
            .pattern(new RegExp("^(?=.*[A-Z])(?=.*\\d).+$")) 
            .required()
            .messages({
                "string.pattern.base": "Password must contain at least one uppercase letter and one number."
            }),
        role: Joi.string()
            .valid("student", "exam_creator") 
            .default("student")
    });

    const { error } = schema.validate(req.body);
    if (error) {
        console.error("Validation Error:", error.details[0].message); 
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required(), 
        password: Joi.string().min(6).max(100).required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: "Bad request", error: error.details[0].message });
    }
    next();
};

module.exports = {
    signupValidation,
    loginValidation
};
