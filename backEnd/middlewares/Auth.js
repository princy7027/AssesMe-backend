const jwt = require("jsonwebtoken");

const ensureAuthenticated = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    console.log("Received Auth Header:", authHeader); 

    if (!authHeader) {
        return res.status(403).json({
            message: "Unauthorized! No JWT token provided.",
            success: false
        });
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.log("Invalid Token Format:", parts); 
        return res.status(403).json({
            message: "Unauthorized! Invalid token format.",
            success: false
        });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded._id,  
            email: decoded.email, 
            role: decoded.role 
        };
        next();
    } catch (err) {
        console.error("JWT Verification Error:", err);
        return res.status(401).json({
            message: "Invalid or expired token.",
            success: false
        });
    }
};

const ensureRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                message: "Forbidden! You do not have permission.",
                success: false
            });
        }
        next();
    };
};

module.exports = { ensureAuthenticated, ensureRole };
