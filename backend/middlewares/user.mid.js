import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

// Middleware to verify token
function userMiddleware(req, resp, next) {
    const authHeader = req.headers.authorization;

    // Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return resp.status(401).json({ errors: "No token provided or invalid format" });
    }

    // Extract token after "Bearer "
    const token = authHeader.split(" ")[1];

    try {
        // Verify token using the secret stored in environment variables
        const decoded = jwt.verify(token, process.env.JWT_USER_PASSWORD);
        
        // You can add other checks like role-based authorization here
        console.log("Decoded Token:", decoded);  // Log for debugging, but avoid in production
        
        // Attach userId to the request object to use in route handler
        req.userId = decoded.id;
        
        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle invalid token or expired token
        console.log("Invalid token:", error);  // Log the error
        return resp.status(401).json({ errors: "Invalid token or expired" });
    }
}

export default userMiddleware;
