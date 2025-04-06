const signupValidation = (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required",
            success: false
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            success: false
        });
    }

    // Password validation (minimum 6 characters)
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
            success: false
        });
    }

    // Role validation
    if (role && !['admin', 'teacher', 'student'].includes(role)) {
        return res.status(400).json({
            message: "Invalid role",
            success: false
        });
    }

    next();
};

const loginValidation = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required",
            success: false
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            message: "Invalid email format",
            success: false
        });
    }

    next();
};

module.exports = { signupValidation, loginValidation };