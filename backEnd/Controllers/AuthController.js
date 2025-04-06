const UserModel = require("../Models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (role === "admin") {
            return res.status(403).json({
                message: "You cannot register as an admin.",
                success: false
            });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists, please log in.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new UserModel({ 
            name, 
            email, 
            password: hashedPassword, 
            role: role || "student" 
        });

        await user.save();

        res.status(201).json({
            message: "Signup successful",
            success: true,
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await UserModel.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({ message: "User not found, please sign up first.", success: false });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect password!", success: false });
        }

        const token = jwt.sign(
            { 
                email: existingUser.email, 
                _id: existingUser._id, 
                role: existingUser.role,
                name: existingUser.name
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful!",
            success: true,
            token,
            user: {
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role
            }
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = { signup, login };
