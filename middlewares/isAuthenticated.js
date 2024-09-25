import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({})

const isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.token;

        // Check if the token is missing
        if (!token) {
            return res.status(401).json({ message: "User not authenticated", success: false });
        }
        
        // Verify the token
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        
        // Check if the token could not be decoded
        if (!decode) {
            return res.status(403).json({ message: "Invalid token", success: false });
        }

        // Attach user ID to the request object for future middleware/controllers
        req.id = decode.userId;

        // Proceed to the next middleware
        next();

    } catch (error) {
        console.error("Authentication error:", error);

        // Send a 500 Internal Server Error response for any unexpected errors
        return res.status(500).json({ message: "Server error during authentication", success: false });
    }
};

export default isAuthenticated;
