import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

//verify token
function adminMiddleware(req, resp, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return resp.status(401).json({ errors: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_ADMIN_PASSWORD);
        console.log("Decoded Token:", decoded);  
        req.adminId = decoded.id;
        next();
        
    } catch (error) {
        console.log("Invalid token", error);
        return resp.status(401).json({ errors: "Invalid token" });
    }
}

export default adminMiddleware;